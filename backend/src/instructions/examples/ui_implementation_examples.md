# UI Implementation Examples

## When to Use This File
- User requests styling, responsive design, or Tailwind usage
- Creating beautiful, accessible user interfaces
- Implementing design systems and component libraries
- Responsive layout and mobile-first design
- Animation and interactive UI elements

## Example 1: Responsive Dashboard Layout

**User Message:**
Create a responsive dashboard layout with sidebar navigation and main content area.

**AI Response:**
I'll create a responsive dashboard layout with a collapsible sidebar and main content area using Tailwind CSS.

<dec-write file_path="src/components/Dashboard.tsx">
'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Menu, X, Home, Users, BarChart3, Settings, Bell, Search } from 'lucide-react';

const Sidebar: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  activeItem: string;
  onItemClick: (item: string) => void;
}> = ({ isOpen, onClose, activeItem, onItemClick }) => {
  const menuItems = [
    { id: 'dashboard', icon: <Home className="h-5 w-5" />, label: 'Dashboard' },
    { id: 'users', icon: <Users className="h-5 w-5" />, label: 'Users', badge: '12' },
    { id: 'analytics', icon: <BarChart3 className="h-5 w-5" />, label: 'Analytics' },
    { id: 'settings', icon: <Settings className="h-5 w-5" />, label: 'Settings' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300
          lg:relative lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onItemClick(item.id);
                onClose();
              }}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors
                ${activeItem === item.id 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              {item.icon}
              <span className="flex-1 font-medium">{item.label}</span>
              {item.badge && <Badge variant="secondary">{item.badge}</Badge>}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

const TopBar: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onMenuClick} className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
          </Button>
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">JD</span>
          </div>
        </div>
      </div>
    </header>
  );
};

const DashboardContent: React.FC<{ activeItem: string }> = ({ activeItem }) => {
  const renderContent = () => {
    switch (activeItem) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
              <p className="text-gray-600">Welcome back! Here's what's happening.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Total Users', value: '2,543', change: '+12%' },
                { title: 'Revenue', value: '$45,231', change: '+8%' },
                { title: 'Orders', value: '1,234', change: '-3%' },
                { title: 'Conversion', value: '3.2%', change: '+0.5%' },
              ].map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <span className="text-sm font-medium text-green-600">{stat.change}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      case 'users':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <Card>
              <CardHeader>
                <CardTitle>Recent Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'John Doe', email: 'john@example.com', role: 'Admin' },
                    { name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
                  ].map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">{user.role}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return <div>Content for {activeItem}</div>;
    }
  };

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-6">{renderContent()}</div>
    </main>
  );
};

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');

  return (
    <div className="h-screen flex bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeItem={activeItem}
        onItemClick={setActiveItem}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <DashboardContent activeItem={activeItem} />
      </div>
    </div>
  );
};

export default Dashboard;
</dec-write>

## Example 2: Animated Card Components

**User Message:**
Create beautiful animated card components with hover effects and smooth transitions.

**AI Response:**
I'll create animated card components with smooth hover effects and engaging transitions.

<dec-write file_path="src/components/AnimatedCards.tsx">
'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Share2, Star, ArrowRight, Play, Eye, Calendar } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviews: number;
    badge?: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="group relative overflow-hidden rounded-xl bg-white shadow-sm border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
      {/* Image Container */}
      <div className="relative overflow-hidden h-48 bg-gradient-to-br from-blue-400 to-purple-500">
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
        
        {product.badge && (
          <Badge className="absolute top-3 left-3 bg-red-500 text-white">
            {product.badge}
          </Badge>
        )}
        
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Button
            size="sm"
            variant="secondary"
            className="w-8 h-8 p-0 rounded-full bg-white/90"
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2">({product.reviews})</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
            )}
          </div>
          
          <Button
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

