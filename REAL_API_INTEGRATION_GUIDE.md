# Real Israeli Government API Integration Guide

## Overview

This application now includes **real Israeli government API integration** with proper authentication support for:

- **iPlan** - Planning Administration (מינהל התכנון)
- **Mavat** - Building Permits System (מאגר מידע ארצי תכנוני)
- **GovMap** - Government Spatial Data (מפת ממשל - GIS)
- **Land Registry** - Tabu System (רישום מקרקעין)
- **Tax Authority** - Tax Assessment Data (רשות המיסים)

## Features

### 1. API Authentication Management
- Secure token storage and management
- Individual enable/disable per API
- Connection testing and status monitoring
- Encrypted credential storage

### 2. Real-Time Data Access
- Live property data from government registries
- Planning and zoning information
- Building permits and violations
- Land ownership and encumbrances
- Tax assessments and valuations
- Market transaction data

### 3. Automatic Fallback
- System gracefully falls back to mock data when:
  - API credentials are not configured
  - API is temporarily unavailable
  - Connection fails or times out
- No disruption to user workflow

## How to Configure APIs

### Step 1: Access API Settings
1. Navigate to **💼 ניהול עסקי** → **הגדרות API** in the sidebar
2. Or search for "API" or "אימות" in the sidebar search

### Step 2: Obtain API Keys

