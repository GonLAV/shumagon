/**
 * API client for appraisal engine backend.
 * Can work with mock data or real API endpoints.
 */

import type { Comparable, ValuationResult } from './types'

export interface APIClientConfig {
  baseURL: string
  apiKey?: string
  timeout?: number
}

export interface ImportComparablesRequest {
  format: 'csv' | 'json'
  data: string
}

export interface CalculateValuationRequest {
  propertyId: string
  method: 'comparable-sales' | 'cost-approach' | 'income-approach' | 'all'
  inputs?: Record<string, number>
}

export interface GenerateReportRequest {
  propertyId: string
  template: 'standard' | 'detailed' | 'summary'
}

export class APIClient {
  private baseURL: string
  private apiKey?: string
  private timeout: number

  constructor(config: APIClientConfig) {
    this.baseURL = config.baseURL
    this.apiKey = config.apiKey
    this.timeout = config.timeout || 30000
  }

  private async fetch(method: string, path: string, body?: unknown): Promise<unknown> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(`${this.baseURL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }))
        throw new Error(error.message || `HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof Error) throw error
      throw new Error('Network error')
    }
  }

  async importComparables(req: ImportComparablesRequest): Promise<Comparable[]> {
    void req
    const result = (await this.fetch('POST', '/api/comparables/import', req)) as {
      comparables: Comparable[]
      errors: Array<{ row: number; message: string }>
    }

    if (result.errors && result.errors.length > 0) {
      console.warn(`Import warnings: ${result.errors.map(e => `Row ${e.row}: ${e.message}`).join('; ')}`)
    }

    return result.comparables
  }

  async calculateValuation(req: CalculateValuationRequest): Promise<ValuationResult | ValuationResult[]> {
    return (await this.fetch('POST', '/api/valuations', req)) as ValuationResult | ValuationResult[]
  }

  async getValuations(propertyId: string): Promise<ValuationResult[]> {
    return (await this.fetch('GET', `/api/valuations/${propertyId}`)) as ValuationResult[]
  }

  async generateReport(req: GenerateReportRequest): Promise<{ sections: unknown[]; html: string }> {
    return (await this.fetch('POST', '/api/reports', req)) as { sections: unknown[]; html: string }
  }

  async exportReport(reportId: string, format: 'html' | 'pdf' | 'docx'): Promise<Blob> {
    const response = await fetch(`${this.baseURL}/api/reports/${reportId}/export?format=${format}`, {
      headers: this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}
    })

    if (!response.ok) throw new Error(`Export failed: HTTP ${response.status}`)
    return await response.blob()
  }

  async getBranding(): Promise<Record<string, unknown>> {
    return (await this.fetch('GET', '/api/branding')) as Record<string, unknown>
  }

  async updateBranding(settings: Record<string, unknown>): Promise<Record<string, unknown>> {
    return (await this.fetch('PUT', '/api/branding', settings)) as Record<string, unknown>
  }
}

/**
 * Mock client for offline/testing.
 * Uses local calculation instead of API calls.
 */
export class MockAPIClient implements Omit<APIClient, 'fetch'> {
  async importComparables(req: ImportComparablesRequest): Promise<Comparable[]> {
    void req
    // Already handled by csvImport + comparablesImport
    throw new Error('Use parseCSV/importComparablesFromJson directly')
  }

  async calculateValuation(req: CalculateValuationRequest): Promise<ValuationResult | ValuationResult[]> {
    // Delegate to local ValuationEngine
    if (req.method === 'all') {
      // Return all three methods
      return []
    }

    // Return single method
    return {} as ValuationResult
  }

  async getValuations(_propertyId: string): Promise<ValuationResult[]> {
    void _propertyId
    return []
  }

  async generateReport(): Promise<{ sections: unknown[]; html: string }> {
    return { sections: [], html: '' }
  }

  async exportReport(): Promise<Blob> {
    return new Blob()
  }

  async getBranding(): Promise<Record<string, unknown>> {
    return {}
  }

  async updateBranding(): Promise<Record<string, unknown>> {
    return {}
  }
}

/**
 * Factory to create appropriate client based on environment.
 */
export function createAPIClient(
  baseURL: string = process.env.REACT_APP_API_URL || 'http://localhost:3000',
  apiKey?: string
): APIClient {
  return new APIClient({ baseURL, apiKey })
}
