# Project Structure and File Permissions

## Current Project Structure

```
/
├── README.md
├── tsconfig.json
├── next.config.ts
├── src/
│   ├── app/
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── components/
│       └── ui/
│           ├── accordion.tsx
│           ├── alert-dialog.tsx
│           ├── alert.tsx
│           ├── aspect-ratio.tsx
│           ├── avatar.tsx
│           ├── badge.tsx
│           ├── breadcrumb.tsx
│           ├── button.tsx
│           ├── calendar.tsx
│           ├── card.tsx
│           ├── carousel.tsx
│           ├── chart.tsx
│           ├── checkbox.tsx
│           ├── collapsible.tsx
│           ├── command.tsx
│           ├── context-menu.tsx
│           ├── dialog.tsx
│           ├── drawer.tsx
│           ├── dropdown-menu.tsx
│           ├── form.tsx
│           ├── hover-card.tsx
│           ├── input-otp.tsx
│           ├── input.tsx
│           ├── label.tsx
│           ├── menubar.tsx
│           ├── navigation-menu.tsx
│           ├── pagination.tsx
│           ├── popover.tsx
│           ├── progress.tsx
│           ├── radio-group.tsx
│           ├── resizable.tsx
│           ├── scroll-area.tsx
│           ├── select.tsx
│           ├── separator.tsx
│           ├── sheet.tsx
│           ├── sidebar.tsx
│           ├── skeleton.tsx
│           ├── slider.tsx
│           ├── sonner.tsx
│           ├── switch.tsx
│           ├── table.tsx
│           ├── tabs.tsx
│           ├── textarea.tsx
│           ├── toast.tsx
│           ├── toaster.tsx
│           ├── toggle-group.tsx
│           ├── toggle.tsx
│           ├── tooltip.tsx
│           └── use-toast.ts
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── package.json
├── package-lock.json
├── bun.lock
├── postcss.config.js
├── components.json
├── tsconfig.app.json
├── tsconfig.node.json
└── .gitignore
```

## File Permissions

### ✅ Allowed Files (Can Modify)

#### Configuration Files
- **README.md** - Project documentation
- **tsconfig.json** - TypeScript configuration
- **next.config.ts** - Next.js configuration

