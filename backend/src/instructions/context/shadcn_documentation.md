# Shadcn/UI Documentation

## Overview

Shadcn/UI is a collection of reusable components built using Radix UI and Tailwind CSS. Components are copy-and-paste friendly and fully customizable.

## Available Components

The following shadcn/ui components are already installed and available:

### Layout Components
- **Accordion** - `@/components/ui/accordion`
- **Card** - `@/components/ui/card`
- **Separator** - `@/components/ui/separator`
- **Tabs** - `@/components/ui/tabs`
- **Sidebar** - `@/components/ui/sidebar`

### Form Components
- **Button** - `@/components/ui/button`
- **Input** - `@/components/ui/input`
- **Label** - `@/components/ui/label`
- **Textarea** - `@/components/ui/textarea`
- **Checkbox** - `@/components/ui/checkbox`
- **Radio Group** - `@/components/ui/radio-group`
- **Select** - `@/components/ui/select`
- **Switch** - `@/components/ui/switch`
- **Slider** - `@/components/ui/slider`
- **Form** - `@/components/ui/form`

### Feedback Components
- **Alert** - `@/components/ui/alert`
- **Alert Dialog** - `@/components/ui/alert-dialog`
- **Toast** - `@/components/ui/toast`
- **Toaster** - `@/components/ui/toaster`
- **Progress** - `@/components/ui/progress`
- **Skeleton** - `@/components/ui/skeleton`

### Navigation Components
- **Breadcrumb** - `@/components/ui/breadcrumb`
- **Navigation Menu** - `@/components/ui/navigation-menu`
- **Pagination** - `@/components/ui/pagination`
- **Menubar** - `@/components/ui/menubar`

### Overlay Components
- **Dialog** - `@/components/ui/dialog`
- **Drawer** - `@/components/ui/drawer`
- **Popover** - `@/components/ui/popover`
- **Sheet** - `@/components/ui/sheet`
- **Tooltip** - `@/components/ui/tooltip`
- **Hover Card** - `@/components/ui/hover-card`
- **Context Menu** - `@/components/ui/context-menu`
- **Dropdown Menu** - `@/components/ui/dropdown-menu`

### Data Display Components
- **Avatar** - `@/components/ui/avatar`
- **Badge** - `@/components/ui/badge`
- **Table** - `@/components/ui/table`
- **Calendar** - `@/components/ui/calendar`
- **Chart** - `@/components/ui/chart`
- **Carousel** - `@/components/ui/carousel`

### Utility Components
- **Aspect Ratio** - `@/components/ui/aspect-ratio`
- **Collapsible** - `@/components/ui/collapsible`
- **Resizable** - `@/components/ui/resizable`
- **Scroll Area** - `@/components/ui/scroll-area`
- **Toggle** - `@/components/ui/toggle`
- **Toggle Group** - `@/components/ui/toggle-group`

## Usage Examples

### Basic Button Usage
```tsx
import { Button } from "@/components/ui/button"

<Button variant="default">Click me</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
```

### Card Component
```tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <p>Card Footer</p>
  </CardFooter>
</Card>
```

### Form Components
```tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

<div className="grid w-full max-w-sm items-center gap-1.5">
  <Label htmlFor="email">Email</Label>
  <Input type="email" id="email" placeholder="Email" />
</div>
```

### Dialog Component
```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">Edit Profile</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Edit profile</DialogTitle>
      <DialogDescription>
        Make changes to your profile here. Click save when you're done.
      </DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      {/* Form content */}
    </div>
  </DialogContent>
</Dialog>
```

### Select Component
```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select a fruit" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="banana">Banana</SelectItem>
    <SelectItem value="blueberry">Blueberry</SelectItem>
  </SelectContent>
</Select>
```

### Toast Usage
```tsx
import { toast } from "sonner"

// Success toast
toast.success("Event has been created")

// Error toast
toast.error("Something went wrong")

// Info toast
toast("Event has been created")

// Custom toast
toast("Event has been created", {
  description: "Sunday, December 03, 2023 at 9:00 AM",
  action: {
    label: "Undo",
    onClick: () => console.log("Undo"),
  },
})
```

### Sidebar Usage
```tsx
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
```

### Complete Sidebar Implementation
```tsx
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
```

## Important Notes

1. **Import Paths**: Always use `@/components/ui/[component-name]` for imports
2. **Customization**: Components can be customized by modifying the source files in `src/components/ui/`
3. **Variants**: Most components support multiple variants (e.g., Button has default, destructive, outline, etc.)
4. **Accessibility**: All components are built with accessibility in mind using Radix UI primitives
5. **TypeScript**: Full TypeScript support with proper type definitions
6. **Responsive**: Components work well across all screen sizes
7. **Dark Mode**: Components support dark mode when using next-themes

## Best Practices

- Use semantic HTML elements when possible
- Always provide proper labels for form elements
- Use appropriate ARIA attributes for accessibility
- Combine components to create more complex UI patterns
- Leverage Tailwind CSS classes for additional styling
- Use the `asChild` prop when you need to change the underlying element