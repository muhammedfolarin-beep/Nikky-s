# Design Brief: SN24 Clothing Store

## 1. Design Principles

* **Tactile Precision:** Entering custom body measurements should feel reassuring, simple, and empowering rather than technical or clinical. Visual silhouettes and clear inch indicators turn abstract numbers into tangible confidence.
* **Editorial Restraint:** The apparel, silhouette lines, and fabric textures are the true heroes. The interface stays quiet with deep obsidian tones, subtle borders, generous breathing space, and zero unnecessary visual noise.
* **Frictionless Transparency:** No hidden steps or unexpected costs. Production timelines, custom tailoring tags, and delivery fees between local dispatch and express couriers remain crystal clear from product selection to payment.

---

## 2. Visual Direction

* **Mood and Aesthetic:** Contemporary African luxury meets sculpted minimalism. Architectural, confident, sleek, and warm.
* **Visual References:** The refined editorial pacing of luxury fashion lookbooks, balanced with the effortless speed and crisp typography of modern digital storefronts.
* **What to Avoid:** Distracting popups, neon discount badges, generic templates with heavy drop shadows, cluttered multi banner carousels, and multi step checkout screens that hide shipping costs.

---

## 3. Design Tokens

### Typography
* **Primary Display and Headings:** `Outfit` (Weights: 500, 600, 700). Selected for its geometric structure, wide aperture, and modern fashion feel that gives the SN24 identity strong brand presence.
* **Body, UI and Numbers:** `Plus Jakarta Sans` (Weights: 400, 500, 600). Selected for clean legibility on small mobile viewports, clear distinction between digits, and balanced proportions across forms.

| Token | Size | Line Height | Weight | Application |
|---|---|---|---|---|
| `text-display` | 40px | 48px | Bold (700) | Hero statements and brand banners |
| `text-h1` | 32px | 38px | Bold (700) | Product titles and page headlines |
| `text-h2` | 24px | 30px | SemiBold (600) | Section headers and modal titles |
| `text-h3` | 18px | 24px | SemiBold (600) | Card titles and subheadings |
| `text-body` | 15px | 22px | Regular (400) | Garment descriptions and guides |
| `text-ui` | 13px | 18px | Medium (500) | Form labels, buttons, and navigation |
| `text-caption` | 11px | 16px | Medium (500) | Badges, measurement tags, and timestamps |

### Color Palette

| Token Name | Hex Code | Purpose and UI Usage |
|---|---|---|
| `obsidian-base` | `#0C0C0E` | Main page background, creating an immersive dark canvas |
| `graphite-surface` | `#17171C` | Card backdrops, modal containers, and elevated surfaces |
| `charcoal-border` | `#26262B` | Subtle outlines, dividers, and component borders |
| `alabaster-pure` | `#F9F9FB` | Primary headings, active text, and high priority buttons |
| `warm-sand` | `#D8C3A5` | Brand accent for tailoring badges, active pills, and focus rings |
| `stone-muted` | `#8E8E93` | Secondary text, placeholder values, and inactive states |
| `emerald-success` | `#22C55E` | Payment verification and successful order status badges |
| `coral-error` | `#F43F5E` | Form validation alerts and invalid measurement notices |

### Spacing Scale
* `space-xs`: 4px (micro spacing inside pills and badges)
* `space-sm`: 8px (gap between icon and label, form helper text)
* `space-md`: 16px (standard input padding, grid gaps on mobile)
* `space-lg`: 24px (card internal padding, stack spacing)
* `space-xl`: 32px (section vertical spacing, modal padding)
* `space-2xl`: 48px (page margins on desktop)
* `space-3xl`: 64px (hero spacing and section dividers)

### Radius and Elevation
* `radius-pill`: 9999px (size selector tags, status badges)
* `radius-input`: 12px (form inputs, stepper buttons)
* `radius-card`: 20px (product cards, delivery option containers)
* `radius-modal`: 28px (dialogs, bottom sheets)
* `elevation-glow`: `0 20px 40px rgba(0, 0, 0, 0.6)` paired with a `1px` border of `charcoal-border` for depth without muddy drop shadows.

---

## 4. Screen Inventory

* **Screen 1: Home and Editorial Discovery (`/`)**
  * *Purpose:* Establish brand authority, showcase seasonal drops, and offer quick paths to curated collections.
* **Screen 2: Collection Catalog (`/shop`)**
  * *Purpose:* Enable effortless browsing with filters for lifestyle categories, fit types, and price.
