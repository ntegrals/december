# Error Handling Examples

## When to Use This File
- User reports errors or debugging is needed
- Implementing error boundaries and fallback UI
- API error handling and user feedback
- Form validation and error display
- Console error debugging and logging

## Example 1: Error Boundary Implementation

**User Message:**
Add error boundaries to catch and handle React errors gracefully.

**AI Response:**
I'll create error boundaries to catch React errors and provide fallback UI for better user experience.

<dec-code>
Let's create a comprehensive error boundary system:

<dec-write file_path="src/components/ErrorBoundary.tsx">
'use client';
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    console.error('Error caught by boundary:', error);
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error details:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: logErrorToService(error, errorInfo);
    }
  }

  handleRetry = () => {
    console.log('Retrying after error...');
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <Card className="max-w-lg mx-auto mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Something went wrong
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="bg-gray-50 p-4 rounded-md">
                <summary className="cursor-pointer font-medium text-sm">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 text-xs text-red-600 overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            
            <div className="flex gap-2">
              <Button onClick={this.handleRetry} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

</dec-write>

Now let's create a hook for error handling:

<dec-write file_path="src/hooks/useErrorHandler.ts">
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface UseErrorHandlerReturn {
  error: string | null;
  setError: (error: string | null) => void;
  handleError: (error: any) => void;
  clearError: () => void;
}

export const useErrorHandler = (): UseErrorHandlerReturn => {
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((error: any) => {
    console.error('Error handled:', error);
    
    let errorMessage = 'An unexpected error occurred';
    
    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error?.message) {
      errorMessage = error.message;
    } else if (error?.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    setError(errorMessage);
    toast.error(errorMessage);
  }, []);

  const clearError = useCallback(() => {
    console.log('Error cleared');
    setError(null);
  }, []);

  return {
    error,
    setError,
    handleError,
    clearError,
  };
};

</dec-write>

Let's create an example component that demonstrates error handling:

<dec-write file_path="src/components/ErrorHandlingExample.tsx">
'use client';
import React, { useState } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

// Component that throws an error
const BuggyComponent: React.FC<{ shouldThrow: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('This is a test error from BuggyComponent!');
  }
  
  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-md">
      <p className="text-green-800">Component is working correctly!</p>
    </div>
  );
};

