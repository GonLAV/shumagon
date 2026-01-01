# Planning Guide

A comprehensive real estate appraisal platform for professional appraisers with advanced 3D visualization, AI-powered analysis, floor plan design, investment forecasting, environmental quality assessment, advanced market comparison tools, and professional report generation - surpassing Simplex3D and Quicker.co.il with cutting-edge features they don't have - designed with a futuristic, minimalist interface inspired by Tesla and SpaceX product philosophy.

**Experience Qualities**:
1. **Futuristic & Sophisticated** - Dark, immersive interface with glowing accents, glass morphism effects, and smooth animations that feel like using cutting-edge technology from the future
2. **Effortlessly Powerful** - Complex functionality presented through clean, minimalist design with every interaction feeling instant and intelligent
3. **Precision & Trust** - Data-rich displays with monospace typography for numbers, gradient highlights for important values, and visual feedback that instills confidence

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This is a professional tool requiring multiple sophisticated features: property database management, advanced AI-powered comparable property search and analysis with filtering/sorting/similarity scoring, automated valuation models, professional report generation with customizable sections, document management, client tracking, data visualization, 3D building visualization, sun/shade analysis, view quality analysis, floor plan designer with AI generation, investment forecasting with ROI analysis, environmental quality assessment, AR walkthrough mode with measurements/annotations/environmental sensors, collaborative AR sessions with real-time sync and group chat - all presented through an exceptionally polished, futuristic interface that makes complex tasks feel simple.

## Essential Features

### Property Evaluation Dashboard
- **Functionality**: Central workspace displaying active appraisals, recent properties, and quick stats
- **Purpose**: Provides appraisers with immediate overview of workload and quick access to ongoing projects
- **Trigger**: Landing page after login
- **Progression**: View dashboard → Click property card → Enter detailed evaluation view
- **Success criteria**: All active appraisals visible, sortable by date/status/client, with clear visual status indicators

### Property Details Entry
- **Functionality**: Comprehensive form for entering property characteristics (address, size, rooms, condition, features, improvements)
- **Purpose**: Capture all relevant property data needed for accurate valuation
- **Trigger**: Click "New Appraisal" button or edit existing property
- **Progression**: Click new appraisal → Fill property details (address, type, size) → Add rooms/features → Upload photos → Save property
- **Success criteria**: All data persists correctly, form validates inputs, supports partial saves, auto-suggests addresses

### Comparable Properties Search
- **Functionality**: Intelligent search for similar properties based on location, size, type, features, and sale date
- **Purpose**: Find relevant comparable sales to support valuation methodology
- **Trigger**: Click "Find Comps" in property evaluation view
- **Progression**: Set search criteria (radius, property type, size range, sale date) → View results on map and list → Select comparables → Adjust comparison weights
- **Success criteria**: Returns relevant matches within seconds, displays on interactive map, allows filtering and sorting

### AI-Powered Valuation Calculator
- **Functionality**: AI-powered valuation that automatically finds comparable properties, calculates adjustments, and generates professional appraisal insights using GPT-4
- **Purpose**: Automate the complex process of property valuation while maintaining professional standards and providing transparent comparable analysis
- **Trigger**: Click "AI שומה" tab in property details or "הפעל ניתוח AI מתקדם" button
- **Progression**: Set search parameters (radius, similarity threshold) → Click "הפעל ניתוח AI מתקדם" → AI generates 5 comparable properties with realistic addresses, prices, and adjustments → Review comparables → Toggle selection → Click "חשב מחדש" to update valuation → Click "עדכן ניתוח AI" for professional insights in Hebrew
- **Success criteria**: Generates realistic comparables within 10 seconds, calculates adjustments automatically, provides confidence score, allows manual refinement, generates professional analysis in Hebrew

### Professional Calculation System (NEW - Critical for Legal Compliance)
- **Functionality**: Comprehensive suite of professional appraisal calculators with complete transparency, legal source documentation, and automatic regression testing
- **Purpose**: Provide appraisers with mathematically precise, legally defensible calculation tools that show every step of the calculation process
- **Trigger**: Click "מחשבונים" tab in main navigation
- **Progression**: Select calculator type (Adjustments/Weighted Average/Cost Approach/Income Capitalization/Multi-Unit) → Enter parameters → View detailed calculation breakdown → Review formula and legal sources → Export results to report
- **Success criteria**: 
  - All formulas fully transparent with step-by-step breakdown
  - Every calculator documented with legal source (Appraiser Standard 19-22)
  - Automatic regression tests validate accuracy
  - Professional Hebrew narrative ready for reports
  - Audit trail logs all calculations
  - Override capability with mandatory reasoning documentation

**Available Calculators:**
1. **Adjustment Calculator** - Detailed adjustments for comparable transactions (floor, condition, amenities, time)
2. **Weighted Average Calculator** - Weighted averaging of comparables by proximity, similarity, reliability, recency
3. **Cost Approach Calculator** - Reproduction cost minus depreciation plus land value
4. **Income Capitalization Calculator** - NOI / Cap Rate with scenario analysis
5. **Multi-Unit Calculator** - Building value allocation to individual units with automatic balancing

### Advanced Market Comparison Tool (NEW - Beyond Quicker & Simplex3D)
- **Functionality**: Intelligent AI-powered search for comparable properties with advanced filtering, sorting, and automatic similarity scoring across multiple criteria
- **Purpose**: Find the most relevant comparable sales to support professional valuation methodology with precision and transparency
- **Trigger**: Click "חיפוש מתקדם" tab in property detail view
- **Progression**: Set search parameters (radius 0.5-10km, timeframe 3-36 months, size range, property types) → Select max results (5-20) → Click "חיפוש AI מתקדם" → AI generates realistic comparable properties with addresses, prices, adjustments, and similarity scores → Sort by similarity/distance/price/date → Toggle selection of comparables → View statistics (selected count, avg adjusted price, price range, avg similarity) → Click "שמור נבחרים" to save selected comparables
- **Success criteria**: 
  - Generates 5-20 realistic comparables within 10 seconds using GPT-4
  - Each comparable has similarity score (0-100%), realistic address, accurate pricing
  - Automatic adjustments calculated for location, size, condition, floor, age, features
  - Sortable by 4 different criteria
  - Visual similarity indicators and color-coded adjustments (green/red)
  - Real-time statistics dashboard showing selection metrics
  - Grid view with detailed adjustment breakdown
  - Saves selections back to property for report generation

### Professional Report Generator (NEW - Beyond Quicker & Simplex3D)
- **Functionality**: Comprehensive report generation system with AI-powered content creation, customizable sections, multiple format export (PDF/Word/HTML), and professional templates
- **Purpose**: Create polished, client-ready appraisal reports with minimal manual effort while maintaining professional standards
- **Trigger**: Click "ייצוא דוח" tab in property detail view
- **Progression**: Select report format (PDF/Word/HTML) → Choose template (standard/detailed/summary/bank) → Enter appraiser name and license → Toggle report sections (14 customizable sections) → Click "צור תוכן AI" to generate professional Hebrew content (executive summary, location analysis, market analysis, conclusions) → Add custom notes and recommendations → Optional watermark for drafts → Click "ייצא דוח" → AI generates complete HTML report → Downloads as file → Can print directly
- **Success criteria**:
  - 14 customizable report sections with required/optional flags
  - AI generates professional Hebrew content in 5-10 seconds
  - Report includes: cover page, executive summary, property details, valuation results, market analysis, comparable properties table, location analysis, photos, legal disclaimer, appendices
  - HTML format exports immediately with professional styling
  - Print-optimized layout with page breaks
  - Includes all property data, client info, valuation results, comparables table
  - Professional formatting with grid layouts, tables, headers
  - Draft watermark option
  - Downloadable with auto-generated filename

