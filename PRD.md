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
- **Functionality**: Professional PDF export system for valuation engine test results with comprehensive documentation of all three calculation methods (Comparable Sales, Cost Approach, Income Approach)
- **Purpose**: Generate professional, client-ready valuation reports directly from test results for documentation, presentation, or legal purposes
- **Trigger**: Click "ייצא ל-PDF" button next to individual test results or "ייצא דוח מקיף" for comprehensive multi-method report in Valuation Engine Tester
- **Progression**: 
  - Single method: Run valuation method → View results → Click "ייצא ל-PDF" → PDF auto-downloads with complete analysis
  - Multi-method: Run all three methods → Click "ייצא דוח מקיף" → Comprehensive PDF auto-downloads with comparison analysis
- **Success criteria**:
  - Professional multi-page PDF with branded header and formatting
  - Includes complete property information and valuation summary
  - Detailed methodology explanation for each approach
  - Step-by-step calculation breakdown with formulas and inputs
  - Visual hierarchy with color-coded sections (Purple for Comparable Sales, Yellow for Cost, Green for Income)
  - Comprehensive reports include executive summary, comparison table, and statistical analysis
  - Auto-generated report numbers and dates
  - Professional assumptions and limitations sections
  - Legal disclaimer and footer with page numbers
  - Client-side generation (no server required) using jsPDF library
  - Instant download with descriptive filename

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

## Component Selection

- **Components**:
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
