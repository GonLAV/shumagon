# ✨ Welcome to Your Spark Template!
You've just launched your brand-new Spark Template Codespace — everything’s fired up and ready for you to explore, build, and create with Spark!

This template is your blank canvas. It comes with a minimal setup to help you get started quickly with Spark development.

🚀 What's Inside?
- A clean, minimal Spark environment
- Pre-configured for local development
- Ready to scale with your ideas
  
🧠 What Can You Do?

Right now, this is just a starting point — the perfect place to begin building and testing your Spark applications.

🧹 Just Exploring?
No problem! If you were just checking things out and don’t need to keep this code:

- Simply delete your Spark.
- Everything will be cleaned up — no traces left behind.

📄 License For Spark Template Resources 

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.

## Quick Start

- Install deps:

```bash
npm install
```

- Run the app:

```bash
npm run dev
```

## New Tools (Appraisal Platform)

- GISN Docs Scanner: Find plan PDFs directly from GISN. Open the sidebar item “סריקת מסמכי GISN” and enter a plan id (e.g., 6400).
- Ingestion Helper: See current `public/gisn/` index and copy the ingestion command. Open “עזר אינדוקס PDF”, place PDFs under `public/gisn/`, run `npm run ingest:gisn`, then press “רענן סטטוס”.
- TABA Extraction + PDF Report: Open “חילוץ הוראות תב"ע”. Select an ingested document, run extraction, compute derived metrics, and export a structured PDF via “הפק דוח PDF”.
- OCR (Unverified): Open “OCR לא מאומת” to OCR images or the first page of a PDF. Outputs JSON labeled as `ocr-unverified`.
- Data.gov Resource Check: Validate CKAN resource id availability via “בדיקת משאב Data.gov.il”. If retired, update the id in `src/lib/dataGovAPI.ts`.

Notes:
- AI calls use Spark (`window.spark.llm`) with strict JSON for extraction. No external facts or hallucinations are allowed.
- Styling follows existing theme tokens. Use `@/` imports and shared UI primitives under `src/components/ui/*`.
