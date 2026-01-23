# Design System - Pastel Color Palette

## Color Palette

### Primary Colors

| Color Name | HSL Value | Hex Value | Usage |
|------------|-----------|-----------|-------|
| **Periwinkle** | `hsl(232, 76%, 74%)` | `#9BA8E5` | Primary buttons, active states, main brand color |
| **Lime** | `hsl(72, 68%, 80%)` | `#E2EDA3` | Highlights, special accents |
| **Navy** | `hsl(231, 44%, 28%)` | `#2A3362` | Text color, dark backgrounds |
| **Pink** | `hsl(307, 58%, 85%)` | `#F0B8E8` | Feature highlights, special elements |
| **Sky Blue** | `hsl(210, 100%, 90%)` | `#CCE5FF` | Secondary elements, page banners, backgrounds |
| **Lavender** | `hsl(252, 76%, 80%)` | `#B8A8F0` | Accent elements, hover states |

### Color Swatches

```
Periwinkle: ████████ #9BA8E5
Lime:       ████████ #E2EDA3
Navy:       ████████ #2A3362
Pink:       ████████ #F0B8E8
Sky Blue:   ████████ #CCE5FF
Lavender:   ████████ #B8A8F0
```

## CSS Variables

### Light Mode
```css
:root {
  /* Palette Colors */
  --periwinkle: 232 76% 74%;      /* #9BA8E5 */
  --lime: 72 68% 80%;              /* #E2EDA3 */
  --navy: 231 44% 28%;             /* #2A3362 */
  --pink: 307 58% 85%;             /* #F0B8E8 */
  --sky: 210 100% 90%;             /* #CCE5FF */
  --lavender: 252 76% 80%;         /* #B8A8F0 */
  
  /* Semantic Colors */
  --background: 0 0% 100%;
  --foreground: 231 44% 28%;       /* Navy for text */
  --primary: 232 76% 74%;          /* Periwinkle */
  --secondary: 210 100% 90%;       /* Sky blue */
  --accent: 252 76% 80%;           /* Lavender */
  --highlight: 72 68% 80%;         /* Lime */
  --feature: 307 58% 85%;          /* Pink */
}
```

### Dark Mode
```css
.dark {
  --background: 231 44% 12%;       /* Dark navy */
  --foreground: 210 100% 92%;      /* Light sky blue text */
  --primary: 232 76% 74%;          /* Periwinkle stays */
  --secondary: 231 44% 25%;
  --accent: 252 76% 75%;           /* Lavender stays */
  --highlight: 72 68% 75%;         /* Lime stays */
  --feature: 307 58% 75%;          /* Pink stays */
}
```

## Usage Examples

### Tailwind Classes
```jsx
// Periwinkle
className="bg-[hsl(232,76%,74%)] text-[hsl(231,44%,28%)]"

// Sky Blue
className="bg-[hsl(210,100%,90%)] text-[hsl(231,44%,28%)]"

// Pink
className="bg-[hsl(307,58%,85%)] text-[hsl(231,44%,28%)]"

// Lavender
className="bg-[hsl(252,76%,80%)] text-[hsl(231,44%,28%)]"

// Lime
className="bg-[hsl(72,68%,80%)] text-[hsl(231,44%,28%)]"
```

### CSS Custom Properties
```css
/* Using the variables */
.button {
  background: hsl(var(--primary));
  color: hsl(var(--foreground));
}

.banner {
  background: hsl(var(--sky));
}

.accent-element {
  background: hsl(var(--lavender));
}
```

## Color Combinations

### Recommended Pairings

| Background | Text Color | Usage |
|------------|------------|-------|
| Sky Blue | Navy | Page banners, light backgrounds |
| Periwinkle | Navy | Primary buttons, active states |
| Lavender | Navy | Secondary buttons, hover states |
| Pink | Navy | Feature highlights, special elements |
| Lime | Navy | Highlights, attention-grabbing elements |
| Navy | Sky Blue | Dark mode text |
| White | Navy | Default light mode |

## Accessibility

All color combinations meet **WCAG AA** standards for contrast:
- Navy text on light backgrounds: ✅ AAA
- Navy text on pastel backgrounds: ✅ AA
- White text on Navy: ✅ AAA

## Category Colors

Each category has its own color assignment:

| Category | Color | HSL |
|----------|-------|-----|
| All | Sky Blue | `hsl(210,100%,90%)` |
| Wood | Periwinkle | `hsl(232,76%,74%)` |
| Bag | Lavender | `hsl(252,76%,80%)` |
| Pet | Pink | `hsl(307,58%,85%)` |
| Photo Frame | Lime | `hsl(72,68%,80%)` |
| Decor | Sky Blue | `hsl(210,100%,90%)` |
| Bouquet | Pink | `hsl(307,58%,85%)` |
| Food | Lime | `hsl(72,68%,80%)` |
| Home | Periwinkle | `hsl(232,76%,74%)` |

---

**Last Updated:** January 2026
