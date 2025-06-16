# Component Creation Examples

## When to Use This File
- User requests new UI components or React components
- Creating reusable component libraries
- Building complex interactive elements
- Form components and input handling
- Layout and navigation components

## Example 1: Creating a New Component with Props

**User Message:**
Create a ProductCard component that displays product information with an image, title, price, and buy button.

**AI Response:**
I'll create a ProductCard component that displays product information in a clean, responsive layout.

<dec-code>
Let's create the ProductCard component with proper TypeScript types and responsive design:

<dec-write file_path="src/components/ProductCard.tsx">
import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  description?: string;
  inStock: boolean;
}

interface ProductCardProps {
  product: Product;
  onBuyClick: (productId: string) => void;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onBuyClick, 
  className 
}) => {
  const handleBuyClick = () => {
    console.log('Buy button clicked for product:', product.id);
    onBuyClick(product.id);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <Card className={`w-full max-w-sm mx-auto hover:shadow-lg transition-shadow ${className}`}>
      <CardHeader className="p-0">
        <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.title}
        </h3>
        
        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-3">
            {product.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          
          <span className={`text-sm px-2 py-1 rounded-full ${
            product.inStock 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={handleBuyClick}
          disabled={!product.inStock}
          className="w-full"
        >
          {product.inStock ? 'Add to Cart' : 'Notify When Available'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;

</dec-write>

Now let's create a usage example component to show how to use the ProductCard:

<dec-write file_path="src/components/ProductGrid.tsx">
'use client';
import React from 'react';
import ProductCard from './ProductCard';

const sampleProducts = [
  {
    id: '1',
    title: 'Wireless Bluetooth Headphones',
    price: 99.99,
    image: '/images/headphones.jpg',
    description: 'High-quality wireless headphones with noise cancellation',
    inStock: true,
  },
  {
    id: '2',
    title: 'Smart Watch Series 5',
    price: 299.99,
    image: '/images/smartwatch.jpg',
    description: 'Advanced fitness tracking and health monitoring',
    inStock: false,
  },
  {
    id: '3',
    title: 'Portable Laptop Stand',
    price: 49.99,
    image: '/images/laptop-stand.jpg',
    description: 'Ergonomic adjustable laptop stand for better posture',
    inStock: true,
  },
];

const ProductGrid: React.FC = () => {
  const handleBuyClick = (productId: string) => {
    console.log('Adding product to cart:', productId);
    // Add your cart logic here
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-center mb-8">Featured Products</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onBuyClick={handleBuyClick}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;

</dec-write>
</dec-code>

I've created a ProductCard component with proper TypeScript types, responsive design, and a ProductGrid component to demonstrate its usage.

## Example 2: Interactive Form Component

**User Message:**
Create a SearchBar component with autocomplete functionality and search suggestions.

**AI Response:**
I'll create an interactive SearchBar component with autocomplete functionality and keyboard navigation.

<dec-code>
Let's create a SearchBar component with autocomplete and search suggestions:

<dec-write file_path="src/components/SearchBar.tsx">
'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchSuggestion {
  id: string;
  text: string;
  category?: string;
}

interface SearchBarProps {
  placeholder?: string;
  suggestions?: SearchSuggestion[];
  onSearch: (query: string) => void;
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  className?: string;
  showClearButton?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  suggestions = [],
  onSearch,
  onSuggestionSelect,
  className = '',
  showClearButton = true,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [filteredSuggestions, setFilteredSuggestions] = useState<SearchSuggestion[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter suggestions based on query
  useEffect(() => {
    if (query.trim() === '') {
      setFilteredSuggestions([]);
      setIsOpen(false);
      return;
    }

    const filtered = suggestions.filter(suggestion =>
      suggestion.text.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredSuggestions(filtered);
    setIsOpen(filtered.length > 0);
    setSelectedIndex(-1);
  }, [query, suggestions]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    console.log('Search query changed:', value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(filteredSuggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      console.log('Performing search:', query);
      onSearch(query.trim());
      setIsOpen(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    console.log('Suggestion selected:', suggestion);
    setQuery(suggestion.text);
    setIsOpen(false);
    
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    } else {
      onSearch(suggestion.text);
    }
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
    console.log('Search cleared');
  };

  return (
    <div ref={containerRef} className={`relative w-full max-w-md ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-10 pr-20"
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {showClearButton && query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleSearch}
            className="h-6 w-6 p-0"
          >
            <Search className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-50 ${
                index === selectedIndex ? 'bg-blue-50 text-blue-700' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm">{suggestion.text}</span>
                {suggestion.category && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {suggestion.category}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

</dec-write>

Now let's create a usage example:

<dec-write file_path="src/components/SearchExample.tsx">
'use client';
import React, { useState } from 'react';
import SearchBar from './SearchBar';

const searchSuggestions = [
  { id: '1', text: 'React components', category: 'Development' },
  { id: '2', text: 'Next.js routing', category: 'Development' },
  { id: '3', text: 'TypeScript types', category: 'Development' },
  { id: '4', text: 'Tailwind CSS', category: 'Styling' },
  { id: '5', text: 'API integration', category: 'Backend' },
  { id: '6', text: 'Database design', category: 'Backend' },
  { id: '7', text: 'User authentication', category: 'Security' },
  { id: '8', text: 'Performance optimization', category: 'Performance' },
];

const SearchExample: React.FC = () => {
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // Simulate search results
    const results = [
      `Result 1 for "${query}"`,
      `Result 2 for "${query}"`,
      `Result 3 for "${query}"`,
    ];
    setSearchResults(results);
  };

  const handleSuggestionSelect = (suggestion: any) => {
    console.log('Selected suggestion:', suggestion);
    handleSearch(suggestion.text);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-center mb-8">Search Example</h2>
      
      <div className="flex justify-center mb-8">
        <SearchBar
          placeholder="Search documentation..."
          suggestions={searchSuggestions}
          onSearch={handleSearch}
          onSuggestionSelect={handleSuggestionSelect}
        />
      </div>

      {searchResults.length > 0 && (
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-semibold mb-4">Search Results:</h3>
          <ul className="space-y-2">
            {searchResults.map((result, index) => (
              <li key={index} className="p-3 bg-gray-50 rounded-md">
                {result}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchExample;

</dec-write>
</dec-code>

I've created an interactive SearchBar component with autocomplete functionality, keyboard navigation, and a usage example.

## Example 3: Modal Component with Portal

**User Message:**
Create a reusable Modal component that can be used throughout the application.

**AI Response:**
I'll create a flexible Modal component using React Portal for proper rendering outside the component tree.

<dec-code>
Let's create a reusable Modal component with portal rendering:

<dec-write file_path="src/components/Modal.tsx">
'use client';
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = '',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Focus management
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className={`
          relative w-full ${sizeClasses[size]} max-h-[90vh] 
          bg-white rounded-lg shadow-xl overflow-hidden
          transform transition-all duration-200 ease-out
          ${className}
        `}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            {title && (
              <h2 id="modal-title" className="text-xl font-semibold text-gray-900">
                {title}
              </h2>
            )}
            
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="ml-auto"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {children}
        </div>
      </div>
    </div>
  );

  // Render modal using portal
  return createPortal(modalContent, document.body);
};

export default Modal;

</dec-write>

Now let's create a hook for easier modal management:

<dec-write file_path="src/hooks/useModal.ts">
import { useState, useCallback } from 'react';

interface UseModalReturn {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  toggleModal: () => void;
}

export const useModal = (initialState = false): UseModalReturn => {
  const [isOpen, setIsOpen] = useState(initialState);

  const openModal = useCallback(() => {
    console.log('Modal opened');
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    console.log('Modal closed');
    setIsOpen(false);
  }, []);

  const toggleModal = useCallback(() => {
    console.log('Modal toggled');
    setIsOpen(prev => !prev);
  }, []);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
  };
};

</dec-write>

Let's create a usage example:

<dec-write file_path="src/components/ModalExample.tsx">
'use client';
import React from 'react';
import Modal from './Modal';
import { useModal } from '@/hooks/useModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const ModalExample: React.FC = () => {
  const { isOpen, openModal, closeModal } = useModal();
  const confirmModal = useModal();
  const formModal = useModal();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
    formModal.closeModal();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-center mb-8">Modal Examples</h2>
      
      <div className="flex flex-wrap gap-4 justify-center">
        <Button onClick={openModal}>
          Open Basic Modal
        </Button>
        
        <Button onClick={confirmModal.openModal} variant="destructive">
          Open Confirmation Modal
        </Button>
        
        <Button onClick={formModal.openModal} variant="outline">
          Open Form Modal
        </Button>
      </div>

      {/* Basic Modal */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Basic Modal"
        size="md"
      >
        <div className="space-y-4">
          <p>This is a basic modal example with some content.</p>
          <p>You can close it by clicking the X button, pressing Escape, or clicking outside the modal.</p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button onClick={closeModal}>
              OK
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModal.isOpen}
        onClose={confirmModal.closeModal}
        title="Confirm Action"
        size="sm"
        closeOnOverlayClick={false}
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete this item? This action cannot be undone.</p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={confirmModal.closeModal}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmModal.closeModal}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Form Modal */}
      <Modal
        isOpen={formModal.isOpen}
        onClose={formModal.closeModal}
        title="Contact Form"
        size="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" required />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" rows={4} required />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={formModal.closeModal}>
              Cancel
            </Button>
            <Button type="submit">
              Send Message
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ModalExample;

</dec-write>
</dec-code>

I've created a flexible Modal component with portal rendering, a useModal hook for state management, and comprehensive usage examples.

## Best Practices

- **TypeScript First**: Always define proper interfaces for component props
- **Responsive Design**: Use Tailwind classes for mobile-first responsive layouts
- **Accessibility**: Include proper ARIA attributes and keyboard navigation
- **Performance**: Use React.memo for components that don't need frequent re-renders
- **Reusability**: Design components to be flexible and configurable
- **Error Boundaries**: Implement error handling for robust components
- **Testing**: Write components with testing in mind
- **Documentation**: Include clear prop descriptions and usage examples