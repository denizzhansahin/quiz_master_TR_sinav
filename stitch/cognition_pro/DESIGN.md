# Design System Document

## 1. Overview & Creative North Star: "The Cognitive Sanctuary"
This design system is engineered to transform the high-pressure environment of exam preparation into a "Cognitive Sanctuary." To move beyond the sterile, generic look of standard educational apps, we employ a philosophy of **Atmospheric Clarity**. 

The "North Star" of this system is to eliminate all visual friction. We achieve this not through rigid grids and borders, but through **Tonal Sculpting**. By using intentional asymmetry in layout and overlapping layered surfaces, we create a sense of focus that feels premium, editorial, and sophisticated. We treat white space not as "empty" space, but as a functional component that allows the brain to process information without distraction.

---

## 2. Colors
Our palette is rooted in a "Motivating Blue" that inspires confidence, balanced by high-utility success and error tones.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to define sections. Boundaries must be established through background color shifts. For instance, a `surface-container-low` section should sit directly against a `surface` background to create a soft, sophisticated transition.

### Surface Hierarchy & Nesting
We treat the UI as a physical stack of fine, semi-translucent paper.
*   **Base:** `surface` (#f9f9ff)
*   **Sectioning:** `surface-container-low` (#f2f3fd) or `surface-container` (#ecedf7)
*   **Interactive Focus:** `surface-container-lowest` (#ffffff) for primary cards to create a "pop" against the background.

### The "Glass & Gradient" Rule
To avoid a "flat" template feel, use **Glassmorphism** for floating headers or navigation bars. Apply a `surface` color at 80% opacity with a `20px` backdrop-blur. 
*   **Signature Texture:** Main CTAs and progress indicators should use a subtle linear gradient transitioning from `primary` (#0058be) to `primary-container` (#2170e4) at a 135-degree angle. This adds "soul" and depth to the UI.

---

## 3. Typography
We utilize a dual-typeface system to create an editorial hierarchy that distinguishes between "Information" and "Action."

*   **Display & Headlines (Manrope):** Chosen for its geometric modernism. Large scales (`display-lg` at 3.5rem) should be used with tight letter-spacing (-0.02em) to create an authoritative, "book-like" feel for subject titles.
*   **Body & Labels (Inter):** The workhorse for readability. Use `body-lg` (1rem) for exam questions. Its high x-height ensures clarity during long study sessions.
*   **Hierarchy Note:** Use `on-surface-variant` (#424754) for secondary metadata to ensure the primary question text (`on-surface`) commands the user’s full attention.

---

## 4. Elevation & Depth
In this system, depth is a tool for focus, not just decoration.

*   **The Layering Principle:** Avoid shadows for static elements. Instead, nest `surface-container-highest` within `surface-container-low` to create a natural inset look.
*   **Ambient Shadows:** For "floating" elements like active exam cards, use an extra-diffused shadow: `box-shadow: 0 20px 40px rgba(25, 27, 35, 0.06)`. Note the low 6% opacity and the tint derived from the `on-surface` color.
*   **The "Ghost Border":** If a separator is required for accessibility, use the `outline-variant` (#c2c6d6) at **15% opacity**. Never use 100% opaque lines.
*   **Interaction Depth:** When a card is pressed, transition the background from `surface-container-lowest` to `surface-primary-fixed` to provide tactile, tonal feedback.

---

## 5. Components

### Cards & Question Blocks
Forbid the use of divider lines. Separate "Question" from "Explanation" using a vertical spacing shift of `8` (2.75rem) or by placing the explanation inside a `secondary-container` box with `md` (12px) roundedness.

### The "Active-State" Radio Button
Moving away from standard circles, our radio buttons are large, touch-friendly tiles.
*   **Unselected:** `surface-container-high` background, no border.
*   **Selected:** `primary` background with `on-primary` text. Use a subtle `xl` (1.5rem) corner radius for the selection indicator to make it feel organic.

### Progress Indicators
Progress bars should never be thin lines. Use a height of `spacing-2.5` (0.85rem) with `full` rounding. The track should be `surface-container-highest` and the fill should be our signature `primary` gradient.

### Input Fields
Avoid "box" inputs. Use a "Soft-Well" approach: a `surface-container-low` background with a bottom-only `primary` accent line (2px) that appears only on focus.

### Buttons
*   **Primary:** Gradient-filled, `md` (12px) rounding, `label-md` uppercase typography with 0.05em tracking for a premium feel.
*   **Tertiary:** No background, no border. Use `primary` text color with an icon.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use asymmetrical margins (e.g., more padding on the left than the right in headers) to create a custom, editorial layout.
*   **Do** leverage the `surface-container` tiers to create hierarchy. If it’s important, it’s on the "highest" (whitest) surface.
*   **Do** use the `lg` (1rem) and `xl` (1.5rem) corner radii for large cards to maintain the "soft" sanctuary feel.

### Don't:
*   **Don't** use black (#000000) for text. Always use `on-surface` (#191b23) to reduce eye strain.
*   **Don't** use 1px dividers between list items. Use `spacing-4` (1.4rem) of whitespace instead.
*   **Don't** use high-saturation reds for error states unless critical. Use `error_container` for background warnings to keep the environment calm.