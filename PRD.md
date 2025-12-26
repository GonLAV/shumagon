# Planning Guide

A comprehensive real estate appraisal platform for professional appraisers to evaluate properties, generate detailed reports, manage comparable properties, and provide accurate valuations using data-driven insights and advanced analysis tools - designed with a futuristic, minimalist interface inspired by Tesla and SpaceX product philosophy.

**Experience Qualities**:
1. **Futuristic & Sophisticated** - Dark, immersive interface with glowing accents, glass morphism effects, and smooth animations that feel like using cutting-edge technology from the future
2. **Effortlessly Powerful** - Complex functionality presented through clean, minimalist design with every interaction feeling instant and intelligent
3. **Precision & Trust** - Data-rich displays with monospace typography for numbers, gradient highlights for important values, and visual feedback that instills confidence

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This is a professional tool requiring multiple sophisticated features: property database management, comparable property search and analysis, automated valuation models, report generation, document management, client tracking, and data visualization - all presented through an exceptionally polished, futuristic interface that makes complex tasks feel simple.

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
