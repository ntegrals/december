# Dependency Management Examples

## When to Use This File
- User requests package installation or updates
- Library integration and setup
- Dependency conflicts or version issues
- Adding new functionality requiring external packages
- Package configuration and setup

## Example 1: Adding Dependencies with Integration

**User Message:**
Update the button component to use Tailwind's `bg-green-500` class instead of `bg-blue-500`, and refactor the button click handler to use a separate utility function that also leverages the `lodash` package, without changing any other functionality.

**AI Response:**
Let's implement the requested changes and refactor the code to use a separate utility function that also leverages the `lodash` package.

<dec-code>
To complete this update, we need to:
1. Modify the Button component in `src/components/Button.tsx` to change its color and use a new click handler.
2. Create a new utility file for the button click handling logic in `src/utils/buttonUtils.ts`.
3. Install and integrate the lodash package.

Let's start by updating the Button component:
<dec-write file_path="src/components/Button.tsx">
import React from 'react';
import { logButtonClick } from '../utils/buttonUtils';

const Button = ({ children }: { children: React.ReactNode }) => {
  const handleClick = () => {
    logButtonClick();
  };

  return (
    <button
      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export default Button;

</dec-write>

Now, let's create the new buttonUtils.ts file:
<dec-write file_path="src/utils/buttonUtils.ts">
import _ from 'lodash';

export const logButtonClick = () => {
  const message = _.upperFirst('button clicked');
  console.log(message);
};

</dec-write>

Next we need to add lodash as a dependency:
<dec-add-dependency>lodash@latest</dec-add-dependency>

Let's review our changes to ensure we've covered everything:
1. We updated Button.tsx to use the new bg-green-500 Tailwind class.
2. We created a new buttonUtils.ts file with the logButtonClick function.
3. We integrated lodash in the buttonUtils.ts file.
4. We updated the Button component to use the new logButtonClick function.
5. We added lodash as a project dependency.
6. No other files need to be modified for these changes.

All necessary files have been created or updated, and the new dependency has been added.
</dec-code>

These changes update the button's color to green, introduce a new utility function for click handling, and integrate lodash for enhanced functionality.

## Example 2: React Query Integration

**User Message:**
Add React Query to fetch user data and display it in a UserList component.

**AI Response:**
I'll add React Query for data fetching and create a UserList component that uses it to fetch and display user data.

<dec-code>
We need to:
1. Install React Query (already available in the project)
2. Set up the Query Client provider
3. Create a UserList component with data fetching
4. Create API functions for user data

First, let's update the layout to include the QueryClient provider:
<dec-write file_path="src/app/layout.tsx">
'use client';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}

</dec-write>

Now let's create the API functions:
<dec-write file_path="src/lib/api/users.ts">
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export const fetchUsers = async (): Promise<User[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor' },
  ];
};

export const fetchUser = async (id: number): Promise<User> => {
  const users = await fetchUsers();
  const user = users.find(u => u.id === id);
  if (!user) throw new Error('User not found');
  return user;
};

</dec-write>

Create the UserList component:
<dec-write file_path="src/components/UserList.tsx">
'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchUsers, User } from '@/lib/api/users';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const UserList: React.FC = () => {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-red-500">Error loading users</div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {users?.map((user: User) => (
        <Card key={user.id}>
          <CardHeader>
            <CardTitle>{user.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{user.email}</p>
            <p className="text-sm font-medium mt-2">{user.role}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UserList;

</dec-write>
</dec-code>

I've integrated React Query for data fetching and created a UserList component that displays user data with loading and error states.

## Example 3: TypeScript Types Package

**User Message:**
Add proper TypeScript types for our API responses and install the necessary type packages.

**AI Response:**
I'll add comprehensive TypeScript types and install the necessary type packages for better type safety.

<dec-code>
Let's install TypeScript types for our dependencies and create comprehensive type definitions:

<dec-add-dependency>@types/lodash@latest</dec-add-dependency>

Now let's create comprehensive type definitions:
<dec-write file_path="src/types/api.ts">
// Base API response structure
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

// Pagination types
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

// Error types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// Request types
export interface CreateRequest<T> {
  data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>;
}

export interface UpdateRequest<T> {
  id: string | number;
  data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>;
}

</dec-write>

<dec-write file_path="src/types/user.ts">
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  joinedAt: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'admin' | 'user' | 'editor' | 'viewer';

export interface CreateUserRequest {
  name: string;
  email: string;
  role: UserRole;
  department?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: UserRole;
  department?: string;
}

export interface UserFilters {
  role?: UserRole;
  department?: string;
  search?: string;
}

</dec-write>

<dec-write file_path="src/types/index.ts">
// Re-export all types for easy importing
export * from './api';
export * from './user';

// Common utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Form types
export interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  isValid: boolean;
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

</dec-write>
</dec-code>

I've added comprehensive TypeScript types for API responses, user data, and common utilities, plus installed the necessary type packages.

## Best Practices

- **Version Pinning**: Use specific versions for critical dependencies
- **Type Safety**: Always install @types packages for JavaScript libraries
- **Dependency Isolation**: Keep dependencies focused and minimal
- **Regular Updates**: Monitor and update dependencies regularly
- **Documentation**: Document why specific packages were chosen
- **Bundle Analysis**: Monitor bundle size impact of new dependencies
- **Security**: Regularly audit dependencies for vulnerabilities