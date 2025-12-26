# Planning Guide

A comprehensive real estate appraisal platform for professional appraisers to evaluate properties, generate detailed reports, manage comparable properties, and provide accurate valuations using data-driven insights and advanced analysis tools.

**Experience Qualities**:
1. **Professional** - The interface should project authority and expertise, instilling confidence in appraisers using serious typography, structured layouts, and data-rich displays
2. **Efficient** - Every workflow should minimize clicks and cognitive load, enabling appraisers to complete evaluations quickly with smart defaults and batch operations
3. **Insightful** - Visual analytics and comparative data should reveal patterns and support decision-making through charts, maps, and intelligent suggestions

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This is a professional tool requiring multiple sophisticated features: property database management, comparable property search and analysis, automated valuation models, report generation, document management, client tracking, and data visualization - all working together in a cohesive system.

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

### Valuation Calculator
- **Functionality**: Multiple valuation methods (comparable sales, cost approach, income approach) with adjustments
- **Purpose**: Calculate property value using industry-standard methodologies
- **Trigger**: After selecting comparable properties
- **Progression**: Select valuation method → Review comparable adjustments → Apply property-specific factors → Generate estimated value range → Review confidence score
- **Success criteria**: Calculations follow industry standards, adjustments are documented, provides value range with confidence intervals

### Report Generator
- **Functionality**: Creates professional PDF/Word reports with all appraisal data, photos, comparables, and analysis
- **Purpose**: Deliver formal appraisal documentation to clients
- **Trigger**: Click "Generate Report" after completing valuation
- **Progression**: Select report template → Review/edit sections → Add appraiser notes → Preview report → Export as PDF/Word
- **Success criteria**: Professional formatting, includes all required sections, customizable templates, includes photos and charts

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
- **Functionality**: Generates professional property descriptions from entered data and photos
- **Purpose**: Save time writing descriptions and ensure consistent, professional language
- **Trigger**: Click "Generate Description" in property details
- **Progression**: Review property data → Click generate → AI creates description → Edit as needed → Save
- **Success criteria**: Descriptions are accurate, professional tone, customizable, saves appraiser time

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

## Edge Case Handling

- **No Comparable Properties Found**: Display message with suggestions to expand search radius or adjust criteria, allow manual comparable entry
- **Incomplete Property Data**: Allow saving as draft, highlight missing required fields, suggest typical values based on property type
- **Duplicate Property Detection**: Warn when entering address that matches existing property, offer to load existing data
- **Offline Access**: Cache recent appraisals and allow work to continue offline, sync when connection restored
- **Large Photo Files**: Automatically compress images while maintaining quality, show progress indicators
- **Conflicting Valuation Methods**: Display all methods side-by-side, explain variances, allow appraiser to select final value with notes
- **Missing Market Data**: Gracefully show "data unavailable" with explanation, suggest alternative analysis methods
- **Report Generation Failure**: Maintain draft progress, allow section-by-section export, provide error details

## Design Direction

The design should evoke **confidence, precision, and professionalism** - like a high-end financial terminal meets modern SaaS platform. It should feel sophisticated and data-rich without being overwhelming, using clean layouts, professional typography, and a color scheme that suggests trust and expertise. The interface should celebrate data visualization with charts, maps, and grids that make complex information digestible.

## Color Selection

A professional blue and slate palette with warm accent for important actions, projecting trust, sophistication, and analytical precision.

- **Primary Color**: Deep Professional Blue `oklch(0.45 0.15 250)` - Communicates trust, expertise, and authority; used for primary actions and key data points
- **Secondary Colors**: 
  - Slate Gray `oklch(0.55 0.01 240)` - Supporting color for secondary UI elements and backgrounds
  - Light Blue Gray `oklch(0.95 0.01 240)` - Subtle backgrounds for cards and panels
- **Accent Color**: Warm Amber `oklch(0.68 0.16 65)` - Attention-grabbing for CTAs, important values, and success states
- **Foreground/Background Pairings**:
  - Background (White `oklch(0.99 0 0)`): Dark text `oklch(0.25 0.01 240)` - Ratio 13.2:1 ✓
  - Primary (Deep Blue `oklch(0.45 0.15 250)`): White text `oklch(0.99 0 0)` - Ratio 8.4:1 ✓
  - Accent (Warm Amber `oklch(0.68 0.16 65)`): Dark text `oklch(0.25 0.01 240)` - Ratio 6.2:1 ✓
  - Card (Light Gray `oklch(0.97 0.01 240)`): Dark text `oklch(0.25 0.01 240)` - Ratio 12.8:1 ✓