### Valuation Engine Test Results PDF Export (NEW - Professional Documentation)
- **Functionality**: Professional PDF export system for valuation engine test results with comprehensive documentation of all three calculation methods (Comparable Sales, Cost Approach, Income Approach) with custom branding support
- **Purpose**: Generate professional, client-ready valuation reports directly from test results for documentation, presentation, or legal purposes
- **Trigger**: Click "ייצא ל-PDF" button next to individual test results or "ייצא דוח מקיף" for comprehensive multi-method report in Valuation Engine Tester
- **Progression**: 
  - Single method: Run valuation method → View results → Click "ייצא ל-PDF" → PDF auto-downloads with complete analysis and custom branding
  - Multi-method: Run all three methods → Click "ייצא דוח מקיף" → Comprehensive PDF auto-downloads with comparison analysis and custom branding
- **Success criteria**:
  - Professional multi-page PDF with custom branded header and formatting
  - Applies user-configured branding settings (logo, colors, company info) from branding settings
  - Includes complete property information and valuation summary
  - Detailed methodology explanation for each approach
  - Step-by-step calculation breakdown with formulas and inputs
  - Visual hierarchy with custom or default color-coded sections
  - Comprehensive reports include executive summary, comparison table, and statistical analysis
  - Auto-generated report numbers and dates
  - Professional assumptions and limitations sections
  - Custom footer with company info and page numbers
  - Client-side generation (no server required) using jsPDF library
  - Instant download with descriptive filename

### Custom PDF Branding System (NEW - Professional Brand Identity)
- **Functionality**: Comprehensive branding customization system allowing users to configure company logo, colors, fonts with live preview, headers, footers, and contact information that automatically apply to all PDF exports
- **Purpose**: Enable appraisers to create professional, branded PDF reports that reflect their company identity and maintain consistent visual presentation across all documents
- **Trigger**: Click "מיתוג PDF" tab in main navigation
- **Progression**: 
  - Configure company details (name, tagline, phone, email, website, license number) → Upload company logo (PNG/JPG up to 2MB) with position and size options → Select brand colors (primary, header background/text, footer background/text) using color pickers → Choose fonts from comprehensive dropdown with live preview showing font name, sample text, and visual hierarchy → Configure header settings (enable/disable, show logo, show company name, show tagline, border options) → Configure footer settings (enable/disable, show page numbers, show company name, show contact info, border options) → Click "שמור" to save settings → All future PDF exports automatically use these branding settings
- **Success criteria**:
  - Company information fields save to persistent storage
  - Logo upload with preview, file size validation, and positioning options
  - Color pickers with hex input and visual preview
  - 25+ professional Google Fonts with live preview showing hierarchy
  - Real-time preview of branding changes
  - Header/footer customization with toggle controls
  - Settings persist across sessions using useKV
  - All PDF exports (valuation tests, reports, portfolio analysis) automatically apply saved branding
  - One-click application of predefined theme presets (Corporate Blue, Legal Gray, Modern Purple, Luxury Gold)
  - Export/import branding configurations for backup or sharing across team

### Bulk Property Valuation for Portfolio Analysis (NEW - Multi-Asset Management)
- **Functionality**: Automated bulk valuation system that processes multiple properties simultaneously using AI-powered comparable sales analysis, cost approach, or income approach, with comprehensive portfolio statistics and professional PDF export
- **Purpose**: Enable property managers, investors, and appraisers to value entire portfolios efficiently, analyze portfolio performance, and generate comprehensive multi-property reports for clients or internal analysis
- **Trigger**: Click "שומה מרובה" tab in main navigation
- **Progression**: 
  - View all eligible properties (must have address, built area) → Select individual properties or "Select All" → Configure valuation settings (method: auto/comparable-sales/cost-approach/income-approach, search radius 0.5-10km, similarity threshold 50-100%) → Click "התחל שומה" → AI processes each property sequentially with real-time progress bar → View completed valuations with status indicators (completed/processing/error) → Review portfolio statistics (total value, average value, confidence scores, price per sqm, value ranges, property type distribution) → Switch between summary table view and detailed results → Export comprehensive portfolio PDF report with all properties and analytics
- **Success criteria**:
  - Bulk selection with checkbox interface and select-all functionality
  - Properties filter automatically to show only eligible ones (complete data)
  - Three valuation methods supported with configurable parameters
  - Sequential processing with visual progress indication (0-100%)
  - Real-time status updates for each property (pending→processing→completed/error)
  - AI generates realistic comparable properties for each asset using GPT-4
  - Processing time tracked per property
  - Portfolio statistics automatically calculated:
    * Total portfolio value
    * Average property value
    * Average confidence score
    * Average price per square meter
    * Value range (min/max)
    * Property type distribution breakdown
  - Results display with color-coded status badges
  - Summary table view with sortable columns (address, type, area, valuation, price/sqm, confidence, status)
  - Detailed view with expandable cards showing full valuation breakdown and comparables
  - Automatic property data updates with valuation results saved to persistent storage
  - Professional PDF export with:
    * Executive summary with portfolio statistics
    * Property type distribution chart
    * Detailed property cards with valuations
    * Formatted currency and metrics
    * Legal disclaimer
    * Multi-page pagination
  - Error handling with specific error messages per property
  - Toast notifications for process completion
  - Responsive design with glass-effect cards and smooth animations
- **Success criteria**:
  - Complete company information management (name, tagline, contact details)
  - Logo upload with image validation (file type, size limit 2MB)
  - Logo preview with options for position (left/center/right) and size (small/medium/large)
  - Color customization with visual color pickers and hex input
  - Font selection dropdown with 12+ professional fonts including web-safe and Google Fonts
  - Live font preview showing font name rendered in the actual font
  - Sample text preview ("The quick brown fox jumps...") in selected font
  - Visual preview card showing heading vs body text hierarchy
  - Real-time size adjustment for heading (12-24pt) and body (8-16pt) fonts
  - Separate font selection for headings and body text
  - Separate header and footer enable/disable toggles
  - Header customization: toggle logo, company name, tagline, and bottom border
  - Footer customization: toggle page numbers, company name, contact info, and top border
  - Real-time unsaved changes indicator with badge notification
  - Settings persist using useKV and automatically load on return visits
  - Reset to defaults functionality
  - Settings automatically apply to all PDF exports (valuation reports, comprehensive reports)
  - Professional glass-morphism UI matching app aesthetic
  - Grid layout with organized sections for easy configuration
  - Informational card explaining that settings apply to future PDF exports only

### Automatic Property Valuation with Live Government Data (NEW - Industry-Leading Innovation)
- **Functionality**: Fully automated property valuation engine that connects directly to Israeli government APIs and databases to fetch real-time land registry, planning, tax, municipal, GIS, and market transaction data, then applies sophisticated algorithms to calculate accurate property valuations with transparent breakdown and confidence scoring
- **Purpose**: Revolutionize property valuation by eliminating manual data entry and research, providing appraisers with instant, data-driven valuations based on authoritative government sources, significantly reducing appraisal time from hours to minutes while increasing accuracy and defensibility
- **Trigger**: Click "שמאות אוטומטית" tab in property detail view
- **Progression**: 
  - Open property → Navigate to "שמאות אוטומטית" tab → Click "הפעל שמאות אוטומטית" → System automatically connects to 6 government data sources in parallel → Shows real-time progress (10% Tabu, 25% Planning, 40% Tax, 55% Market, 70% GIS, 85% AI Analysis) → AI engine analyzes all data and calculates valuation → Displays comprehensive results with 4 sub-tabs (Summary, Breakdown, Factors, Data) → Option to save valuation to property record
