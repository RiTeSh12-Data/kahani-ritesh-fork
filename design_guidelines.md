# LegacyScribe Design Guidelines

## Design Approach
**Reference-Based**: Drawing inspiration from premium storytelling platforms like Remento.co and Storyworth, combined with modern SaaS landing page patterns (Stripe, Linear) for trust and clarity.

## Core Design Principles
- **Emotional Connection**: Warm, inviting aesthetic that honors elderly stories and family legacy
- **Trust & Credibility**: Premium feel with clear value propositions and social proof
- **Simplicity**: Clean layouts that don't overwhelm, focusing on one clear action per section

---

## Typography System

**Font Family**: Inter (Google Fonts - weights: 400, 500, 600, 700)

**Type Scale**:
- Hero Headline: 3.5rem (56px) / font-bold / leading-tight
- Section Heading: 2.5rem (40px) / font-semibold / leading-snug
- Card Title: 1.5rem (24px) / font-semibold
- Body Large: 1.125rem (18px) / font-normal / leading-relaxed
- Body Standard: 1rem (16px) / font-normal / leading-normal
- Small Text: 0.875rem (14px) / font-medium

**Hierarchy**: Large, emotional headlines with generous line-height. Body text prioritizes readability with relaxed leading.

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 4, 6, 8, 12, 16, 20 (e.g., p-8, gap-12, mt-20)

**Container Strategy**:
- Full-width sections with inner max-w-6xl containers
- Section padding: py-20 (desktop), py-12 (mobile)
- Component spacing: gap-8 between cards, gap-16 between major sections

**Grid Patterns**:
- Feature cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
- Product catalog: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Testimonials: grid-cols-1 md:grid-cols-3

---

## Color Palette

**Primary Colors**:
- Deep Blue: #2C5282 (primary CTA buttons, headings)
- Warm Gold: #D4A574 (accent, secondary CTAs, highlights)
- Soft Success: #4CAF50 (confirmation states, trust badges)

**Background Colors**:
- Warm White: #FAFAF8 (main background)
- Soft Gold: #F5E6D3 (hero gradient start)
- Light Amber: #E8D4B8 (hero gradient end)
- Card Background: White with subtle shadow

**Text Colors**:
- Primary Text: #1A202C (headings, strong emphasis)
- Secondary Text: #4A5568 (body copy)
- Muted Text: #718096 (supporting info)

---

## Component Library

### Navigation
- Sticky header with logo left, navigation center (Home, Products, How It Works, Pricing, Free Trial)
- Primary CTA button right: "Start Free Trial" (gold background)
- Mobile: Hamburger menu with slide-out drawer
- Height: 4rem (64px), backdrop-blur on scroll

### Hero Section
- **Layout**: Full viewport height (min-h-screen), gradient background from #F5E6D3 to #E8D4B8
- **Image**: Large hero image right side (50%) showing elderly person with family, warm lighting
- **Content**: Left side (50%) with headline, subheading, dual CTAs
- **Primary CTA**: "Start Preserving Stories" (blue background, large, rounded-lg)
- **Secondary CTA**: "See How It Works" (outlined, gold border)
- **Trust Badges**: Below CTAs - 3 inline stats with icons (500+ Stories, 98% Satisfaction, 45 Days Average)

### Feature Cards
- **Grid**: 4 columns on desktop, 2 on tablet, 1 on mobile
- **Card Style**: White background, rounded-xl (12px), shadow-md, p-8, hover:shadow-xl transition
- **Icon**: Top of card, 3rem size, gold color
- **Title**: 1.25rem, semibold, blue color
- **Description**: Body text, muted color
- **Hover**: Lift effect (translate-y-[-4px])

### Product Cards (Catalog)
- **Layout**: 3-column grid, gap-8
- **Card Components**: 
  - Hero image top (aspect-ratio-4/3, rounded-t-xl)
  - Content padding: p-6
  - Category badge (gold background, small, top-right absolute)
  - Title and subtitle (blue headings)
  - Pricing prominent (2rem, bold)
  - "50 Questions • 50 Days" metadata (muted text)
  - "View Details" button (full-width, outlined)
- **Hover**: Image zoom (scale-105), card shadow increase

### Testimonials
- **Layout**: 3-column grid
- **Card Structure**:
  - Customer photo circle (4rem, top with -mt-8 to overlap card)
  - 5-star rating (gold stars)
  - Quote text (italic, 1.125rem)
  - Customer name and relationship (semibold, muted)
- **Style**: White cards, rounded-lg, p-6, shadow-sm

### Pricing Cards
- **Layout**: 3 tiers side-by-side, center tier highlighted
- **Highlighted Tier**: Scale-105, shadow-2xl, gold border-2
- **Components**: 
  - Tier name top (uppercase, tracking-wide, small)
  - Price large (3rem, bold) with ₹ symbol
  - "per story" subtext
  - Features list (checkmark icons, gap-3)
  - "Choose Plan" CTA (full-width)