## Font Selection

Typography should convey analytical precision and modern professionalism, balancing readability for dense data with visual sophistication.

- **Primary**: Inter - Clean, professional sans-serif perfect for data-heavy interfaces and UI elements
- **Accent**: JetBrains Mono - Monospace for numbers, property IDs, and measurements to enhance precision feel

**Typographic Hierarchy**:
- H1 (Page Title): Inter Bold / 32px / -0.02em letter spacing / 1.2 line height
- H2 (Section Headers): Inter SemiBold / 24px / -0.01em letter spacing / 1.3 line height
- H3 (Card Titles): Inter SemiBold / 18px / normal spacing / 1.4 line height
- Body (Content): Inter Regular / 15px / normal spacing / 1.6 line height
- Small (Labels): Inter Medium / 13px / normal spacing / 1.4 line height
- Data/Numbers: JetBrains Mono Medium / 15px / normal spacing / 1.5 line height

## Animations

Animations should reinforce efficiency and precision - quick, purposeful transitions that guide attention without delay. Use subtle micro-interactions on data updates (numbers counting up, chart animations), smooth page transitions (slide left/right for sequential flows), and satisfying feedback on saves (gentle checkmark bounce). Avoid decorative animations; every motion should serve a functional purpose like indicating state changes or directing focus to new data.

## Component Selection

- **Components**:
  - Card: Property listings, comparable properties, stats dashboard - with subtle hover lift effect
  - Tabs: Switch between valuation methods, report sections, different views
  - Dialog: Add new property, edit details, confirm actions - large sizes for forms
  - Sheet: Side panel for quick filters, property details preview
  - Table: Comparable properties grid, adjustment grid - with sortable columns
  - Form: Property details entry with validation - using react-hook-form
  - Select: Dropdowns for property type, condition, neighborhoods
  - Input: Text fields with JetBrains Mono for numbers and measurements
  - Button: Primary (solid blue), Secondary (outline), Destructive (red)
  - Badge: Property status (draft, complete, sent), priority indicators
  - Calendar: Date pickers for sale dates, inspection dates
  - Tooltip: Explain abbreviations, show full data on hover
  - Progress: Report generation, data loading states
  - Separator: Visual division between sections
  - Avatar: Client photos in client management
  - Scroll Area: Long lists of comparables, photo galleries

- **Customizations**:
  - Custom map component using interactive visualization for comparable locations
  - Property photo gallery with lightbox and annotation overlay
  - Adjustment grid component with inline editing and calculation
  - Value range visualizer showing confidence intervals
  - Market trend chart components using D3 for sophisticated data viz

- **States**:
  - Buttons: Default (solid), Hover (slight brightness increase + lift), Active (pressed down), Disabled (faded)
  - Inputs: Default (subtle border), Focus (blue ring + border color change), Error (red border + shake), Success (green border + checkmark icon)
  - Cards: Default (flat), Hover (subtle shadow + lift), Selected (blue border + background tint)

- **Icon Selection**:
  - Plus: Add new property/comparable
  - MagnifyingGlass: Search for comparables
  - House: Property type indicators
  - ChartBar: View analytics and trends
  - FileText: Generate/view reports
  - MapPin: Location/neighborhood info
  - Camera: Photo upload/management
  - Calendar: Date selection
  - User: Client management
  - Calculator: Valuation tools
  - Download: Export reports
  - Pencil: Edit property details

- **Spacing**:
  - Page padding: 8 (32px)
  - Section gaps: 6 (24px)
  - Card padding: 6 (24px)
  - Card gaps in grid: 4 (16px)
  - Form field gaps: 4 (16px)
  - Button padding: px-6 py-3
  - Tight inline spacing: 2 (8px)

- **Mobile**:
  - Stack navigation tabs vertically
  - Full-width cards instead of grid
  - Collapsible filters in sheet drawer
  - Simplified table view (show only key columns, tap to expand)
  - Bottom sheet for quick actions
  - Reduce page padding to 4 (16px)
  - Larger touch targets (min 44px)
  - Single column layout for forms