- **Success criteria**:
  - **Automated Data Retrieval**: Connects to 6 Israeli government and market data sources:
    * Land Registry (Tabu) - ownership, encumbrances, legal status
    * Planning Administration (iplan) - building rights, zoning, permits, violations
    * Tax Authority - assessed values, arnona, improvement tax
    * Municipal databases - infrastructure, services, development plans
    * GIS systems (GovMap) - coordinates, elevation, environmental data, viewshed
    * Market transaction data - recent comparable sales from land registry
  - **Real-time Progress Tracking**: Live progress bar with current step description (connecting, fetching, analyzing)
  - **Comprehensive Valuation Result**:
    * Estimated value with confidence score (0-95%)
    * Value range (min-max based on variance)
    * Data quality score showing completeness of government data
    * Price per square meter calculation
  - **Intelligent Calculation Engine**:
    * Base value from tax assessed value adjusted by market multiplier
    * Location adjustment based on GIS walkability score and accessibility
    * Condition adjustment using property condition rating
    * Planning adjustment for high FAR (Floor Area Ratio) opportunities
    * Market trend adjustment from recent transaction analysis
    * All adjustments shown with positive/negative impact
  - **Multi-Tab Results Display**:
    * Summary tab: Overall valuation, confidence/quality scores, data source checklist, warnings, recommendations
    * Breakdown tab: Itemized calculation showing base value + all adjustments = final value
    * Factors tab: Detailed cards for each factor (location, market trend, building rights, condition) with % impact, data source, and description
    * Data tab: Raw government data organized by source (Tabu, Planning, Tax, Market Transactions)
  - **Data Source Verification**: Visual checklist showing which government sources successfully provided data
  - **Intelligent Warnings System**:
    * Flags encumbrances on property
    * Identifies building violations
    * Alerts if property in flood zone
    * Highlights legal status issues
  - **Smart Recommendations**:
    * Suggests additional research if data quality < 60%
    * Identifies future planning changes that may affect value
    * Notes nearby development projects
    * Confirms high data quality when > 80%
  - **Government Data Display**:
    * Tabu section: Parcel ID (gush/helka), ownership type, encumbrance count
    * Planning section: Plan number, building percentage, permitted height
    * Tax section: Tax assessed value, annual arnona
    * Market section: List of recent transactions with prices and dates
  - **Save to Property**: Updates property record with valuation data, confidence score, and notes about data sources
  - **Performance**: Complete valuation in 5-10 seconds including all API calls
  - **Error Handling**: Graceful degradation if some data sources unavailable, shows which sources succeeded
  - **Professional UI**: Glass-morphism cards, gradient headings, color-coded adjustments (green/red), success badges

### Market Trends Analytics
- **Functionality**: Visual analytics showing price trends, days on market, price per sqm by neighborhood
- **Purpose**: Provide market context and support valuation decisions
- **Trigger**: Click "Market Insights" or view in property details sidebar
- **Progression**: Select area of interest → View trend charts → Filter by property type/time period → Export data
- **Success criteria**: Interactive charts update in real-time, data covers last 2-5 years, shows statistical trends

### Client Management
- **Functionality**: Track clients, their properties, appraisal history, and contact information
- **Purpose**: Maintain organized records of all clients and their appraisal requests
- **Trigger**: Click "Clients" tab or add client during new appraisal
- **Progression**: View client list → Select client → See appraisal history → Add notes → Schedule follow-up
- **Success criteria**: Searchable client database, shows complete history, tracks communication

### AI-Powered Property Description
- **Functionality**: Generates professional property descriptions in Hebrew from entered data and photos using GPT-4
- **Purpose**: Save time writing descriptions and ensure consistent, professional language
- **Trigger**: Click "ייצר תיאור AI" in property form
- **Progression**: Enter property details → Click "ייצר תיאור AI" → AI analyzes property data → Generates 2-3 sentence professional description in Hebrew → Appraiser can edit → Save
- **Success criteria**: Descriptions are accurate, professional tone in Hebrew, highlights key features, editable, saves appraiser 5+ minutes per property

### Neighborhood Analysis
- **Functionality**: Comprehensive area reports including schools, amenities, crime data, demographics
- **Purpose**: Provide context about the property's location and neighborhood characteristics
- **Trigger**: Automatic when address is entered, or click "Neighborhood Info"
- **Progression**: Enter address → System fetches neighborhood data → Display schools, amenities, transit → Show on map
- **Success criteria**: Accurate location data, displays relevant points of interest within 1km, shows walking distances

### Photo Management & Annotation
- **Functionality**: Upload, organize, and annotate property photos with notes and measurements
- **Purpose**: Visual documentation of property condition and features
- **Trigger**: Click "Add Photos" in property details
- **Progression**: Upload photos → Auto-organize by room type → Add annotations/arrows → Tag features → Include in report
- **Success criteria**: Supports batch upload, image compression, annotation tools, automatic EXIF data extraction

### Value Adjustment Grid
- **Functionality**: Detailed grid comparing subject property to comparables with line-item adjustments
- **Purpose**: Transparent documentation of how comparable properties are adjusted to match subject
- **Trigger**: In valuation calculator after selecting comparables
- **Progression**: View comparison grid → Add adjustment categories → Enter adjustment values → Calculate adjusted prices → See final reconciliation
- **Success criteria**: Industry-standard format, calculates automatically, shows adjustment percentages, exports to report

### Historical Property Data
- **Functionality**: Shows previous sales, tax assessments, ownership history, and prior appraisals
- **Purpose**: Understand property's value trajectory and identify anomalies
- **Trigger**: Automatic when property address is entered
- **Progression**: Enter address → Fetch historical data → Display timeline → Show price changes → Flag unusual patterns
- **Success criteria**: Data from public records, shows 10+ year history, visualizes price trends

### 3D Building Visualization (Simplex3D Feature - Enhanced)
- **Functionality**: Interactive 3D model of the property and surrounding buildings using Three.js, with real-time rendering and rotation
- **Purpose**: Visualize the property in context, understand spatial relationships, and assess building characteristics
- **Trigger**: Click "תצוגה 3D" tab in property details
- **Progression**: View 3D model → Rotate/zoom camera → See building dimensions → View context buildings → Toggle layers
- **Success criteria**: Smooth 60fps rendering, realistic building representation, interactive camera controls, displays accurate dimensions

### Sun & Shade Analysis (Simplex3D Feature - Enhanced)
- **Functionality**: Dynamic sun position simulation showing shadow patterns throughout the day and seasons with real-time visualization
- **Purpose**: Assess sunlight exposure which affects property value, energy costs, and quality of life
- **Trigger**: Click "שמש וצל" tab within 3D view
- **Progression**: Set time of day (0-24h slider) → Select season → View sun position → See shadow patterns → Calculate sun exposure percentage
- **Success criteria**: Realistic sun movement, accurate shadow rendering, seasonal variations (winter/spring/summer/fall), displays exposure score

### View Quality Analysis (Simplex3D Feature - Enhanced)
- **Functionality**: Analyzes visible areas, hidden zones, and view quality from different angles with 360° assessment
- **Purpose**: Quantify view value which significantly impacts property pricing
- **Trigger**: Click "ניתוח נוף" tab within 3D view
- **Progression**: Set viewing angle (0-360°) → Calculate visible area → Identify obstructions → Rate view quality → Show visibility metrics
- **Success criteria**: Quality score (1-100), identifies open views, partial obstructions, privacy level, nearby landmarks