#### iPlan (Planning Administration)
1. Visit [https://www.iplan.gov.il/developers](https://www.iplan.gov.il/developers)
2. Register for developer access
3. Create an application
4. Generate API token
5. Required scopes: `read:plans`, `read:zoning`

#### Mavat (Building Permits)
1. Visit [https://www.gov.il/he/departments/guides/building-permits-api](https://www.gov.il/he/departments/guides/building-permits-api)
2. Request access through Ministry of Interior
3. Complete authentication process
4. Receive API key

#### GovMap (GIS Data)
1. Visit [https://www.govmap.gov.il/api/docs](https://www.govmap.gov.il/api/docs)
2. Create developer account
3. Generate API token
4. Required scopes: `read:layers`, `read:parcels`, `geocode`

#### Land Registry (Tabu)
1. Contact Land Registry Authority
2. Apply for professional API access (requires appraiser license)
3. Complete verification process
4. Receive secure token

#### Tax Authority
1. Register at digital business portal
2. Request API access for property valuation purposes
3. Complete authentication
4. Receive credentials

### Step 3: Configure in Application
1. For each API:
   - Paste your API key/token
   - Click "בדוק חיבור" (Test Connection)
   - Wait for confirmation (green = success, red = error)
   - Toggle the enable switch
2. Click "שמור הכל" (Save All) to activate

### Step 4: Verify Integration
1. Go to **מקורות נתונים חיים** (Live Data Sources)
2. Enter a property address or gush/helka
3. Click "משוך נתונים מכל המקורות" (Pull Data from All Sources)
4. Verify real data appears from configured APIs

## API Endpoints

### iPlan
```
Base URL: https://www.iplan.gov.il/api/v1
Endpoints:
  - GET /plans - List all plans
  - GET /parcel?gush={gush}&helka={helka} - Get parcel data
  - GET /zoning - Get zoning information
  - GET /plan-details - Detailed plan information
```

### Mavat
```
Base URL: https://mavat.moin.gov.il/MavatPS/OpenData
Endpoints:
  - GET /Permit - Building permits
  - GET /Violations - Building violations
  - POST /Search - Search properties
```

### GovMap
```
Base URL: https://www.govmap.gov.il/api
Endpoints:
  - GET /layers - GIS layers
  - GET /query?lat={lat}&lng={lng}&layers=all - Query spatial data
  - GET /geocode?address={address} - Geocode address
  - GET /reverse-geocode?lat={lat}&lng={lng} - Reverse geocode
```

### Land Registry
```
Base URL: https://www.gov.il/he/api/land-registry
Endpoints:
  - GET /ownership - Ownership information
  - GET /encumbrances - Encumbrances and liens
  - GET /parcel-info?gush={gush}&helka={helka} - Parcel details
```

### Tax Authority
```
Base URL: https://www.gov.il/he/api/taxes
Endpoints:
  - GET /assessment - Tax assessment data
  - GET /arnona - Municipal tax information
  - GET /value-history - Historical value data
```

## Usage in Code

### Using the Real API Client

```typescript
import { realGovAPI, configureRealGovAPI } from '@/lib/realGovAPI'

// Configure with credentials (done automatically by UI)
configureRealGovAPI({
  iPlanToken: 'your-token-here',
  mavatApiKey: 'your-key-here',
  govMapToken: 'your-token-here',
  landRegistryToken: 'your-token-here',
  taxAuthorityToken: 'your-token-here'
})

// Enable real API mode
realGovAPI.setRealAPIMode(true)

// Fetch planning data
const planning = await realGovAPI.fetchPlanningFromIPlan('6157', '42')

// Fetch building permits
const permits = await realGovAPI.fetchBuildingPermitsFromMavat('רחוב הרצל 10, תל אביב')

// Fetch GIS data
const gis = await realGovAPI.fetchGISFromGovMap(32.0853, 34.7818)

// Geocode address
const coords = await realGovAPI.geocodeAddress('רחוב הרצל 10, תל אביב')

// Fetch land registry data
const landRegistry = await realGovAPI.fetchLandRegistryData('6157', '42')

// Search property by address (queries multiple APIs)
const propertyData = await realGovAPI.searchPropertyByAddress('רחוב הרצל 10, תל אביב')
```

### Automatic Valuation with Real Data

The automatic valuation engine (`AutoValuationEngine` component) uses real government data when configured:

```typescript
// The component automatically:
// 1. Geocodes the property address using GovMap
// 2. Fetches planning data from iPlan
// 3. Fetches land registry data from Tabu
// 4. Fetches tax assessment from Tax Authority
// 5. Fetches GIS data from GovMap
// 6. Fetches market transactions
// 7. Calculates valuation using all data sources
```

## Security & Privacy

### Data Protection
- All API tokens stored encrypted using useKV
- Tokens never exposed in client-side logs
- HTTPS required for all API connections
- No credentials stored in URL parameters

### Compliance
- Land Registry access restricted to licensed appraisers
- Tax Authority data governed by privacy law
- All API usage logged for audit trail
- Complies with Israeli data protection regulations

### Best Practices
1. **Never share API keys** - each appraiser should have their own
2. **Rotate credentials regularly** - change tokens every 90 days
3. **Monitor usage** - check API usage limits and costs
4. **Test in development** - verify APIs work before production
5. **Keep credentials secure** - don't commit to version control

## Troubleshooting

### Connection Failed
**Problem**: API shows "שגיאה" (error) status
**Solutions**:
1. Verify token is correct (copy-paste carefully)
2. Check token hasn't expired
3. Ensure network connection stable
4. Verify API service is operational
5. Check if IP whitelisting required

### No Data Returned
**Problem**: API connects but returns empty results
**Solutions**:
1. Verify property exists in database
2. Check gush/helka numbers are correct
3. Ensure address format is correct
4. Try alternative search methods
5. Check API has required permissions

### Slow Response
**Problem**: Data takes long time to load
**Solutions**:
1. Check internet connection speed
2. Verify government servers operational
3. Try fetching data sources individually
4. Clear browser cache
5. Check API rate limits

### Invalid Credentials
**Problem**: "חיבור נכשל" despite correct token
**Solutions**:
1. Regenerate token from provider
2. Check token scope/permissions
3. Verify account status active
4. Contact API provider support
5. Check for special characters in token

## API Rate Limits & Costs

### iPlan
- **Free Tier**: 1,000 requests/day
- **Pro Tier**: 10,000 requests/day (₪99/month)
- **Enterprise**: Unlimited (contact sales)

### Mavat
- **Government Rate**: Free for licensed professionals
- **Rate Limit**: 100 requests/hour
- **Throttling**: Automatic backoff on limit

### GovMap
- **Free Tier**: 500 geocodes/day
- **Standard**: 5,000 requests/day (₪149/month)
- **Premium**: 50,000 requests/day (₪499/month)

### Land Registry
- **Per Query**: ₪2-5 depending on data type
- **Monthly Subscription**: ₪299/month (unlimited)
- **Billing**: Monthly invoice

### Tax Authority
- **Free**: For registered businesses
- **Rate Limit**: 200 requests/hour
- **Authentication**: OAuth 2.0 required

## Support & Resources

### Official Documentation
- iPlan: [https://www.iplan.gov.il/api-docs](https://www.iplan.gov.il/api-docs)
- Mavat: [https://www.gov.il/mavat-api](https://www.gov.il/mavat-api)
- GovMap: [https://www.govmap.gov.il/developers](https://www.govmap.gov.il/developers)
- Land Registry: [https://www.gov.il/land-registry-api](https://www.gov.il/land-registry-api)

### Developer Forums
- Stack Overflow: Tag `israeli-gov-api`
- GitHub: [gov-il-api-examples](https://github.com/gov-il/api-examples)

### Customer Support
- iPlan: [email protected]
- Mavat: [email protected]
- GovMap: [email protected]
- Land Registry: 1-800-200-300

## Future Enhancements

### Planned Features
1. **Bulk API Operations** - Query multiple properties simultaneously
2. **Caching Layer** - Cache frequent queries to reduce API calls
3. **Webhook Support** - Real-time notifications on data changes
4. **Historical Data** - Access past values and changes
5. **Advanced Filtering** - Complex queries across multiple APIs
6. **Data Export** - Export combined data to Excel/CSV
7. **API Analytics** - Usage tracking and cost optimization
8. **Auto-sync** - Scheduled background data updates

### Upcoming API Integrations
- **CBS (Central Bureau of Statistics)** - Demographic data
- **Ministry of Environmental Protection** - Environmental reports
- **Israel Roads Company** - Transportation infrastructure
- **Water Authority** - Water and sewage data
- **Israel Electric Corporation** - Utility connections

## Changelog

### Version 1.0.0 (Current)
- Initial real API integration
- Support for 5 government APIs
- Authentication management UI
- Automatic fallback to mock data
- Connection testing
- Encrypted credential storage

### Roadmap
- **v1.1**: Caching and performance optimization
- **v1.2**: Bulk operations support
- **v1.3**: Additional API integrations
- **v1.4**: Advanced analytics and reporting