#### Source Code
- **src/app/page.tsx** - Main page component
- **src/app/layout.tsx** - Root layout component
- **src/app/globals.css** - Global styles
- **Any new files in src/** - All custom source code

#### Recommended Directory Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Route groups
│   ├── api/               # API routes
│   ├── blog/              # Blog pages
│   └── dashboard/         # Dashboard pages
├── components/            # Reusable components
│   ├── ui/                # Shadcn/UI components (read-only)
│   ├── forms/             # Form components
│   ├── layout/            # Layout components
│   └── features/          # Feature-specific components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
│   ├── api/               # API functions
│   ├── auth/              # Authentication utilities
│   └── utils.ts           # General utilities
├── types/                 # TypeScript type definitions
├── styles/                # Additional stylesheets
└── constants/             # Application constants
```

### ❌ Forbidden Files (Cannot Modify)

#### Package Management
- **package.json** - Use `<dec-add-dependency>` instead
- **package-lock.json** - Auto-generated
- **bun.lock** - Auto-generated

#### Build Configuration
- **postcss.config.js** - PostCSS configuration
- **components.json** - Shadcn/UI configuration
- **tsconfig.app.json** - App-specific TypeScript config
- **tsconfig.node.json** - Node-specific TypeScript config

#### Version Control
- **.gitignore** - Git ignore rules

#### Public Assets (Existing)
- **public/file.svg**
- **public/globe.svg**
- **public/next.svg**
- **public/vercel.svg**
- **public/window.svg**

#### Shadcn/UI Components (Read-Only)
All files in `src/components/ui/` are managed by Shadcn/UI and should not be modified:
- accordion.tsx, alert-dialog.tsx, alert.tsx, aspect-ratio.tsx
- avatar.tsx, badge.tsx, breadcrumb.tsx, button.tsx
- calendar.tsx, card.tsx, carousel.tsx, chart.tsx
- checkbox.tsx, collapsible.tsx, command.tsx, context-menu.tsx
- dialog.tsx, drawer.tsx, dropdown-menu.tsx, form.tsx
- hover-card.tsx, input-otp.tsx, input.tsx, label.tsx
- menubar.tsx, navigation-menu.tsx, pagination.tsx, popover.tsx
- progress.tsx, radio-group.tsx, resizable.tsx, scroll-area.tsx
- select.tsx, separator.tsx, sheet.tsx, sidebar.tsx
- skeleton.tsx, slider.tsx, sonner.tsx, switch.tsx
- table.tsx, tabs.tsx, textarea.tsx, toast.tsx
- toaster.tsx, toggle-group.tsx, toggle.tsx, tooltip.tsx
- use-toast.ts

#### App-Specific Files (Existing)
- **src/app/favicon.ico** - Favicon file

## File Organization Best Practices

### Component Organization
```
src/components/
├── ui/                    # Shadcn/UI components (don't modify)
├── forms/                 # Form-related components
│   ├── ContactForm.tsx
│   ├── LoginForm.tsx
│   └── index.ts
├── layout/                # Layout components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Sidebar.tsx
│   └── index.ts
├── features/              # Feature-specific components
│   ├── auth/
│   ├── dashboard/
│   └── blog/
└── common/                # Shared components
    ├── LoadingSpinner.tsx
    ├── ErrorBoundary.tsx
    └── index.ts
```

### Hook Organization
```
src/hooks/
├── useAuth.ts             # Authentication hook
├── useLocalStorage.ts     # Local storage hook
├── useDebounce.ts         # Debounce hook
├── api/                   # API-related hooks
│   ├── useUsers.ts
│   ├── usePosts.ts
│   └── index.ts
└── index.ts               # Re-export all hooks
```

### Utility Organization
```
src/lib/
├── utils.ts               # General utilities
├── constants.ts           # Application constants
├── api/                   # API functions
│   ├── client.ts          # API client setup
│   ├── users.ts           # User API functions
│   └── posts.ts           # Post API functions
├── auth/                  # Authentication utilities
│   ├── config.ts
│   └── providers.ts
└── validations/           # Zod schemas
    ├── user.ts
    └── post.ts
```

### Type Organization
```
src/types/
├── index.ts               # Common types
├── api.ts                 # API response types
├── user.ts                # User-related types
├── post.ts                # Post-related types
└── components.ts          # Component prop types
```

## File Naming Conventions

### Components
- **PascalCase** for component files: `UserProfile.tsx`
- **camelCase** for utility files: `formatDate.ts`
- **kebab-case** for page routes: `user-profile/page.tsx`

### Directories
- **camelCase** for feature directories: `userManagement/`
- **kebab-case** for route directories: `user-profile/`
- **lowercase** for utility directories: `utils/`, `hooks/`, `types/`

### Files
- **Components**: `ComponentName.tsx`
- **Hooks**: `useHookName.ts`
- **Utilities**: `utilityName.ts`
- **Types**: `typeName.ts`
- **Constants**: `CONSTANT_NAME.ts`

## Import Path Guidelines

### Use Path Aliases
```tsx
// ✅ Correct - use @ alias
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { User } from '@/types/user';

// ❌ Wrong - relative paths
import { Button } from '../../../components/ui/button';
```

### Import Organization
```tsx
// 1. React and Next.js imports
import React from 'react';
import Link from 'next/link';

// 2. Third-party library imports
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

// 3. Internal imports (components, hooks, utils)
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/lib/utils';

// 4. Type imports (at the end)
import type { User } from '@/types/user';
```

## File Size Guidelines

### Maximum File Sizes
- **Components**: 500 lines maximum
- **Hooks**: 200 lines maximum
- **Utilities**: 300 lines maximum
- **API functions**: 400 lines maximum

### When to Split Files
- **Components > 50 lines**: Consider extracting sub-components
- **Hooks > 10 lines**: Move to separate hook file
- **Utilities > 15 lines**: Create dedicated utility file
- **Types > 5 definitions**: Create separate type file

## Special Considerations

### Next.js App Router
- Use `page.tsx` for route pages
- Use `layout.tsx` for shared layouts
- Use `loading.tsx` for loading UI
- Use `error.tsx` for error boundaries
- Use `not-found.tsx` for 404 pages

### Public Directory
- Add new assets to `public/` directory
- Reference with absolute paths: `/images/logo.png`
- Optimize images for web use

### Environment Files
- Create `.env.local` for local environment variables
- Use `.env.example` for environment variable templates
- Never commit sensitive environment variables

## Migration Notes

When moving from the current structure to a more organized one:

1. **Create new directories** as needed
2. **Move files gradually** to avoid breaking imports
3. **Update import statements** when moving files
4. **Use index files** for clean re-exports
5. **Test thoroughly** after restructuring