### Design Comparison Tool (Simplex3D Feature - Enhanced)
- **Functionality**: Side-by-side comparison of current vs. proposed building designs with impact analysis
- **Purpose**: Evaluate renovation potential and value increase from design changes
- **Trigger**: Click "השוואה" tab within 3D view
- **Progression**: View current design → Load alternative design → Compare metrics (sun exposure, view quality, built area, value) → Show differences
- **Success criteria**: Clear visual comparison, quantified improvements, estimated value impact

### Floor Plan Designer (NEW - Beyond Simplex3D)
- **Functionality**: Interactive canvas-based floor plan creator with drag-and-drop rooms, auto-measurements, and AI generation
- **Purpose**: Create, edit, and visualize apartment layouts with professional precision
- **Trigger**: Click "תוכנית קומה" tab in property details
- **Progression**: Click "הוסף חדר" → Draw/place room → Set room type (living, bedroom, kitchen, etc.) → Adjust dimensions → AI auto-generate layout option → Export as image
- **Success criteria**: Intuitive drawing tools, snap-to-grid (20px), displays room areas, color-coded by type, AI generates realistic layouts, exportable

### Investment Analysis & Forecasting (NEW - Beyond Simplex3D)
- **Functionality**: AI-powered investment analysis with projected value, ROI, risk assessment, and rental yield over 1-10 year timeframes
- **Purpose**: Help investors make data-driven decisions with professional-grade analysis
- **Trigger**: Click "ניתוח השקעה" tab in property details
- **Progression**: Select timeframe (1y/3y/5y/10y) → Click "הפעל ניתוח AI" → View projected value → See expected return % → Review risk/liquidity scores → Read AI recommendation
- **Success criteria**: Realistic market projections, investment grade (A+ to C), identifies strengths and risks, rental yield calculation, actionable Hebrew recommendations

### Environmental & Quality of Life Analysis (NEW - Beyond Competitors)
- **Functionality**: Comprehensive environmental assessment including air quality, noise levels, green spaces, walkability, and amenity proximity
- **Purpose**: Provide holistic location analysis beyond traditional property metrics
- **Trigger**: Click "ניתוח סביבתי" tab in property details
- **Progression**: Click "הפעל ניתוח סביבתי" → AI analyzes location → View air quality score & PM2.5 → Check noise levels (dB) → See nearby amenities with walk times → Review walkability/bike/transit scores
- **Success criteria**: Overall score (1-100), detailed metrics (air, noise, green space), amenity list with distances, mobility scores, highlights key strengths and concerns

### AR Walkthrough Mode for Virtual Property Tours (NEW - Revolutionary)
- **Functionality**: Smartphone camera-integrated AR walkthrough system allowing real-time property exploration with measurements, annotations, environmental sensors, and AI-powered insights
- **Purpose**: Enable remote property inspections, create immersive documentation, and provide advanced on-site analysis tools for appraisers
- **Trigger**: Click "סיור AR" button in property detail header
- **Progression**: Grant camera access → Select AR mode (walkthrough/measure/annotate/analyze) → Point camera at property → Take measurements by tapping two points → Add annotations with text → Capture photos → Record environmental data (light, temperature, humidity, noise) → AI generates real-time suggestions → Save session with all data → View saved AR sessions in "סיורי AR" tab
- **Success criteria**: 
  - Smooth 30fps camera feed with low latency (<100ms)
  - Accurate distance measurements (±5% margin)
  - Environmental sensors display real-time data
  - AI generates 5 contextual suggestions within 3 seconds
  - All measurements, annotations, and photos persist to session
  - Sessions viewable with full data history
  - Support front/back camera switching
  - Brightness and zoom controls (50-150%, 1-3x)
  - Grid overlay for alignment
  - Professional glass-morphism AR UI with minimal obstruction

### Collaborative AR Sessions for Remote Property Inspections (NEW - Game-Changing)
- **Functionality**: Multi-user AR sessions enabling real-time collaboration between appraisers, clients, and inspectors with shared annotations, measurements, live chat, cursor tracking, and session playback
- **Purpose**: Enable remote property inspections with stakeholders in different locations, facilitate expert consultations, and create comprehensive collaborative documentation
- **Trigger**: Click "שיתוף פעולה" mode button in AR interface or "הצטרף לסשן" in AR sessions viewer
- **Progression**: 
  - Host flow: Start AR session → Click collaborate mode → System generates unique 6-character share code → Share code with participants → See participants join in real-time → Collaborators' cursors appear in different colors → All measurements/annotations broadcast to all participants → Use group chat for communication → Save collaborative session with full participant history
  - Join flow: Click "הצטרף לסשן" → Enter 6-character share code → Join active session → See host and other participants → Add own measurements and annotations → Participate in group chat → View complete session data
- **Success criteria**:
  - Session codes generated instantly (< 100ms)
  - Participants join within 2 seconds of code entry
  - Real-time sync of all actions (measurements, annotations, photos) across participants
  - Each participant has unique color identifier
  - Live cursor tracking shows participant positions

### Automatic Transaction Import from Government API (NEW - Industry-Leading)
- **Functionality**: Automated import of real estate transactions from Israeli government APIs with advanced filtering, scheduling, duplicate detection, and workflow management
- **Purpose**: Eliminate manual data entry and ensure appraisers have access to the most recent, verified market transactions for comparable analysis
- **Trigger**: Click "ייבוא עסקאות" tab in main navigation
- **Progression**: Create import config → Set location (lat/lng + radius) → Configure filters (price range, area, rooms, condition, age, verified only) → Set schedule (manual/daily/weekly/monthly) → Enable auto-approve or manual review → Save config → Run import (manual or automatic) → System fetches transactions from government API → Applies all filters → Detects duplicates (same address, date, price, area) → Categorizes as pending/approved → View in transactions list → Review pending transactions → Approve/reject individually → Export to CSV for analysis → Track import history with full statistics
- **Success criteria**:
  - Connects to land registry, tax authority, and broker platforms
  - Imports 10-100 transactions per run in under 10 seconds
  - Duplicate detection accuracy >95% (same address + date + price ±₪1,000 + area ±2m²)
  - Auto-scheduling runs at configured intervals (2:00 AM for daily)
  - Filter compliance 100% (only transactions matching criteria)
  - Statistics dashboard shows: total transactions, pending count, avg price, avg price/m², approval rate, verified percentage
  - Export to CSV with all transaction details (date, address, price, price/m², area, rooms, floor, condition, age, verified status, import date, approval status)
  - Import history tracking with: fetch count, new transactions, duplicates, filtered out, errors, duration
  - Manual approve/reject with review tracking (user, timestamp, notes)
  - Configurable notifications on successful imports
  - Group chat with message history
  - Participant list shows active/inactive status
  - Session saves include all participants' contributions with attribution
  - Session viewer displays collaborative timeline
  - Export sessions with full participant data
  - Support 2-10 simultaneous participants
  - Annotation replies and threaded discussions
  - Share code copying with one click

### Client Portal for Viewing Reports and Requesting Updates (NEW - Client-Centric)
- **Functionality**: Dedicated client-facing portal where clients can log in, view their properties, access published appraisal reports, download documents, submit update requests, track request status, and communicate with their appraiser
- **Purpose**: Empower clients with self-service access to their appraisal data, streamline communication, reduce back-and-forth emails, and provide transparency in the appraisal process
- **Trigger**: 
  - Client flow: Visit portal URL → Enter email → View personalized dashboard
  - Appraiser flow: Click "פורטל לקוחות" tab in admin interface
