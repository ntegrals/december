# Next.js Examples

## When to Use This File
- User requests Next.js project creation, routing, or API routes
- Next.js-specific features like SSR, SSG, or ISR
- App Router implementation and file-based routing
- Server components and client components
- Next.js optimization features

## Example 1: App Router with Dynamic Routes

**User Message:**
Create a blog application with dynamic routes for posts and categories using the Next.js App Router.

**AI Response:**
I'll create a comprehensive blog application using Next.js App Router with dynamic routes, server components, and proper SEO optimization.

<dec-write file_path="src/app/blog/page.tsx">
import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  category: string;
  slug: string;
  readTime: number;
}

const getBlogPosts = async (): Promise<BlogPost[]> => {
  return [
    {
      id: '1',
      title: 'Getting Started with Next.js App Router',
      excerpt: 'Learn how to build modern web applications with the new Next.js App Router.',
      author: 'John Doe',
      publishedAt: '2024-03-15',
      category: 'Development',
      slug: 'getting-started-nextjs-app-router',
      readTime: 5,
    },
    {
      id: '2',
      title: 'TypeScript Best Practices for React',
      excerpt: 'Discover essential TypeScript patterns for building robust React applications.',
      author: 'Jane Smith',
      publishedAt: '2024-03-10',
      category: 'TypeScript',
      slug: 'typescript-best-practices-react',
      readTime: 8,
    },
  ];
};

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const categories = [...new Set(posts.map(post => post.category))];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Our Blog</h1>
      
      <div className="flex gap-2 mb-8">
        {categories.map((category) => (
          <Link key={category} href={`/blog/category/${category.toLowerCase()}`}>
            <Badge variant="outline" className="hover:bg-gray-100 cursor-pointer">
              {category}
            </Badge>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Badge variant="secondary" className="w-fit">{post.category}</Badge>
              <CardTitle>
                <Link href={`/blog/${post.slug}`} className="hover:text-blue-600">
                  {post.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {post.author}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.publishedAt).toLocaleDateString()}
                </div>
                <span>{post.readTime} min</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
</dec-write>

<dec-write file_path="src/app/blog/[slug]/page.tsx">
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  category: string;
  slug: string;
}

const getBlogPost = async (slug: string): Promise<BlogPost | null> => {
  const posts: BlogPost[] = [
    {
      id: '1',
      title: 'Getting Started with Next.js App Router',
      excerpt: 'Learn how to build modern web applications with the new Next.js App Router.',
      content: 'The Next.js App Router is a powerful new way to build React applications...',
      author: 'John Doe',
      publishedAt: '2024-03-15',
      category: 'Development',
      slug: 'getting-started-nextjs-app-router',
    },
  ];
  
  return posts.find(post => post.slug === slug) || null;
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    return { title: 'Post Not Found' };
  }
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
    },
  };
}

export async function generateStaticParams() {
  return [
    { slug: 'getting-started-nextjs-app-router' },
    { slug: 'typescript-best-practices-react' },
  ];
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    notFound();
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/blog">
        <Button variant="ghost" className="flex items-center gap-2 mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Button>
      </Link>
      
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <Badge className="mb-4">{post.category}</Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>
          <div className="text-sm text-gray-500">
            By {post.author} • {new Date(post.publishedAt).toLocaleDateString()}
          </div>
        </header>
        
        <div className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </article>
    </div>
  );
}
</dec-write>

<dec-write file_path="src/app/blog/category/[category]/page.tsx">
import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  slug: string;
}

const getPostsByCategory = async (category: string): Promise<BlogPost[]> => {
  const allPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Getting Started with Next.js App Router',
      excerpt: 'Learn how to build modern web applications.',
      category: 'development',
      slug: 'getting-started-nextjs-app-router',
    },
    {
      id: '2',
      title: 'TypeScript Best Practices',
      excerpt: 'Essential TypeScript patterns for React.',
      category: 'typescript',
      slug: 'typescript-best-practices-react',
    },
  ];
  
  return allPosts.filter(post => post.category.toLowerCase() === category.toLowerCase());
};

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const posts = await getPostsByCategory(params.category);
  const categoryName = params.category.charAt(0).toUpperCase() + params.category.slice(1);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/blog">
        <Button variant="ghost" className="flex items-center gap-2 mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Button>
      </Link>
      
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        {categoryName} Posts
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Badge variant="secondary">{categoryName}</Badge>
              <CardTitle>
                <Link href={`/blog/${post.slug}`} className="hover:text-blue-600">
                  {post.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{post.excerpt}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
</dec-write>

## Example 2: API Routes with Route Handlers

**User Message:**
Create API routes for user management with proper validation and error handling.

**AI Response:**
I'll create comprehensive API routes using Next.js Route Handlers with validation, error handling, and TypeScript.

<dec-write file_path="src/app/api/users/route.ts">
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const UserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'user', 'editor']).default('user'),
});

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

