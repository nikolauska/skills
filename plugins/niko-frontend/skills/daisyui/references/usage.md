# daisyUI 5 usage rules

1. Use documented component, part, and modifier classes from the relevant component reference.
2. Prefer daisyUI modifiers, then Tailwind utilities, then minimal custom CSS.
3. Use Tailwind's trailing `!` important modifier only as a last resort after confirming a specificity conflict. Example: `bg-red-500!`.
4. If no daisyUI component fits, use semantic HTML and Tailwind utilities. Never invent daisyUI classes.
5. Follow the project's responsive patterns for flex, grid, visibility, sizing, and spacing.
6. Prefer the default component variant unless the request or existing design system calls for a color or style modifier.
7. Do not add fonts, remote placeholder assets, or global `bg-base-100 text-base-content` styles unless required.

Class categories used in the component references:
- `component`: the required component class
- `part`: a child part of a component
- `style`: sets a specific style to component or part
- `behavior`: changes the behavior of component or part
- `color`: sets a specific color to component or part
- `size`: sets a specific size to component or part
- `placement`: sets a specific placement to component or part
- `direction`: sets a specific direction to component or part
- `modifier`: modifies the component or part in a specific way
- `variant`: prefixes for utility classes that conditionally apply styles. syntax is `variant:utility-class`