- **Progression**:
  - Client login → Enter email address → Access personalized portal → View dashboard with stats (reports, properties, open requests) → Navigate tabs:
    - Reports tab: Browse all reports → Search/filter/sort → View report details → Download reports
    - Update Requests tab: View all requests → See status/priority badges → Read appraiser responses
    - Properties tab: View property cards with details and valuations
    - Activity tab: See login/download/request history timeline
  - Submit new request: Click "בקשת עדכון" → Select property → Select report (optional) → Enter title and description → Set priority → Submit → Receive confirmation
  - Appraiser management: View pending requests → Update request status (pending/in-review/in-progress) → Respond to requests (manual or AI-generated) → Mark as completed/rejected → Manage published reports → Track client activity
- **Success criteria**:
  - Email-based login with client database lookup
  - Real-time activity tracking and logging
  - Search and sort functionality for reports
  - Priority and status badges for update requests
  - AI-powered response generation for appraisers (GPT-4o-mini)
  - Request workflow: pending → in-review → in-progress → completed/rejected
  - Professional report viewing with sections
  - Download functionality for all report formats
  - Notification system (bell icon with unread indicator)
  - Secure client data isolation (clients only see their own data)
  - Copy portal link functionality for easy sharing
  - Stats dashboard for both clients and appraisers
  - Glass-morphism UI matching main app aesthetic
  - Mobile-responsive layout
  - Activity history with relative timestamps

### Automated Follow-Up Email Sequences (NEW - Marketing Automation)
- **Functionality**: Create and manage automated multi-step email campaigns that trigger based on events (report sent, payment overdue, no response) with scheduled delays and conditional logic
- **Purpose**: Automate client communication, payment reminders, lead nurturing, and follow-ups to improve response rates, collect feedback, and maintain professional relationships without manual work
- **Trigger**: Click "רצפי מעקב" tab in main navigation or set up sequences for specific events
- **Progression**:
  - View all email sequences → Create new sequence or select template → Configure sequence details (name, description, trigger type) → Add email steps with delays (days/hours) → Write subject and message for each step with template variables → Configure step options (attach report, attach invoice, wait for response) → Enable/disable individual steps → Save sequence → Activate sequence → View active executions → Monitor progress → Pause/resume/stop executions
- **Success criteria**:
  - Pre-configured default sequences:
    * Client Follow-Up: 3-step sequence after report sent (1 day: check receipt, 3 days: reminder, 7 days: satisfaction survey)
    * Payment Reminder: 3-step escalating reminders for overdue invoices (1 day: friendly, 3 days: firm, 5 days: urgent)
    * Lead Nurturing: 3-step conversion campaign for prospects (immediate: intro, 3 days: process guide, 7 days: case study)
  - Trigger types supported:
    * Manual (start on-demand)
    * Report sent (auto-trigger when report emailed)
    * Invoice sent
    * No response after X days
    * Payment overdue
    * Appointment scheduled
  - Sequence builder with visual step editor
  - Each step configurable:
    * Delay in days and hours
    * Subject line with variables
    * Message body with variables ({name}, {address}, {value}, {invoice}, {dueDate}, {appraiser}, {company})
    * Attach report toggle
    * Attach invoice toggle
    * Wait for response before next step
    * Enable/disable individual steps
  - Sequence status management (active/paused/archived)
  - Execution tracking:
    * Active executions list with recipient info
    * Current step indicator
    * Progress bar showing completion
    * Step status (pending/scheduled/sent/failed)
    * Time tracking (started, scheduled for, sent at)
    * Pause/resume/stop controls
  - Dashboard statistics:
    * Number of active sequences
    * Active executions count
    * Completed sequences
    * Total usage count
  - Template variables auto-replace with actual data
  - Duplicate sequence functionality
  - Tags for organizing sequences
  - Use count tracking per sequence
  - Last used timestamp
  - Professional UI with glass-effect cards
  - Real-time status updates
  - Color-coded badges for status
  - Responsive timeline visualization
  - Toast notifications for all actions

### Professional Valuation Engine (NEW - Core Appraisal System)
- **Functionality**: Advanced calculation engine implementing three professional appraisal methodologies with automatic adjustments, formula documentation, and confidence scoring
- **Purpose**: Provide legally-sound, mathematically-accurate valuations following Israeli appraisal standards with full transparency and professional documentation
- **Trigger**: Click "שומה מקצועית" or valuation calculator in property details
- **Progression**: 
  - Select methodology (comparable sales/cost approach/income approach) → Enter required parameters → System calculates with step-by-step documentation → Review calculations and adjustments → View confidence score → See assumptions and limitations → Save valuation to property
  - Comparable Sales: Uses selected comparables → Applies adjustments for location, size, condition, floor, age, features → Weighted reconciliation by similarity score → Standard deviation analysis
  - Cost Approach: Land value + construction cost - depreciation → Effective age calculation based on condition → Economic life analysis
  - Income Approach: Monthly rent → Vacancy adjustment → Operating expenses → NOI calculation → Capitalization rate application
- **Success criteria**:
  - Industry-standard adjustment factors (location ±15%, condition ±10%, floor ±4%, features +7%)
  - Depreciation calculated using effective age (condition-adjusted)
  - Confidence scoring (40-90%) based on data quality
  - Complete calculation documentation with formulas and inputs
  - Professional methodology narrative in Hebrew
  - Assumptions and limitations clearly stated
  - Value range (min/max) with standard deviation
  - Reconciliation explaining final value selection
  - All calculations saved with property record

### Business Management & Invoicing System (NEW - Revenue Management)
- **Functionality**: Complete invoicing and pricing system with automated invoice generation, payment tracking, revenue analytics, and customizable pricing templates
- **Purpose**: Enable appraisers to run their business professionally with proper billing, track revenue, manage cash flow, and understand business performance
- **Trigger**: Click "ניהול עסקי" tab in main navigation
- **Progression**:
  - Dashboard view: See monthly revenue, total revenue, outstanding balance, overdue invoices → Navigate to Invoices/Pricing/Analytics tabs
  - Create invoice: Select property and client → System auto-calculates price based on property type and size → Add line items → Set payment terms → Generate invoice → Export to HTML/PDF
  - Manage invoices: View all invoices with status badges → Click for details → Record payments → Update status automatically (draft→sent→paid/overdue) → Export invoice documents
  - Pricing templates: View 9+ service types (residential, commercial, land, rental, complex, consultation, etc.) → Base price + per-sqm pricing → Minimum/maximum limits → Complexity adjustments
  - Analytics: View total/monthly revenue → Service breakdown → Payment status distribution → Invoice statistics
