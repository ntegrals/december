# State Management Examples

## When to Use This File
- User requests data flow or state updates
- React Query usage and server state management
- Local state management with useState/useContext
- Global state management patterns
- State synchronization between components

## Example 1: React Query for Server State

**User Message:**
Implement user data fetching with React Query including loading states, error handling, and caching.

**AI Response:**
I'll implement comprehensive user data management using React Query with proper loading states and error handling.

<dec-code>
Let's create a complete React Query setup for user data management:

<dec-write file_path="src/lib/api/users.ts">
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'editor';
  department?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  role: 'admin' | 'user' | 'editor';
  department?: string;
}

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchUsers = async (): Promise<User[]> => {
  console.log('Fetching users...');
  await delay(1000);
  
  return [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      department: 'Engineering',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'user',
      department: 'Marketing',
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
    },
  ];
};

export const createUser = async (userData: CreateUserData): Promise<User> => {
  console.log('Creating user:', userData);
  await delay(1200);
  
  const newUser: User = {
    id: Date.now(),
    ...userData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  return newUser;
};

</dec-write>

Now let's create React Query hooks for user management:

<dec-write file_path="src/hooks/useUsers.ts">
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { fetchUsers, createUser, User, CreateUserData } from '@/lib/api/users';

// Query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
};

// Fetch all users
export const useUsers = () => {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create user mutation
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createUser,
    onSuccess: (newUser) => {
      console.log('User created successfully:', newUser);
      
      // Update the users list cache
      queryClient.setQueryData(userKeys.lists(), (oldUsers: User[] | undefined) => {
        return oldUsers ? [...oldUsers, newUser] : [newUser];
      });
      
      toast.success('User created successfully!');
    },
    onError: (error: Error) => {
      console.error('Failed to create user:', error);
      toast.error(`Failed to create user: ${error.message}`);
    },
  });
};

</dec-write>
</dec-code>

I've created a user management system using React Query with proper caching and error handling.

## Example 2: Global State with Context

**User Message:**
Create a shopping cart context for managing cart state across the application.

**AI Response:**
I'll create a shopping cart context with comprehensive state management for cart operations.

<dec-code>
Let's create a shopping cart context:

<dec-write file_path="src/contexts/CartContext.tsx">
'use client';
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'sonner';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> & { quantity?: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
};

const calculateTotals = (items: CartItem[]) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { total, itemCount };
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { quantity = 1, ...item } = action.payload;
      const existingItemIndex = state.items.findIndex(i => i.id === item.id);
      
      let newItems: CartItem[];
      
      if (existingItemIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...state.items, { ...item, quantity }];
      }
      
      const { total, itemCount } = calculateTotals(newItems);
      
      return { ...state, items: newItems, total, itemCount };
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      const { total, itemCount } = calculateTotals(newItems);
      
      return { ...state, items: newItems, total, itemCount };
    }
    
    case 'CLEAR_CART': {
      return { ...state, items: [], total: 0, itemCount: 0 };
    }
    
    default:
      return state;
  }
};

interface CartContextType extends CartState {
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
    toast.success(`${item.name} added to cart`);
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
    toast.success('Item removed from cart');
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast.success('Cart cleared');
  };

  const value: CartContextType = {
    ...state,
    addItem,
    removeItem,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

</dec-write>
</dec-code>

I've created a shopping cart context with state management and toast notifications.

## Best Practices

- **React Query for Server State**: Use React Query for API data and caching
- **Context for Global State**: Use React Context for app-wide state like user auth or cart
- **Local State for UI**: Use useState for component-specific state
- **Proper Error Handling**: Implement error boundaries and error states
- **Loading States**: Always show loading indicators for async operations
- **Optimistic Updates**: Update UI immediately, then sync with server
- **State Normalization**: Keep state flat and normalized for complex data
- **Memoization**: Use useMemo and useCallback to prevent unnecessary re-renders