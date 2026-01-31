# LifeOS - Personal Assistant

A "Digital Concierge" for high-performance self-care and personal management. This frontend-only web app translates a static personal "Life OS" into a reactive, mobile-first web application.

## Features

### Navigation & Architecture
- **Persistent Left Sidebar** (desktop) with 12 color-coded categories
- **Floating Action Menu** (mobile) for easy navigation
- Categories organized by domain: Daily Logic, Routines, Inventory, Nutrition, Physicality

### The "Today" Dashboard (Command Center)
- **Context-aware**: Pulls the current date and day, dynamically filters routines
- **Smart Sections**: Skin & Face, Targeted Care, Movement, Fueling
- **Satisfying Check-off**: Smooth transitions with green checkmarks, strikethrough, and opacity fade
- **Conflict Warnings**: Alerts for product interactions (e.g., Tretinoin + AHA/BHA)

### Routine Management (Library Mode)
- **Skin** (Pink): Morning and evening skincare rituals
- **Body** (Blue): Daily body care routines
- **Body Specifics** (Purple): High-priority targeted care (laser, etc.)
- **Hair** (Yellow): Wash days and maintenance

### Personal Inventory (Visual Catalog)
- **Wardrobe** (Orange): Gallery-style grid with occasion/color/vibe filtering
- **Jewellery** (Cyan): Organized collection with category filters

### Nutrition & Grocery
- **Breakfast** (Amber), **Lunch** (Emerald), **Dinner** (Dark Indigo): Meal templates
- **Grocery List** (Slate): Simple, efficient shopping list

### Physicality
- **Fitness** (Red): Workout library with weekly schedule and today's workout

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: TailwindCSS with custom LifeOS design system
- **State Management**: Zustand with localStorage persistence
- **Forms**: React Hook Form + Zod validation
- **Date Handling**: date-fns
- **Icons**: Lucide React

## Design Aesthetic

- **San Francisco Style**: Clean, minimalist high-contrast UI
- **Rounded Corners**: 2xl (1rem) throughout
- **Responsive Motion**: Slide and fade animations
- **Color-coded Categories**: Visual anchors for each life domain
- **White Space**: Generous spacing for premium feel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Navigate to the project folder
cd routines-wardrobe-app

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
routines-wardrobe-app/
├── app/
│   ├── layout.tsx              # Root layout with Sidebar
│   ├── page.tsx                # Today Dashboard (/)
│   ├── routines/
│   │   ├── skin/page.tsx       # Skin routines
│   │   ├── body/page.tsx       # Body routines
│   │   ├── body-specifics/page.tsx
│   │   └── hair/page.tsx       # Hair routines
│   ├── inventory/
│   │   ├── wardrobe/page.tsx   # Wardrobe catalog
│   │   └── jewellery/page.tsx  # Jewellery catalog
│   ├── nutrition/
│   │   ├── breakfast/page.tsx
│   │   ├── lunch/page.tsx
│   │   ├── dinner/page.tsx
│   │   └── grocery/page.tsx    # Grocery list
│   └── fitness/page.tsx        # Fitness & workouts
├── src/
│   ├── components/
│   │   ├── Sidebar.tsx         # Desktop sidebar + Mobile FAB
│   │   ├── TaskTile.tsx        # Checkable routine tiles
│   │   └── ui/                 # Base UI components
│   ├── data/seed.ts            # Default seed data
│   ├── lib/compute.ts          # Day plan computation
│   ├── store/useAppStore.ts    # Zustand store
│   └── types.ts                # TypeScript interfaces
└── package.json
```

## User Loop

1. **Morning**: Open the app to **Today**. Check off morning skincare and breakfast.
2. **Mid-day**: Check **Today** for Lunch template and workout schedule.
3. **Evening**: Check off PM skincare. Heed any conflict warnings.
4. **Weekly**: Use category tabs to update grocery list or manage inventory.

## Local Storage

All data persists in localStorage. The app includes:
- Automatic seed data initialization
- Export functionality (JSON backup)
- Reset to defaults option

## License

Personal use only.
