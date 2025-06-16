# Package Information

## Currently Installed Packages

### Core Dependencies
- **next**: 15.3.3 - React framework with App Router
- **react**: ^19.0.0 - React library
- **react-dom**: ^19.0.0 - React DOM renderer
- **typescript**: ^5 - TypeScript language

### UI and Styling
- **tailwindcss**: ^4 - Utility-first CSS framework
- **@tailwindcss/postcss**: ^4 - PostCSS plugin for Tailwind
- **tailwind-merge**: ^3.3.0 - Utility for merging Tailwind classes
- **class-variance-authority**: ^0.7.1 - CVA for component variants
- **clsx**: ^2.1.1 - Utility for constructing className strings
- **tw-animate-css**: ^1.3.4 - Animation utilities for Tailwind

### Shadcn/UI Components
- **@radix-ui/react-accordion**: ^1.2.11
- **@radix-ui/react-alert-dialog**: ^1.1.14
- **@radix-ui/react-aspect-ratio**: ^1.1.7
- **@radix-ui/react-avatar**: ^1.1.10
- **@radix-ui/react-checkbox**: ^1.3.2
- **@radix-ui/react-collapsible**: ^1.1.11
- **@radix-ui/react-context-menu**: ^2.2.15
- **@radix-ui/react-dialog**: ^1.1.14
- **@radix-ui/react-dropdown-menu**: ^2.1.15
- **@radix-ui/react-hover-card**: ^1.1.14
- **@radix-ui/react-label**: ^2.1.7
- **@radix-ui/react-menubar**: ^1.1.15
- **@radix-ui/react-navigation-menu**: ^1.2.13
- **@radix-ui/react-popover**: ^1.1.14
- **@radix-ui/react-progress**: ^1.1.7
- **@radix-ui/react-radio-group**: ^1.3.7
- **@radix-ui/react-scroll-area**: ^1.2.9
- **@radix-ui/react-select**: ^2.2.5
- **@radix-ui/react-separator**: ^1.1.7
- **@radix-ui/react-slider**: ^1.3.5
- **@radix-ui/react-slot**: ^1.2.3
- **@radix-ui/react-switch**: ^1.2.5
- **@radix-ui/react-tabs**: ^1.1.12
- **@radix-ui/react-toast**: ^1.2.14
- **@radix-ui/react-toggle**: ^1.1.9
- **@radix-ui/react-toggle-group**: ^1.1.10
- **@radix-ui/react-tooltip**: ^1.2.7

### Icons and Graphics
- **lucide-react**: ^0.513.0 - Beautiful & consistent icon toolkit

### Data Fetching and State Management
- **@tanstack/react-query**: ^5.80.6 - Powerful data synchronization for React
- **@tanstack/react-table**: ^8.21.3 - Headless UI for building tables

### Form Handling
- **react-hook-form**: ^7.57.0 - Performant, flexible forms
- **@hookform/resolvers**: ^5.0.1 - Validation resolvers for react-hook-form
- **zod**: ^3.25.55 - TypeScript-first schema validation

### Date and Time
- **date-fns**: ^4.1.0 - Modern JavaScript date utility library
- **react-day-picker**: 8.10.1 - Date picker component

### UI Enhancements
- **sonner**: ^2.0.5 - Toast notifications
- **next-themes**: ^0.4.6 - Theme switching for Next.js
- **embla-carousel-react**: ^8.6.0 - Carousel component
- **react-resizable-panels**: ^3.0.2 - Resizable panel layouts
- **vaul**: ^1.1.2 - Drawer component
- **input-otp**: ^1.4.2 - OTP input component

### Charts and Data Visualization
- **recharts**: ^2.15.3 - Composable charting library

### Utilities
- **cmdk**: ^1.1.1 - Command palette component

### Development Dependencies
- **@types/node**: ^20 - TypeScript definitions for Node.js
- **@types/react**: ^19 - TypeScript definitions for React
- **@types/react-dom**: ^19 - TypeScript definitions for React DOM

## Package Usage Guidelines

### Installing New Packages
Use the `<dec-add-dependency>` command to install packages:
```
<dec-add-dependency>package-name@version</dec-add-dependency>
```

### Recommended Packages for Common Use Cases

#### Authentication
- **next-auth**: Authentication for Next.js
- **@auth/prisma-adapter**: Prisma adapter for NextAuth
- **jose**: JSON Web Token utilities

#### Database
- **prisma**: Next-generation ORM
- **@prisma/client**: Prisma client
- **drizzle-orm**: TypeScript ORM

#### Validation
- **zod**: Already installed - TypeScript-first schema validation
- **yup**: Alternative schema validation library

#### HTTP Client
- **axios**: Promise-based HTTP client
- **ky**: Tiny HTTP client based on Fetch API

#### Utilities
- **lodash**: Utility library (use sparingly)
- **ramda**: Functional programming utilities
- **uuid**: UUID generation

#### Testing
- **@testing-library/react**: React testing utilities
- **@testing-library/jest-dom**: Jest DOM matchers
- **vitest**: Fast unit test framework

#### Development Tools
- **eslint**: Code linting (configure for React/Next.js)
- **prettier**: Code formatting
- **husky**: Git hooks

## Version Compatibility Notes

### React 19 Compatibility
- All Radix UI components are compatible with React 19
- React Query v5 supports React 19
- Next.js 15.3.3 has full React 19 support

### Next.js 15 Features
- Stable App Router
- Server Components by default
- Improved performance
- Enhanced TypeScript support

### Tailwind CSS 4
- New engine with better performance
- Improved IntelliSense
- Better CSS-in-JS support

## Common Package Combinations

### Form with Validation
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
```

### Data Fetching with React Query
```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
```

### Date Handling
```tsx
import { format, parseISO } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
```

### Icons
```tsx
import { Home, User, Settings } from 'lucide-react';
```

### Toast Notifications
```tsx
import { toast } from 'sonner';
```

### Theme Switching
```tsx
import { useTheme } from 'next-themes';
```

## Package Restrictions

### Cannot Modify
- **package.json**: Cannot be edited directly
- **package-lock.json**: Auto-generated, do not modify
- **bun.lock**: Auto-generated, do not modify

### Installation Only
- Use `<dec-add-dependency>` to add packages
- Cannot remove packages through commands
- Cannot modify package versions directly

## Best Practices

### Bundle Size Considerations
- Import only what you need from large libraries
- Use tree-shaking friendly imports
- Consider package size impact on build

### Version Management
- Keep dependencies up to date
- Test compatibility when updating major versions
- Use exact versions for critical dependencies

### TypeScript Support
- Prefer packages with built-in TypeScript support
- Install @types packages for JavaScript libraries
- Check DefinitelyTyped for type definitions

### Performance
- Use React Query for server state
- Implement proper caching strategies
- Consider code splitting for large dependencies

### Security
- Regularly audit dependencies for vulnerabilities
- Use npm audit or similar tools
- Keep security-critical packages updated