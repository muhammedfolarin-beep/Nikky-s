# README: Nikky's Clothing Website Design Guidelines

This document serves as the master blueprint for designing and developing the Nikky's Clothing website. It outlines the core visual philosophy, technical stack, and strict rules of engagement for the design system. Designing for a premium, heavily female-focused clothing brand requires a meticulous approach, ensuring every component reflects a simple, detailed, and elegant design structure.

---

## 1. Brand Vision & Visual Direction

The overarching design language combines modern minimalism with editorial sophistication. The interface must feel luxurious, intuitive, and memorable, drawing inspiration from luxury retail and high-end editorial fashion magazines.

**Core Principles:**

* **Timeless:** Avoid quickly outdated trendy UI elements.
* **Premium:** Utilize large photography, refined spacing, and subtle animations.
* **Minimal:** Remove visual clutter; every component must have a clear purpose.
* **Human:** Design for emotions before interactions.
* **Elegant:** Achieve luxury through restraint, generous white space, and impeccable typography, rather than excessive decoration.

---

## 2. Color System

The interface relies on a sophisticated palette designed to elevate the brand while maintaining timelessness.

### Primary Palette

| Color Name | Hex Code | Usage |
| --- | --- | --- |
| **Midnight Navy** | `#16202C` | Primary Buttons, Footer, Headings |
| **Deep Charcoal** | `#222831` | Primary Text |
| **Graphite** | `#4A5565` | Secondary Text |
| **Soft White** | `#FCFCFC` | Main Background |
| **Snow** | `#FFFFFF` | Cards |

### Premium Accent Palette

| Color Name | Hex Code | Usage |
| --- | --- | --- |
| **Champagne Gold** | `#C9A96E` | Premium accents, Icons |
| **Soft Gold** | `#D8C18A` | Hover States |
| **Platinum** | `#E7E7E7` | Borders |
| **Stone Gray** | `#E4E7EB` | Section Background |
| **Mist Blue** | `#EEF4F8` | Soft Background Sections |
| **Sage Mist** | `#D9E4DD` | Seasonal Collection Accent |
| **Dusty Blue** | `#B8C8D6` | Product Badges |
| **Cool Silver** | `#D6DCE5` | Inputs |

---

## 3. Typography

The typographic hierarchy relies on a high-contrast pairing to communicate premium quality and modern usability.

**Display Font: Playfair Display**

* **Usage:** Hero Titles, Collection Titles, Editorial Sections, Featured Quotes.
* **Scale:** Display XL (72px), Display L (60px), H1 (48px), H2 (40px), H3 (32px), H4 (24px), H5 (20px).

**UI Font: Inter**

* **Usage:** Navigation, Paragraphs, Forms, Product Information, Dashboard, Checkout.
* **Scale:** Body Large (18px), Body (16px), Small (14px), Caption (12px).

---

## 4. Layout, Spacing, & Motion

A detailed and mathematically precise structure is essential for an uncluttered, elegant vibe.

**Structure & Spacing**

* **Spacing Scale:** 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 120, 160.
* **Border Radius:** Small (8px), Medium (12px), Large (20px), Card (24px), Button (999px).

**Shadows**

* **Soft:** 0 6px 20px rgba(0,0,0,.05)
* **Medium:** 0 12px 40px rgba(0,0,0,.08)
* **Large:** 0 24px 80px rgba(0,0,0,.12)

**Motion System**

* **Philosophy:** Animations must feel elegant, soft, and intentional—never playful or bouncy.
* **Durations:** 150ms, 250ms, 350ms, 500ms (using ease-out, ease-in-out, or spring curves).
* **Hover Effects:** Lift Card, Fade Image, Scale Image 1.03, Fade Button, Soft Shadow Increase.

---

## 5. Technology Stack

**Frontend & Styling**

* **Framework:** Next.js 15 (App Router, Server Components).
* **Styling:** Tailwind CSS 4.
* **Animation:** Framer Motion.

**Backend, Auth, & Storage**

* **Database/Auth:** Supabase (PostgreSQL, Edge Functions, Row Level Security).
* **Storage:** Supabase Storage (for product images, banners, user avatars).

**Payments & Deployment**

* **Payments:** Paystack (Nigerian Cards, Bank Transfer) and Stripe (International, Apple/Google Pay).
* **Infrastructure:** Vercel.

---

## 6. The Anti-Gravity Design Prompt

Copy and paste the following prompt into the Anti-Gravity engine before initiating the design of any new page or component for Nikky's Clothing.

> **SYSTEM OVERRIDE: NIKKY'S CLOTHING DESIGN SYSTEM V1.0**
> **Role:** You are a senior UI/UX designer and developer tasked with generating a page for "Nikky's Clothing" within the Anti-Gravity environment.
> **Objective:** Design the requested page while strictly enforcing the Nikky's Clothing brand guidelines. The output must reflect a premium, effortless, minimal, and elegant e-commerce experience inspired by luxury retail and editorial fashion magazines.
> **Strict Constraints & Instructions:**
> 1. **Visual Style:** The design must maintain a simple but detailed structure. Maximize generous white space. Use large, editorial-style photography. Apply minimal glassmorphism and soft shadows.
> 2. **Color Palette:** You are strictly limited to the brand palette. Do not invent new colors.
> * Primary UI/Headings: Midnight Navy (`#16202C`), Deep Charcoal (`#222831`)
> * Backgrounds: Soft White (`#FCFCFC`), Snow (`#FFFFFF`), Mist Blue (`#EEF4F8`)
> * Accents/Interactive: Champagne Gold (`#C9A96E`), Soft Gold (`#D8C18A`)
> * Borders/Inputs: Platinum (`#E7E7E7`), Cool Silver (`#D6DCE5`)
> 
> 
> 3. **Typography:** Use **Playfair Display** for all headings, hero titles, and editorial quotes. Use **Inter** for all navigation, paragraphs, UI forms, and microcopy.
> 4. **Layout & Shapes:** Strictly adhere to the spacing scale (multiples of 4/8). Apply pill-shaped buttons (999px radius) and smooth rounded cards (24px radius).
> 5. **Execution:** Do not add heavy visual clutter. Rely on the sophisticated typography, refined spacing, and subtle structural details to create an elegant vibe. Ensure all microcopy matches the calm, trustworthy brand voice.
> 
> 
> **Task:** Acknowledge these rules, apply them strictly to the environment, and generate the requested layout accordingly without deviating from this master prompt.