### FAQ Accordion
- **Style**: White background, border-b between items
- **Item**: py-6, px-0
- **Question**: Flex row, justify-between, font-semibold, cursor-pointer
- **Chevron Icon**: Right side, rotates on expand
- **Answer**: pt-4, muted text, smooth expand/collapse animation

### Forms (Free Trial, Checkout)
- **Input Style**: 
  - Border: 2px solid #E2E8F0
  - Focus: border-blue, ring-4 ring-blue/10
  - Padding: px-4 py-3
  - Rounded: rounded-lg
  - Background: white
- **Labels**: Semibold, mb-2, blue color
- **Helper Text**: Small, muted, mt-1
- **Error State**: border-red, text-red
- **Grouping**: Related fields in 2-column grid (md:grid-cols-2, gap-4)

### Buttons
- **Primary**: bg-blue (#2C5282), text-white, px-8, py-3, rounded-lg, font-semibold, hover:bg-blue-700, shadow-md
- **Secondary**: bg-gold (#D4A574), text-white, same sizing
- **Outlined**: border-2 border-blue, text-blue, bg-transparent, hover:bg-blue-50
- **Sizes**: Small (px-4 py-2 text-sm), Medium (px-6 py-3), Large (px-8 py-4 text-lg)

### How It Works Timeline
- **Layout**: Horizontal 3-step process with connecting lines
- **Step Card**: 
  - Number badge (circle, gold background, 3rem)
  - Title (semibold, 1.25rem)
  - Description (body text)
  - Illustration icon below
- **Connector**: Dashed line between steps (gold color, 2px)
- **Mobile**: Stack vertically with vertical connecting line

### Cart & Checkout
- **Cart Items**: Table-like layout with thumbnail left, details center, price/actions right
- **Order Summary**: Sticky sidebar (bg-warm-white, rounded-xl, p-6)
- **Checkout Steps**: Step indicator top (numbered circles, gold active state, connected line)
- **Payment Section**: Razorpay button centered, security badges below

### Success/Confirmation
- **Animation**: Large checkmark circle (6rem) with fade-in and scale animation
- **Color**: Success green background (#4CAF50)
- **Layout**: Centered content, max-w-2xl
- **Order Details**: Card with border-l-4 (gold), p-6, mt-8

---

## Images

**Hero Section Image**: 
- Warm, authentic photo of elderly person sharing story with grandchild
- Natural lighting, soft focus background
- Positioned right side, 50% width, rounded-l-2xl on desktop
- Mobile: Full-width above content

**Product Category Images**:
- Military & Veterans: Veteran in uniform with medals
- Grandparent Chronicles: Elderly couple smiling
- Career & Life: Professional portrait, warm office setting
- Immigration & Culture: Diverse family gathering
- Healthcare Heroes: Medical professional compassionate moment
- Entrepreneur Legacy: Business leader in thoughtful pose

**Testimonial Photos**:
- Circular customer photos (real people, diverse ages)
- Warm, friendly expressions
- Professional quality but authentic feel

---

## Animations & Interactions

**Transitions**: All 300ms ease-in-out
**Hover Effects**: 
- Cards: lift (translateY -4px) + shadow increase
- Buttons: slight darken (brightness-110%)
- Images: subtle zoom (scale-105)
**Scroll Animations**: Fade-in on viewport entry (simple, not overdone)
**Loading States**: Spinner (gold color) or skeleton screens for cart/checkout

---

## Page-Specific Layouts

### Landing Page
1. Hero (full viewport)
2. Trust Badges row
3. Features (4-column grid)
4. How It Works (3-step timeline)
5. Product Preview (3 featured packs)
6. Testimonials (3-column)
7. Pricing Tiers (3-column)
8. FAQ (accordion list)
9. Final CTA (centered, gradient background)

### Product Catalog
- Page header (breadcrumb, title, filter tags)
- Grid layout (3 columns)
- All 6 categories visible
- Sticky "View Cart" button bottom-right if items added

### Free Trial Page
- Hero section explaining trial (30-day free, 10 questions)
- Two-column form (user info left, elder info right)
- WhatsApp number input with country code selector
- Schedule preference (radio buttons with icons)
- Large "Start My Free Trial" button
- Trust indicators below (no credit card required, cancel anytime)

---

## Responsive Behavior

**Breakpoints**: sm: 640px, md: 768px, lg: 1024px, xl: 1280px

**Mobile Adjustments**:
- Hero: Stack vertically, image full-width top
- Grids: All collapse to single column
- Navigation: Hamburger menu
- Padding: Reduce to py-12, px-4
- Font sizes: Scale down 20% (e.g., 56px → 44px for h1)
- Buttons: Full-width on mobile