const VideoCard: React.FC<{
  video: {
    title: string;
    duration: string;
    views: string;
    date: string;
    channel: string;
  };
}> = ({ video }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-lg bg-gray-900 aspect-video mb-3">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`
              w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center
              transition-all duration-300 transform
              ${isHovered ? 'scale-110 bg-white/30' : 'scale-100'}
            `}
          >
            <Play className="h-6 w-6 text-white ml-1" />
          </div>
        </div>
        
        <div className="absolute bottom-2 right-2">
          <span className="bg-black/70 text-white text-xs px-2 py-1 rounded">
            {video.duration}
          </span>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {video.title}
        </h3>
        <div className="text-sm text-gray-500 space-y-1">
          <p>{video.channel}</p>
          <div className="flex items-center space-x-2">
            <span>{video.views} views</span>
            <span>•</span>
            <span>{video.date}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const EventCard: React.FC<{
  event: {
    title: string;
    date: string;
    time: string;
    location: string;
    attendees: number;
    price: number;
  };
}> = ({ event }) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
      <CardContent className="p-0">
        <div className="h-32 bg-gradient-to-r from-green-400 to-blue-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300" />
          <div className="absolute top-4 left-4 text-white">
            <div className="text-2xl font-bold">{event.date.split(' ')[0]}</div>
            <div className="text-sm opacity-90">{event.date.split(' ')[1]}</div>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {event.title}
          </h3>
          
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              {event.time}
            </div>
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              {event.attendees} attending
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">${event.price}</span>
            <Button
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              Register
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AnimatedCardsShowcase: React.FC = () => {
  const products = [
    {
      id: '1',
      name: 'Wireless Headphones',
      price: 99,
      originalPrice: 129,
      rating: 4.5,
      reviews: 128,
      badge: 'Sale',
    },
    {
      id: '2',
      name: 'Smart Watch',
      price: 299,
      rating: 4.8,
      reviews: 89,
    },
  ];

  const videos = [
    {
      title: 'Building Modern UIs with React and Tailwind CSS',
      duration: '12:34',
      views: '45K',
      date: '2 days ago',
      channel: 'Tech Tutorials',
    },
    {
      title: 'Advanced Animation Techniques in Web Development',
      duration: '18:22',
      views: '23K',
      date: '1 week ago',
      channel: 'Design Masters',
    },
  ];

  const events = [
    {
      title: 'React Conference 2024',
      date: '15 Mar',
      time: '9:00 AM - 6:00 PM',
      location: 'San Francisco, CA',
      attendees: 1250,
      price: 299,
    },
    {
      title: 'Design Systems Workshop',
      date: '22 Mar',
      time: '2:00 PM - 5:00 PM',
      location: 'Online',
      attendees: 89,
      price: 49,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Video Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <VideoCard key={index} video={video} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <EventCard key={index} event={event} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default AnimatedCardsShowcase;
</dec-write>

## Example 3: Form Components with Validation

**User Message:**
Create a contact form with validation and smooth animations.

**AI Response:**
I'll create a beautiful contact form with validation, error states, and smooth animations.

<dec-write file_path="src/components/ContactForm.tsx">
'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, User, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after success
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 3000);
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <div className="animate-bounce mb-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
          <p className="text-gray-600">Thank you for your message. We'll get back to you soon.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Contact Us</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`
                  w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all
                  ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
                `}
                placeholder="Your name"
              />
              {errors.name && (
                <div className="flex items-center mt-1 text-red-500 text-sm animate-fade-in">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.name}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`
                  w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all
                  ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
                `}
                placeholder="your@email.com"
              />
              {errors.email && (
                <div className="flex items-center mt-1 text-red-500 text-sm animate-fade-in">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.email}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Phone (Optional)</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Your phone number"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Message</label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
              <textarea
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                rows={4}
                className={`
                  w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all resize-none
                  ${errors.message ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
                `}
                placeholder="Your message..."
              />
              {errors.message && (
                <div className="flex items-center mt-1 text-red-500 text-sm animate-fade-in">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.message}
                </div>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending...
              </div>
            ) : (
              'Send Message'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
</dec-write>

## Best Practices

### Responsive Design
- **Mobile-first approach**: Start with mobile styles, then enhance for larger screens
- **Flexible layouts**: Use CSS Grid and Flexbox for responsive layouts
- **Breakpoint strategy**: Use consistent breakpoints (sm, md, lg, xl)
- **Touch-friendly**: Ensure interactive elements are at least 44px for touch targets

### Animation Guidelines
- **Performance**: Use transform and opacity for smooth animations
- **Duration**: Keep animations between 200-500ms for UI interactions
- **Easing**: Use CSS easing functions for natural motion
- **Accessibility**: Respect `prefers-reduced-motion` for accessibility

### Component Architecture
- **Composition**: Build reusable components with clear props interfaces
- **State management**: Keep component state minimal and focused
- **Accessibility**: Include proper ARIA labels and keyboard navigation
- **Error handling**: Provide clear error states and validation feedback