* **Screen 3: Product Detail and Fit Customizer (`/products/[slug]`)**
  * *Purpose:* High conversion screen to view garment details, choose between ready to wear sizes or custom measurements, and inspect the measuring guide.
* **Screen 4: Cart Slide Over Drawer (Global Overlay)**
  * *Purpose:* Review selected pieces, verify custom sizing inputs, and see production notices before checkout.
* **Screen 5: Unified Fast Checkout (`/checkout`)**
  * *Purpose:* Single page checkout combining address entry, dynamic shipping selection (Local Dispatch vs GIG Logistics), and Paystack payment initiation.
* **Screen 6: Order Confirmation and Receipt (`/orders/[reference]`)**
  * *Purpose:* Reassure the buyer with immediate payment confirmation, itemized measurements, delivery tracking details, and support access.
* **Screen 7: Admin Production and Fulfillment Dashboard (`/admin/orders`)**
  * *Purpose:* Allow the store manager to track orders through production stages, review exact custom measurements, and manage dispatch waybills.

---

## 5. User Flows

### Flow A: Custom Fit Purchase
1. Shopper lands on Product Detail Page and taps **Custom Fit**.
2. Form reveals bust, waist, hips, and length fields.
3. Shopper taps **Tape Guide**, reviews the visual measurement points, and enters numbers in inches.
4. Shopper taps **Add to Bag** (line item saves custom measurements and 7 working days production notice).
5. In Checkout, shopper enters shipping address.
6. System calculates fees for **Standard Local Dispatch** versus **GIG Logistics Express**.
7. Shopper selects GIG Logistics, completes payment via Paystack Bank Transfer.
8. Instant redirect to order confirmation with assigned reference and delivery estimate.

### Flow B: Ready to Wear Rapid Purchase
1. Shopper browses Catalog, opens a dress, and taps **UK 10**.
2. Delivery badge updates to **24 to 48 Hour Dispatch**.
3. Shopper taps **Add to Bag**, then proceeds to Checkout.
4. Shopper selects Standard Local Dispatch, pays with Debit Card.
5. System logs transaction and displays confirmation receipt.

### Flow C: Admin Order Processing
1. Store manager opens Admin Dashboard.
2. Orders marked **Paid** appear in the active queue with custom measurement tags highlighted.
3. Manager clicks an order, inspects custom measurements, and updates status to **In Production**.
4. Once tailoring finishes at day 7, manager toggles to **Ready for Dispatch**, generates the delivery waybill, and completes the cycle.

---

## 6. Per Screen Layout

### Product Detail and Customizer Screen
* **Section 1 (Top / Left):** High resolution image gallery with swipeable thumbnails, zoom on hover, and fabric detail close ups.
* **Section 2 (Top Right):** Title, base price, category tag, and concise garment description.
* **Section 3 (Fit Switcher):** Segmented pill toggle: `Ready to Wear` or `Custom Fit`.
* **Section 4 (Dynamic Sizing Panel):**
  * *State A (Ready to Wear):* Grid of standard UK sizes (UK 6 to UK 18).
  * *State B (Custom Fit):* Four numeric inputs (Bust, Waist, Hips, Length) with a persistent **How to Measure** guide trigger.
* **Section 5 (Production and Dispatch Banner):** Dynamic card highlighting either 7 working days custom tailoring or 24 to 48 hours ready to wear dispatch.
* **Primary Action:** Sticky bottom button on mobile, prominent block button on desktop: `Add to Bag • ₦[Amount]`.

### Unified Checkout Screen
* **Section 1 (Customer Information):** Full name, email address, and phone number for SMS tracking.
* **Section 2 (Shipping Address):** State and local area selection with street address.
* **Section 3 (Delivery Method Selector):** Two interactive cards comparing **Standard Local Dispatch** (flat fee, 2 to 3 days post production) and **GIG Logistics** (calculated express rate, 1 to 2 days post production).
* **Section 4 (Order Summary):** Itemized breakdown showing garment thumbnails, custom measurement tags, subtotal, selected delivery fee, and grand total.
* **Primary Action:** `Pay ₦[Total] with Paystack` (supports Card and Verified Bank Transfer).

---

## 7. Component Library

### Component Structure
* **Buttons:**
  * Primary Button (Solid Alabaster, Obsidian text, active scale down)
  * Secondary Button (Graphite surface, Charcoal border, Alabaster text)
  * Ghost Text Button (Stone muted, underline on hover)