- **Success criteria**:
  - Auto-pricing based on property characteristics (+₪1000 for >200 sqm, +₪500 for penthouses, etc.)
  - Invoice numbering system (INV-YYYY-####)
  - Tax calculation (17% VAT)
  - Payment tracking with balance calculation
  - Status workflow (draft→sent→paid/overdue→cancelled)
  - HTML export with professional formatting
  - Revenue dashboards and statistics
  - Service type breakdown analytics
  - Outstanding balance tracking
  - Overdue invoice alerts
  - Payment terms configuration (default 30 days)
  - Line item management with quantities and unit prices

### Digital Security & Audit Trail (NEW - Legal Protection)
- **Functionality**: Comprehensive security system with document hashing, digital signatures, tamper detection, audit logging, and version control
- **Purpose**: Provide legal protection, ensure document integrity, maintain compliance, and create defensible documentation trail for all appraisals
- **Trigger**: Automatic for all document operations; accessible via security dashboard
- **Progression**:
  - Document signing: Generate SHA-256 hash → Create signature payload → Sign with appraiser credentials → Store signature with timestamp and IP → Verify on access
  - Audit logging: Every action tracked (created/updated/deleted/viewed/exported/signed) → User attribution → Timestamp → Change tracking (before/after) → Metadata storage
  - Security monitoring: View total actions → Actions by type → Active users → Recent activity (last 24h) → Suspicious activity detection
  - Tamper detection: Hash verification on document access → Alert if content modified → Signature invalidation
- **Success criteria**:
  - SHA-256 cryptographic hashing
  - Digital signatures with timestamp and IP address
  - Complete audit trail for all entities (property/report/invoice/client)
  - Change tracking with before/after states
  - Suspicious activity detection (rapid actions, mass deletions)
  - Document lock status (draft editable, completed locked)
  - Watermark generation for drafts
  - Input sanitization to prevent XSS
  - License validation
  - Data masking for sensitive information
  - Security reports and analytics

### Property Digital Twin (Simplex3D Core Feature)
- **Functionality**: Complete digital replica of each property with permanent ID, full history, 3D model, documents, valuations, inspections, and lifecycle events stored in one unified profile
- **Purpose**: Create a single source of truth for each property that accumulates knowledge over time, making future appraisals 50-70% faster
- **Trigger**: Automatically created on first property entry; accessible via "תאום דיגיטלי" tab
- **Progression**: Property created → System generates unique Digital Twin ID → All data accumulated (valuations, inspections, photos, documents, AR sessions, floor plans, market data) → Timeline view shows complete history → Reuse data for subsequent appraisals → Export complete digital profile
- **Success criteria**:
  - Unique permanent ID (DT-XXXXXX format)
  - Complete timeline of all property events with timestamps
  - Version control for all documents and valuations
  - 3D model integration with update history
  - Photo gallery with date stamps and comparison tools
  - All AR sessions and measurements stored
  - Market data snapshots over time
  - Automatic data reuse reduces appraisal time 50%+
  - Export complete digital twin as archive
  - Ownership transfer tracking
  - Renovation/modification history
  - Legal status changes logged

### Live Data Connections & Integration Hub with Real Israeli Government APIs (IMPLEMENTED - Simplex3D Core Feature)
- **Functionality**: Real-time data feeds from authentic Israeli government registries, planning databases, market platforms, GIS systems, and financial institutions with automatic updates, comprehensive data display, and conflict detection
- **Purpose**: Ensure appraisals use most current, accurate data directly from Israeli government sources while eliminating manual data entry and reducing errors
- **Trigger**: Click "מקורות נתונים" tab; enter address or gush/helka → click "משוך נתונים מכל המקורות"
- **Progression**: 
  - View data sources dashboard → See connection health (8 active sources) → Enter property address or gush/helka → Click search → System queries all connected Israeli government APIs in parallel → Displays comprehensive data in organized tabs:
    - Land Registry (טאבו): ownership, encumbrances, legal status, parcel details
    - Planning Administration (מינהל התכנון): zoning, building rights, FAR, coverage, height limits, future plans
    - Tax Authority (רשות המיסים): assessed value, arnona, purchase tax, historical values
    - Municipal Data: schools, parks, infrastructure, development plans
    - GIS Data: coordinates, elevation, viewshed, accessibility scores
    - Market Transactions: recent sales in radius with prices, features, dates
  - Validates data consistency → Flags conflicts automatically → Shows resolution recommendations → All data timestamped and sourced
- **Success criteria**: ✅ COMPLETED
  - ✅ 8 integrated data sources: Land Registry (data.gov.il/tabu), Planning (iplan.gov.il), Tax Authority, Municipal, Madlan, Yad2, OnMap, GovMap GIS
  - ✅ Real API client with TypeScript interfaces for all Israeli government data types
  - ✅ Parallel data fetching from multiple sources (Promise.all)
  - ✅ Comprehensive Land Registry display: gush/helka, owners with ID numbers, share percentages, acquisition dates, encumbrances (mortgages/liens) with amounts and creditors, legal status
  - ✅ Planning data: plan numbers (תב״ע), zoning designation, building rights (FAR, coverage, height), setbacks, permitted uses, future planning changes with impact assessment
  - ✅ Tax data: assessed value (שווי מאזן), arnona annual/per sqm, purchase tax brackets, historical value trends over years
  - ✅ Municipal services: schools with distances and ratings, parks, public transport lines, development projects with budgets
  - ✅ Market transactions: recent sales with addresses, prices, price per sqm, features, verification status
  - ✅ Connection health monitoring with status badges (connected/syncing/error/disconnected)
  - ✅ System health score calculation and progress display
  - ✅ Real-time sync with loading states and animations
  - ✅ Conflict detection and display with severity levels and recommendations
  - ✅ Three-tab interface: Sources, Data, Conflicts
  - ✅ Manual refresh per source and bulk refresh all
  - ✅ Toggle enable/disable per data source
  - ✅ Last sync timestamps and next sync scheduling
  - ✅ API endpoint display for transparency
  - ✅ Record counts per source
  - ✅ Professional Hebrew interface throughout
  - ✅ Glass-morphism styling matching app aesthetic
  - ✅ Responsive grid layouts for all data displays
  - ✅ Search by address OR gush/helka
  - ✅ Data freshness indicators
  - ✅ Source attribution on all displayed data

### Team Collaboration & Workflow Management (Simplex3D Feature)
- **Functionality**: Multi-user workspace with role-based access, task assignment, internal commenting, approval workflows, and real-time collaboration on appraisals
- **Purpose**: Enable appraisal teams to work efficiently with clear responsibilities, prevent duplicate work, and maintain quality control
- **Trigger**: Click "צוות" tab; assign tasks from property detail; @mention team members in comments
- **Progression**: Create property → Assign to appraiser → Appraiser completes inspection → Uploads to system → Senior appraiser reviews → Leaves comments → Junior revises → Senior approves → Report generated → Manager signs off → Client notified
- **Success criteria**:
  - Role system: Admin, Senior Appraiser, Junior Appraiser, Inspector, Assistant, Viewer
  - Task assignment with due dates and priorities
  - Internal commenting system with @mentions
  - Approval workflow (draft → review → approved → published)
  - Real-time notifications for team actions
  - Activity stream showing who did what
  - Workload dashboard showing team capacity
  - Lock mechanism preventing simultaneous editing
  - "Claim" and "Release" for properties
  - Team performance analytics
  - Internal notes separate from client-facing content

### Bank & Stakeholder Portal Access (Simplex3D Feature)
- **Functionality**: Secure portal access for banks, lawyers, insurance companies, and other stakeholders with read-only permissions, custom views, and automated notifications
- **Purpose**: Streamline approval processes, reduce email exchanges, and provide stakeholders instant access to appraisal status and documents
- **Trigger**: Appraiser grants access from property detail; stakeholder receives invitation link; portal accessible at /stakeholder-portal
- **Progression**: Appraiser completes appraisal → Clicks "שתף עם בנק/עו״ד" → Enters stakeholder email and role → System generates secure access link with expiry → Stakeholder receives email → Clicks link → Views appraisal summary, documents, and status → Downloads report → Requests clarifications → Appraiser responds → Stakeholder approves/rejects
- **Success criteria**:
  - Role-based access: Bank, Lawyer, Insurance, Court, Tax Authority
  - Read-only access with no edit permissions
  - Custom dashboard showing relevant information per role
  - Document download tracking (who downloaded what, when)
  - Clarification request system with threaded discussions
  - Status notifications (completed, updated, expired)
  - Time-limited access (expiry dates)
  - Secure authentication with one-time links
  - Audit trail of stakeholder actions
  - Bulk sharing for multiple stakeholders
  - Approval/rejection workflow with reasoning

### Development Rights & Zoning Calculator (Simplex3D Feature)
- **Functionality**: Advanced calculator for building rights analysis including floor area ratio (FAR), coverage, height limits, setbacks, parking requirements, and land value extraction based on development potential
- **Purpose**: Accurately assess property value considering development potential, future planning scenarios, and land value component
- **Trigger**: Click "זכויות בנייה" tab in property detail; automatic calculation when zoning data available
- **Progression**: Enter lot size → System fetches zoning designation → Displays permitted uses → Calculate max buildable area (FAR × lot size) → Account for coverage limits → Height restrictions → Setback requirements → Parking spaces required → Calculate land value by residual method (development value - construction costs) → Show current vs. potential utilization → Generate development scenarios
- **Success criteria**:
  - Zoning data for all Israeli municipalities
  - FAR (יחס בניה) calculation with bonuses
  - Coverage ratio (אחוז כיסוי) validation
  - Height limit calculations (floors and meters)
  - Setback requirements (נסיגות) from all boundaries
  - Parking requirement calculator per use type
  - Land value extraction using residual method
  - Current vs. potential utilization percentage
  - Development scenario builder (residential/commercial/mixed)
  - Value uplift from zoning changes
  - Planning probability assessment
  - Time-to-development estimation
  - Feasibility analysis with construction costs

### Automated Workflow & Smart Checklists (Simplex3D Feature)
- **Functionality**: Intelligent workflow engine with customizable checklists, automated task generation, deadline tracking, and completion validation ensuring no steps are missed
- **Purpose**: Standardize appraisal process, ensure compliance, reduce errors, and improve efficiency through automation
- **Trigger**: Automatic on property creation; configurable templates per appraisal type; accessible via "זרימת עבודה" panel
- **Progression**: Create new appraisal → System loads checklist template based on property type → Auto-generates tasks (schedule inspection, collect documents, find comparables, perform valuation, write report, review, sign) → Assigns to team members → Tracks progress → Sends reminders before deadlines → Validates completion requirements → Blocks progression if critical steps incomplete → Final validation before report release
- **Success criteria**:
  - Pre-built templates: Residential, Commercial, Land, Complex, Court-ordered, Bank appraisal
  - Customizable checklist items per template
  - Task dependencies (can't complete step 5 until step 3 done)
  - Automatic deadline calculation from target completion date
  - Email/in-app reminders (3 days, 1 day, overdue)
  - Completion validation (e.g., can't mark "photos uploaded" if no photos)
  - Progress indicator (7/12 tasks complete - 58%)
  - Blocking rules preventing report generation if incomplete
  - Skip/defer capability with justification
  - Template builder for custom workflows
  - Analytics on process bottlenecks
  - Time tracking per task

## Edge Case Handling

- **No Comparable Properties Found**: Display message with suggestions to expand search radius or adjust criteria, allow manual comparable entry
- **Incomplete Property Data**: Allow saving as draft, highlight missing required fields, suggest typical values based on property type
- **Duplicate Property Detection**: Warn when entering address that matches existing property, offer to load existing data
- **Offline Access**: Cache recent appraisals and allow work to continue offline, sync when connection restored
- **Large Photo Files**: Automatically compress images while maintaining quality, show progress indicators
- **Conflicting Valuation Methods**: Display all methods side-by-side, explain variances, allow appraiser to select final value with notes
- **Missing Market Data**: Gracefully show "data unavailable" with explanation, suggest alternative analysis methods
- **Report Generation Failure**: Maintain draft progress, allow section-by-section export, provide error details
- **Camera Permission Denied**: Show friendly message explaining why camera is needed, provide link to browser settings, allow continuing without AR
- **Low Light Conditions in AR**: Brightness slider auto-adjusts, displays warning if light sensor shows <20%, suggests using flash or postponing
- **AR Session Interrupted**: Auto-save session data every 30 seconds, restore on return, show "Session Recovered" notification
- **Browser Doesn't Support Camera API**: Detect on load, show upgrade message, disable AR features gracefully with alternative photo upload option
- **Device Motion During Measurement**: Show stability indicator, require steady hold for 1 second, retry if too much motion detected
- **Client Tries to Access Another Client's Data**: Strict data isolation by client ID, show 404 if attempting to access unauthorized content
- **Appraiser Accidentally Publishes Wrong Report**: Add "unpublish" button in management panel, allow status rollback to draft
- **Multiple Update Requests for Same Property**: Group by property in UI, show relationship indicators, allow bulk operations
- **Client Submits Empty or Invalid Request**: Client-side validation requires title and description, show friendly error messages
- **Network Failure During Portal Access**: Graceful offline state, cache recent data, show reconnection status, queue actions for sync
- **Client Login with Non-Existent Email**: Clear error message, suggest contacting appraiser, no security information leakage

## Design Direction

The design should evoke **futuristic sophistication, precision, and raw power** - like a Tesla Cybertruck meets SpaceX mission control. Dark, immersive interface with glowing accents, glass morphism effects, and gradient highlights. The UI should feel like advanced technology from the future - minimalist yet powerful, with every pixel purposefully placed. Celebrate data with beautiful charts, smooth animations, and intelligent micro-interactions that respond instantly to user intent.

## Color Selection

A futuristic dark theme with electric purple/blue gradients and warm amber accents, projecting innovation, precision, and power.

- **Background**: Deep Space Dark `oklch(0.12 0.015 265)` - Immersive dark background creating focus and sophistication
- **Primary Color**: Electric Purple-Blue `oklch(0.65 0.25 265)` - Bold, futuristic color for primary actions and key data, with subtle glow effects
- **Secondary Colors**: 
  - Dark Slate `oklch(0.22 0.025 265)` - Supporting surfaces and cards with glass morphism
  - Muted Slate `oklch(0.19 0.02 265)` - Subtle backgrounds for nested components
- **Accent Color**: Warm Amber `oklch(0.72 0.20 85)` - High-energy color for CTAs, success states, and important values
- **Success**: Vibrant Green `oklch(0.68 0.20 155)` - Positive actions and growth indicators
- **Warning**: Energetic Yellow `oklch(0.75 0.18 75)` - Attention items and analytics highlights
- **Foreground/Background Pairings**:
  - Background (Deep Space `oklch(0.12 0.015 265)`): Light text `oklch(0.96 0.005 265)` - Ratio 14.5:1 ✓
  - Primary (Electric Purple `oklch(0.65 0.25 265)`): White text `oklch(0.98 0 0)` - Ratio 7.8:1 ✓
  - Accent (Warm Amber `oklch(0.72 0.20 85)`): Dark text `oklch(0.12 0.015 265)` - Ratio 9.2:1 ✓
  - Card (Dark Slate `oklch(0.16 0.02 265)`): Light text `oklch(0.96 0.005 265)` - Ratio 12.3:1 ✓

## Font Selection

Typography conveys technical precision and futuristic minimalism through clean sans-serif paired with monospace for data.

- **Primary**: Inter - Modern, clean sans-serif with excellent readability for UI elements and content
- **Data/Numbers**: JetBrains Mono - Technical monospace for all numbers, IDs, measurements, and monetary values

**Typographic Hierarchy**:
- H1 (Page Title): Inter Bold / 36px / -0.02em letter spacing / 1.1 line height / gradient text effect
- H2 (Section Headers): Inter SemiBold / 28px / -0.01em letter spacing / 1.2 line height
- H3 (Card Titles): Inter SemiBold / 20px / normal spacing / 1.3 line height
- Body (Content): Inter Regular / 15px / normal spacing / 1.6 line height
- Small (Labels): Inter Medium / 13px / normal spacing / 1.4 line height
- Data/Numbers: JetBrains Mono SemiBold / 16-36px / normal spacing / gradient text for emphasis

## Animations

Animations should feel instant yet fluid - inspired by Tesla UI responsiveness and SpaceX precision. Every motion serves a purpose: card hover lifts (4px translate with scale 1.02), smooth page transitions (300ms with ease-out), number counting animations for stats, gradient shimmer effects on glass cards, micro-interactions on buttons (scale down on press), and satisfying checkmarks on saves. Stagger animations on lists (50ms delay per item) create rhythm. All animations use GPU-accelerated transforms for 60fps smoothness.

## Navigation & Information Architecture

**The application uses a refined sidebar navigation system** with sophisticated visual design to organize the extensive feature set into logical, easy-to-navigate categories with advanced search capabilities.

### Sidebar Structure (8 Main Categories with Emoji Headers):

1. **🎯 ראשי (Core)** - Essential daily tools
   - לוח בקרה (Dashboard) - Central workspace and overview
   - נכסים (Properties) - Property database and management  
   - לקוחות (Clients) - Client relationship management

2. **🧮 שומות וחישובים (Valuations & Calculations)** - Professional calculation tools
   - מחשבונים מקצועיים (Professional Calculators) - All calculation methodologies
   - שומה מרובה (Bulk Valuation) - Portfolio batch processing
   - חלוקת יחידות (Unit Distribution) - Unit value allocation with auto-balancing
   - זכויות בנייה (Development Rights) - Development rights calculator
   - בדיקת מנוע שומה (Valuation Engine Tester) - Testing environment

3. **📊 ניתוח ותובנות (Analysis & Insights)** - Intelligence and analytics
   - ניתוח שוק (Market Insights) - Market trends and analytics
   - תובנות AI (AI Insights) - AI-powered analysis and predictions
   - דוחות מגמות (Automated Reports) - Trend analysis reports

4. **📄 דוחות ומסמכים (Reports & Documents)** - Report generation and export
   - דוחות תקניים (Standardized Reports) - Regulatory compliant documentation
   - מיתוג ועיצוב (Branding & Design) - Custom report branding and templates

5. **📁 ניהול תיקים ופרויקטים (Case & Project Management)** - Complex property management
   - ניהול תיקים (Case Management) - File and project management
   - ריבוי יחידות (Multi-Unit) - Multi-unit building management

6. **📧 תקשורת ומעקב (Communication & Follow-up)** - Client engagement
   - דוחות שנשלחו (Email History) - Sent reports tracking
   - רצפי מעקב (Email Sequences) - Automated follow-up campaigns
   - פורטל לקוחות (Client Portal) - Client access portal management

7. **🚀 טכנולוגיות מתקדמות (Advanced Technologies)** - Cutting-edge features
   - תאום דיגיטלי 3D (Digital Twin 3D) - Property digital twin visualization
   - מקורות נתונים חיים (Live Data Sources) - Live government data connections
   - ייבוא עסקאות (Transaction Import) - Automated transaction import

8. **💼 ניהול עסקי (Business Management)** - Business operations
   - ניתוח עסקי (Business Analysis) - Financial oversight and analytics
   - ניהול צוות (Team Management) - Permissions and role management
   - שיתוף פעולה (Team Collaboration) - Team collaboration tools
   - מעקב שינויים (Audit Trail) - Complete activity logging and compliance

### Advanced Search Functionality:
- **Instant search bar** at top of sidebar with magnifying glass icon
- **Smart keyword matching** searches both Hebrew labels and feature keywords
- **Real-time filtering** shows only matching categories and features as you type
- **Results counter** displays number of matching features found
- **Clear button** appears when search is active for quick reset
- **Empty state** with helpful message when no results found
- **Auto-clear** search after clicking a result for clean navigation
- **Search keywords** include: feature names, alternative terms, related concepts

### Navigation Visual Design:
- **Premium header** with gradient brand icon (Lightning) and glowing effect
- **Glass morphism background** with backdrop blur and subtle transparency (card/95 opacity)
- **Gradient accents** on header and footer (primary/5 tint)
- **Professional spacing** with generous padding and visual breathing room
- **Emoji category headers** for quick visual scanning and modern personality
- **Icon badges** for each menu item with rounded background on active state
- **Smooth rounded corners** (2xl radius on buttons) throughout for modern feel
- **Active state design**:
  - Left-to-right gradient background (primary/15 to primary/5)
  - Bold 3px right border in primary color
  - Icon on rounded primary/20 background
  - Fill weight icons (vs duotone for inactive)
  - Large shadow with primary/20 glow
  - Semibold font weight
- **Hover states**:
  - Secondary/70 background tint
  - Medium shadow elevation  
  - Foreground text color
  - Icon background fade-in
- **Footer section** with professional plan indicator and gradient badge
- **ScrollArea wrapper** for smooth scrolling with many categories
- **Collapsible functionality** to icon-only mode for maximum workspace
- **Persistent state** - remembers last viewed section across sessions
- **RTL-optimized** for Hebrew interface with proper alignment
- **Icon consistency** using Phosphor Icons with dynamic weights (fill/duotone)
- **Mobile responsive** - collapses automatically on smaller screens

## Component Selection

- **Components**:
  - Sidebar: Shadcn Sidebar component with collapsible groups, custom styling with glass effect
  - Card: Glass morphism effect with backdrop blur, subtle borders, gradient overlays on hover - used for all content containers
  - Tabs: Sleek pills with smooth active indicator, glowing when selected
  - Dialog: Full-screen overlays with backdrop blur and smooth scale-in animations
  - Button: Primary (gradient with glow), Secondary (glass outline), sizes respond to importance
  - Badge: Rounded with colored background/border, used for status indicators with appropriate color coding
  - Input: Dark with subtle border, focus state glows with ring effect
  - Progress: Gradient fill with smooth animations
  - Motion components: Framer Motion for all list items, cards, and page transitions
  
- **Visual Effects**:
  - Glass morphism: backdrop-filter blur(20px) with semi-transparent backgrounds
  - Gradient borders: Linear gradients from primary to accent
  - Glow effects: Box shadows with primary/accent colors at 30% opacity
  - Grid background: Subtle 30px grid pattern in background
  - Gradient text: Large numbers and headings use gradient clip-path

- **States**:
  - Buttons: Glow effect on hover, scale(0.98) on press, disabled fades to 50% opacity
  - Cards: Lift on hover (translateY -4px + scale 1.02), glow on active, gradient overlay fades in
  - Inputs: Border glows primary color on focus with smooth ring animation
  
- **Icon Selection** (Phosphor Icons with duotone weight):
  - Lightning: Speed/premium actions
  - Sparkle: AI features  
  - House: Properties
  - ChartBar: Analytics
  - Users: Clients
  - TrendUp/Down: Market indicators
  - MapPin: Locations
  - CheckCircle: Completed items
  
- **Spacing**: Generous whitespace with 8px base unit - cards get 24px padding, sections 32px gap, tight inline 8px

- **Mobile**: Bottom nav bar, full-width cards, collapsible sections, larger touch targets (48px), reduced animations for performance