// Mock database
let users: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    
    let filteredUsers = users;
    
    if (search) {
      filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    return NextResponse.json({
      success: true,
      data: paginatedUsers,
      pagination: {
        page,
        limit,
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = UserSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }
    
    const userData = validationResult.data;
    
    // Check if email already exists
    const existingUser = users.find(user => user.email === userData.email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already exists' },
        { status: 409 }
      );
    }
    
    const newUser: User = {
      id: Math.max(...users.map(u => u.id), 0) + 1,
      ...userData,
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    
    return NextResponse.json(
      { success: true, data: newUser, message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
</dec-write>

<dec-write file_path="src/app/api/users/[id]/route.ts">
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const UpdateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.enum(['admin', 'user', 'editor']).optional(),
});

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

// Mock database (in real app, this would be shared or from a database)
let users: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID' },
        { status: 400 }
      );
    }
    
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID' },
        { status: 400 }
      );
    }
    
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    const body = await request.json();
    const validationResult = UpdateUserSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }
    
    const updateData = validationResult.data;
    
    // Check email uniqueness if email is being updated
    if (updateData.email) {
      const existingUser = users.find(
        user => user.email === updateData.email && user.id !== userId
      );
      if (existingUser) {
        return NextResponse.json(
          { success: false, error: 'Email already exists' },
          { status: 409 }
        );
      }
    }
    
    users[userIndex] = { ...users[userIndex], ...updateData };
    
    return NextResponse.json({
      success: true,
      data: users[userIndex],
      message: 'User updated successfully',
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID' },
        { status: 400 }
      );
    }
    
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    users.splice(userIndex, 1);
    
    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
</dec-write>

## Example 3: Server and Client Components

**User Message:**
Show me how to properly use server and client components in Next.js App Router.

**AI Response:**
I'll demonstrate the proper separation between server and client components with a practical example.

<dec-write file_path="src/app/dashboard/page.tsx">
import React from 'react';
import { UserStats } from './components/UserStats';
import { InteractiveChart } from './components/InteractiveChart';
import { RecentActivity } from './components/RecentActivity';

// This is a Server Component by default
async function getDashboardData() {
  // This runs on the server
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return {
    userCount: 1250,
    activeUsers: 892,
    revenue: 45600,
    growth: 12.5,
    recentActivity: [
      { id: 1, user: 'John Doe', action: 'Created account', timestamp: '2024-03-15T10:30:00Z' },
      { id: 2, user: 'Jane Smith', action: 'Made purchase', timestamp: '2024-03-15T10:25:00Z' },
    ],
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();
  
  console.log('Dashboard page rendered on server');
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Server Component - renders on server */}
        <div className="lg:col-span-2">
          <UserStats data={data} />
        </div>
        
        {/* Client Component - interactive chart */}
        <div>
          <InteractiveChart data={data} />
        </div>
        
        {/* Server Component - static content */}
        <div className="lg:col-span-3">
          <RecentActivity activities={data.recentActivity} />
        </div>
      </div>
    </div>
  );
}
</dec-write>

<dec-write file_path="src/app/dashboard/components/UserStats.tsx">
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, DollarSign, TrendingUp } from 'lucide-react';

interface UserStatsProps {
  data: {
    userCount: number;
    activeUsers: number;
    revenue: number;
    growth: number;
  };
}

// Server Component - no interactivity needed
export function UserStats({ data }: UserStatsProps) {
  const stats = [
    {
      title: 'Total Users',
      value: data.userCount.toLocaleString(),
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Active Users',
      value: data.activeUsers.toLocaleString(),
      icon: UserCheck,
      color: 'text-green-600',
    },
    {
      title: 'Revenue',
      value: `$${data.revenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-yellow-600',
    },
    {
      title: 'Growth',
      value: `${data.growth}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
    },
  ];
  
  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
</dec-write>

<dec-write file_path="src/app/dashboard/components/InteractiveChart.tsx">
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface InteractiveChartProps {
  data: {
    userCount: number;
    activeUsers: number;
    revenue: number;
  };
}

// Client Component - needs interactivity
export function InteractiveChart({ data }: InteractiveChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<'users' | 'revenue'>('users');
  
  const metrics = {
    users: {
      title: 'User Metrics',
      total: data.userCount,
      active: data.activeUsers,
    },
    revenue: {
      title: 'Revenue Metrics',
      total: data.revenue,
      active: data.revenue * 0.8, // 80% of revenue is active
    },
  };
  
  const currentMetric = metrics[selectedMetric];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Interactive Chart</CardTitle>
        <div className="flex gap-2">
          <Button
            variant={selectedMetric === 'users' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedMetric('users')}
          >
            Users
          </Button>
          <Button
            variant={selectedMetric === 'revenue' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedMetric('revenue')}
          >
            Revenue
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium">{currentMetric.title}</div>
            <div className="text-2xl font-bold">
              {selectedMetric === 'revenue' ? '$' : ''}
              {currentMetric.total.toLocaleString()}
            </div>
          </div>
          
          {/* Simple bar chart representation */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total</span>
              <span>{currentMetric.total.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full w-full"></div>
            </div>
            
            <div className="flex justify-between text-sm">
              <span>Active</span>
              <span>{currentMetric.active.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${(currentMetric.active / currentMetric.total) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
</dec-write>

## Best Practices

### Server Components (Default)
- Use for static content, data fetching, and SEO-critical content
- Can access server-side resources directly
- Smaller bundle size, better performance
- Cannot use browser APIs or event handlers

### Client Components ('use client')
- Use for interactivity, state management, and browser APIs
- Required for useState, useEffect, event handlers
- Larger bundle size but enables rich interactions
- Can import and use server components as children

### Key Guidelines
1. **Start with Server Components** - Use client components only when needed
2. **Push Client Components down** - Keep them as low in the tree as possible
3. **Pass data down** - Server components can pass data to client components
4. **Composition pattern** - Use children prop to combine server and client components
5. **Static Generation** - Use generateStaticParams for static routes when possible