* **Inputs and Controls:**
  * Form Input (Obsidian bg, Charcoal border, focus Warm Sand outline)
  * Fit Mode Segmented Switch (Pill container with sliding background)
  * Size Pill Button (Variants: default, active, out of stock)
  * Numerical Stepper Input (Validated min and max bounds)
* **Display and Feedback:**
  * Product Card (Aspect 4:5 image, title, price, custom fit tag)
  * Production Timeline Badge (Icon, title, dynamic timeframe description)
  * Delivery Tier Card (Radio indicator, courier name, price, arrival days)
  * Measurement Guide Modal (Overlay, visual cards, step explanations)

### Component States Table

| Component | Default State | Hover State | Focus State | Active / Selected | Disabled State |
|---|---|---|---|---|---|
| **Primary Button** | White bg, Black text | Opacity 90 percent | Sand glow ring | Scale 98 percent | Muted gray, 40 percent opacity |
| **Size Pill** | Graphite bg, Stone text | Border lightens | Sand border | White bg, Black text | Strike through, unclickable |
| **Form Input** | Dark bg, Charcoal border | Border turns gray | Sand outline ring | Typing state, White text | Darkened, non editable |
| **Delivery Card** | Graphite bg, thin border | Border turns white | Ring highlight | Sand accent border, check icon | Grayed out with unavailable tag |

---

## 8. State Variations

* **Empty States:**
  * *Empty Bag Drawer:* Large minimal bag icon, headline stating *Your bag is currently empty*, followed by a *Discover New Arrivals* button.
  * *No Search Results:* Clear statement with suggestion to reset filters or explore custom pieces.
* **Loading States:**
  * *Catalog and Product Screens:* Skeleton cards with smooth graphite pulse shimmer matching exact image and text ratios.
  * *Payment Verification:* Full screen modal with pulsing obsidian ring, displaying *Confirming your payment with Paystack...*
* **Error States:**
  * *Measurement Validation:* Red underline beneath the invalid input with clear feedback (such as *Please enter a waist measurement between 20 and 60 inches*).
  * *Payment Failure:* Reassuring card explaining the issue with an instant *Try Transfer Option* or *Retry Payment* button.
* **Success States:**
  * *Order Placed:* Smooth checkmark animation, highlighted order number, breakdown of custom fit dimensions, and GIG tracking timeline.
* **Offline State:**
  * *Connection Drop:* Subtle top toast banner stating *You are currently offline. Changes will sync when reconnected.*

---

## 9. Responsive Behaviour

* **Mobile (360px to 480px):**
  * Single column product layouts with horizontal touch carousel for product photos.
  * Sizing and fit controls stack vertically with finger friendly tap targets (minimum 48px height).
  * The **Add to Bag** action sits in a sticky bottom bar with safe area padding for iOS and Android navigation bars.
  * The measurement guide opens as a smooth swipeable bottom sheet.
* **Tablet (768px to 1024px):**
  * Two column product grid on catalog pages.
  * Product detail page splits into photo gallery on the left and sticky customizer form on the right.
* **Desktop (1280px and wider):**
  * Catalog displays 3 to 4 items per row with subtle image zoom on hover.
  * Product detail page locks the image gallery in place while the customizer column scrolls smoothly.
  * Checkout presents a split two column layout (Customer details and shipping on the left, sticky order summary and Paystack button on the right).

---

## 10. Accessibility (A11y)

* **Contrast Ratios:** All body text in `alabaster-pure` on `obsidian-base` surpasses a 14:1 contrast ratio, comfortably exceeding WCAG AAA standards. Secondary `stone-muted` text maintains a minimum 4.5:1 ratio for WCAG AA compliance.
* **Focus Management:** Every interactive element features a high contrast `warm-sand` focus outline (`2px` solid ring) when navigated via keyboard tab keys.
* **Keyboard Navigation:**
  * Size pill selectors and delivery cards support arrow key navigation.
  * Modals trap focus completely until dismissed using the `Escape` key or close action.
* **ARIA Standards:**
  * Segmented fit switch utilizes `role="radiogroup"` with `aria-checked` states.
  * Custom measurement inputs include explicit `aria-label` and `aria-describedby` tags pointing directly to error and helper texts.
  * Measurement modal dialog includes `role="dialog"`, `aria-modal="true"`, and `aria-labelledby="modal-title"`.
