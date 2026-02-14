# Editorial Sidequest Archive

A high-end, editorial-style archive page for tracking personal development quests with a premium digital magazine aesthetic.

## 🎨 Design System

### Color Palette
- **Background**: `#F9F5F0` (Warm Cream)
- **Primary Accent**: `#8A2424` (Deep Burgundy)
- **Primary Text**: `#4A2C2A` (Coffee Brown)
- **Secondary Accent**: `#EBDCCB` (Soft Beige)

### Typography
- **Headers**: Playfair Display (Serif) - Regular & Italic variants
- **Body/UI**: Inter (Sans-Serif) - Light weights with wide tracking

## 📦 Features Implemented

### 1. Hero Header Component
- Large, bold typography with "Side" in standard serif
- "Quests" in italic burgundy with significant left indent
- Max-width explanatory paragraph in light sans-serif
- Responsive sizing (7xl mobile, 9xl desktop)

### 2. Editorial Grid System
- Responsive grid layout:
  - 1 column on mobile
  - 2 columns on tablet (md breakpoint)
  - 3 columns on desktop (lg breakpoint)
- Generous spacing (gap-x-12, gap-y-16)

### 3. Quest Cards
Each card includes:
- **Media Slot**: 4:5 aspect ratio with gradient background
- **Hover Effects**: 
  - Dark overlay fades out on hover
  - Arrow icon slides in next to title
  - Completion checkmark animates in
- **Category Badge**: Rounded pill in top-left corner
- **Success Indicator**: Burgundy circle with checkmark (completed items only)
- **XP Display**: Bold burgundy text showing rewards earned
- **Staggered Animation**: Cards fade in with 50ms delay between each

### 4. Modal System
Full-featured quest detail modal with:

#### Layout
- Two-column responsive layout (single column on mobile)
- Left column: Full-height media display
- Right column: Scrollable quest details

#### Features
- **Backdrop**: Semi-transparent burgundy with heavy blur
- **Animations**: 
  - Fade and slide entry/exit
  - Rotating close button on hover
- **Content Sections**:
  - Entry ID label
  - Large italic title
  - Category and difficulty badges
  - Long-form quest log description
  - XP reward display
  - Return to archive button
- **Scroll Prevention**: Background scrolling disabled when modal active
- **Custom Scrollbar**: Burgundy themed scrollbar in modal

### 5. Polish & Details
- **Fixed Watermark**: Vertical "DIGITAL TWIN // 2026" text on bottom-left
- **Smooth Animations**: Framer Motion for all interactions
- **Responsive Design**: Mobile-first approach with breakpoints
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Performance**: Optimized re-renders with React hooks

## 🛠 Technical Stack

### Dependencies
- **Next.js 14**: React framework with App Router
- **Framer Motion**: Animation library for smooth transitions
- **Lucide React**: Icon library (ArrowUpRight, X, CheckCircle2)
- **Tailwind CSS**: Utility-first styling
- **TypeScript**: Type safety for quest data structure

### File Structure
```
app/
  archive/
    page.tsx          # Main archive page with all components
src/
  data/
    sidequests.ts     # Quest data and TypeScript interfaces
app/
  globals.css         # Editorial styles and animations
```

## 📝 Data Structure

```typescript
interface Sidequest {
  id: string;
  entryId: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  xp: number;
  completed: boolean;
  imageUrl: string;
  questLog: string;
}
```

## 🎯 Quest Categories

Nine curated quests across different life domains:
1. **Style** - Minimalist styling & jewelry curation
2. **Wellness** - Morning rituals & movement practices
3. **Mindfulness** - Digital detox challenges
4. **Beauty** - Signature scent discovery
5. **Nutrition** - Culinary self-sufficiency
6. **Connection** - Letter writing
7. **Fitness** - Movement as medicine
8. **Space** - Reading nook design

## 🚀 Usage

Navigate to `/archive` to view the Sidequest Archive. Click any quest card to open the detailed modal view.

### Customization

To add new quests, edit the `sidequests` array in [src/data/sidequests.ts](src/data/sidequests.ts):

```typescript
{
  id: '010',
  entryId: 'SQ-010',
  title: 'Your Quest Title',
  description: 'Short description (2 lines max)',
  category: 'Category Name',
  difficulty: 'Medium',
  xp: 200,
  completed: false,
  imageUrl: '/images/quest-image.jpg',
  questLog: 'Detailed quest description...',
}
```

## 🎨 Styling Guidelines

### Custom Classes Added
- `.editorial-backdrop` - Backdrop blur effect
- `.editorial-text` - Optimized text rendering
- `.line-clamp-2` - Two-line text truncation
- `.modal-scroll` - Custom modal scrollbar

### Font Variables
- `--font-playfair` - Serif headings
- `--font-inter` - Sans-serif body text

### Responsive Breakpoints
- Mobile: `< 768px` - Single column layout
- Tablet: `768px - 1024px` - Two column grid
- Desktop: `> 1024px` - Three column grid, larger typography

## ⚡ Performance Notes

- Images use gradient placeholders (update with real images as needed)
- Animations are GPU-accelerated via transforms
- Modal prevents background scroll for better UX
- Staggered animations create engaging load sequence

## 🔮 Future Enhancements

Potential improvements:
- [ ] Add real images for each quest
- [ ] Implement quest completion tracking with backend
- [ ] Add filtering by category/status
- [ ] Include search functionality
- [ ] Add quest completion animations
- [ ] Integrate with user progress tracking
- [ ] Add sharing functionality for completed quests
- [ ] Implement quest recommendations based on completion

## 📄 License

Part of the Soumitri Digital Twin project.