// Component that demonstrates async error handling
const AsyncErrorComponent: React.FC = () => {
  const { error, handleError, clearError } = useErrorHandler();
  const [loading, setLoading] = useState(false);

  const simulateAsyncError = async () => {
    setLoading(true);
    clearError();
    
    try {
      console.log('Simulating async operation...');
      
      // Simulate API call that fails
      await new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('API request failed: Server is unavailable'));
        }, 1000);
      });
      
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const simulateSuccess = async () => {
    setLoading(true);
    clearError();
    
    try {
      console.log('Simulating successful operation...');
      
      await new Promise(resolve => {
        setTimeout(resolve, 1000);
      });
      
      console.log('Operation completed successfully');
      
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Async Error Handling</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="flex gap-2">
          <Button 
            onClick={simulateAsyncError} 
            disabled={loading}
            variant="destructive"
          >
            {loading ? 'Loading...' : 'Trigger Async Error'}
          </Button>
          
          <Button 
            onClick={simulateSuccess} 
            disabled={loading}
            variant="outline"
          >
            {loading ? 'Loading...' : 'Simulate Success'}
          </Button>
          
          {error && (
            <Button onClick={clearError} variant="ghost">
              Clear Error
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const ErrorHandlingExample: React.FC = () => {
  const [shouldThrow, setShouldThrow] = useState(false);

  const handleErrorBoundaryError = (error: Error) => {
    console.log('Error boundary caught error:', error.message);
    // Here you could send to error reporting service
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h2 className="text-2xl font-bold text-center">Error Handling Examples</h2>
      
      {/* Error Boundary Example */}
      <Card>
        <CardHeader>
          <CardTitle>Error Boundary Example</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            This demonstrates how error boundaries catch React component errors.
          </p>
          
          <Button 
            onClick={() => setShouldThrow(!shouldThrow)}
            variant={shouldThrow ? "destructive" : "default"}
          >
            {shouldThrow ? 'Fix Component' : 'Break Component'}
          </Button>
          
          <ErrorBoundary onError={handleErrorBoundaryError}>
            <BuggyComponent shouldThrow={shouldThrow} />
          </ErrorBoundary>
        </CardContent>
      </Card>

      {/* Async Error Handling */}
      <AsyncErrorComponent />
    </div>
  );
};

export default ErrorHandlingExample;

</dec-write>
</dec-code>

I've created a comprehensive error handling system with error boundaries, async error handling, and user-friendly error display.

## Example 2: Form Validation with Error Display

**User Message:**
Add comprehensive form validation with error messages for a user registration form.

**AI Response:**
I'll create a registration form with comprehensive validation and error handling.

<dec-code>
Let's create a form with validation and error handling:

<dec-write file_path="src/components/RegistrationForm.tsx">
'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle } from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  general?: string;
}

const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateField = (name: keyof FormData, value: string): string | undefined => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) {
          return `${name === 'firstName' ? 'First' : 'Last'} name is required`;
        }
        if (value.length < 2) {
          return `${name === 'firstName' ? 'First' : 'Last'} name must be at least 2 characters`;
        }
        break;

      case 'email':
        if (!value.trim()) {
          return 'Email is required';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return 'Please enter a valid email address';
        }
        break;

      case 'password':
        if (!value) {
          return 'Password is required';
        }
        if (value.length < 8) {
          return 'Password must be at least 8 characters long';
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        }
        break;

      case 'confirmPassword':
        if (!value) {
          return 'Please confirm your password';
        }
        if (value !== formData.password) {
          return 'Passwords do not match';
        }
        break;

      case 'phone':
        if (!value.trim()) {
          return 'Phone number is required';
        }
        const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
          return 'Please enter a valid phone number';
        }
        break;

      default:
        return undefined;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof FormData;
    
    console.log(`Field ${name} changed to:`, value);
    
    setFormData(prev => ({
      ...prev,
      [fieldName]: value,
    }));

    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: undefined,
      }));
    }

    // Real-time validation for password confirmation
    if (fieldName === 'confirmPassword' || fieldName === 'password') {
      const passwordValue = fieldName === 'password' ? value : formData.password;
      const confirmValue = fieldName === 'confirmPassword' ? value : formData.confirmPassword;
      
      if (confirmValue && passwordValue !== confirmValue) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: 'Passwords do not match',
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          confirmPassword: undefined,
        }));
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof FormData;
    const error = validateField(fieldName, value);
    
    if (error) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: error,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Validate all fields
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key as keyof FormData, value);
      if (error) {
        newErrors[key as keyof FormErrors] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission started');
    
    setIsSubmitting(true);
    setErrors({});
    setIsSuccess(false);

    // Validate form
    if (!validateForm()) {
      setIsSubmitting(false);
      console.log('Form validation failed');
      return;
    }

    try {
      // Simulate API call
      console.log('Submitting form data:', formData);
      
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate random success/failure
          if (Math.random() > 0.3) {
            resolve('success');
          } else {
            reject(new Error('Registration failed: Email already exists'));
          }
        }, 2000);
      });

      console.log('Registration successful');
      setIsSuccess(true);
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
      });

    } catch (error: any) {
      console.error('Registration error:', error);
      setErrors({
        general: error.message || 'Registration failed. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h3 className="text-lg font-semibold text-green-700">
              Registration Successful!
            </h3>
            <p className="text-gray-600">
              Welcome! Your account has been created successfully.
            </p>
            <Button onClick={() => setIsSuccess(false)} variant="outline">
              Register Another User
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={errors.firstName ? 'border-red-500' : ''}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={errors.lastName ? 'border-red-500' : ''}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={errors.confirmPassword ? 'border-red-500' : ''}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegistrationForm;

</dec-write>
</dec-code>

I've created a comprehensive registration form with real-time validation, error handling, and user feedback.

## Best Practices

- **Error Boundaries**: Use error boundaries to catch React component errors
- **User Feedback**: Provide clear, actionable error messages
- **Graceful Degradation**: Always provide fallback UI for error states
- **Logging**: Log errors for debugging and monitoring
- **Validation**: Implement both client-side and server-side validation
- **Recovery**: Provide ways for users to recover from errors
- **Toast Notifications**: Use toast messages for non-blocking error feedback
- **Development vs Production**: Show detailed errors in development only