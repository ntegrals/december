# Common Errors and Solutions

## Lucide React Icon Errors

### Error: Type 'Icon' does not have any construct or call signatures
```
error TS2604: JSX element type 'Icon' does not have any construct or call signatures.
error TS2786: 'Icon' cannot be used as a JSX component.
```

**Cause**: Incorrect icon import or usage pattern.

**Solution**: Import icons directly from lucide-react:
```tsx
// ❌ Wrong
import { Icon } from 'lucide-react';
const MyIcon = Icon;

// ✅ Correct
import { Home, User, Settings } from 'lucide-react';

// Usage
<Home className="h-4 w-4" />
<User className="h-5 w-5" />
<Settings className="h-6 w-6" />
```

### Error: Cannot use dynamic icon names
```
error TS2322: Type 'string' is not assignable to type 'LucideIcon'
```

**Solution**: Use a proper icon mapping:
```tsx
// ❌ Wrong
const iconName = 'Home';
<iconName className="h-4 w-4" />

// ✅ Correct
import { Home, User, Settings, LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  home: Home,
  user: User,
  settings: Settings,
};

const IconComponent = ({ name }: { name: string }) => {
  const Icon = iconMap[name];
  return Icon ? <Icon className="h-4 w-4" /> : null;
};
```

## JSX String Escaping Errors

### Error: Unterminated string literal
```
error TS1002: Unterminated string literal.
```

**Cause**: Improper quote escaping in JSX strings.

**Common Examples**:
```tsx
// ❌ Wrong - unescaped apostrophe
setMessage('I can't do this')
<p>User's profile</p>

// ✅ Correct solutions
setMessage("I can't do this")
setMessage('I can\'t do this')
<p>User&apos;s profile</p>
<p>{`User's profile`}</p>
```

### Error: Unexpected token in JSX
**Solution**: Use proper string escaping:
```tsx
// ❌ Wrong
<button onClick={() => alert('Don't click me!')}>

// ✅ Correct
<button onClick={() => alert("Don't click me!")}>
<button onClick={() => alert('Don\'t click me!')}>
```

## Next.js App Router Errors

### Error: Cannot read properties of undefined (reading 'params')
**Cause**: Incorrect page component structure in App Router.

**Solution**: Ensure proper async component structure:
```tsx
// ❌ Wrong
export default function Page({ params }) {
  // params might be undefined
}

// ✅ Correct
export default async function Page({ 
  params 
}: { 
  params: { slug: string } 
}) {
  // params is properly typed
}
```

### Error: Headers already sent
**Cause**: Attempting to set headers after response has started.

**Solution**: Use proper error handling in API routes:
```tsx
// ❌ Wrong
export async function GET() {
  try {
    const data = await fetchData();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: 'Failed' }); // Headers already sent
  }
}

// ✅ Correct
export async function GET() {
  try {
    const data = await fetchData();
    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch data' }, 
      { status: 500 }
    );
  }
}
```

## React Hook Errors

### Error: Cannot call hooks conditionally
```
React Hook "useState" is called conditionally. React Hooks must be called in the exact same order every time.
```

**Solution**: Always call hooks at the top level:
```tsx
// ❌ Wrong
function Component({ condition }) {
  if (condition) {
    const [state, setState] = useState(false);
  }
}

// ✅ Correct
function Component({ condition }) {
  const [state, setState] = useState(false);
  
  if (!condition) {
    return null;
  }
  
  // Use state here
}
```

### Error: Cannot update state during render
**Solution**: Use useEffect for side effects:
```tsx
// ❌ Wrong
function Component() {
  const [count, setCount] = useState(0);
  setCount(count + 1); // Called during render
}

// ✅ Correct
function Component() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    setCount(count + 1);
  }, []);
}
```

## TypeScript Errors

### Error: Property does not exist on type
**Solution**: Proper interface definitions:
```tsx
// ❌ Wrong
interface User {
  name: string;
}

const user: User = { name: 'John', age: 30 }; // Error: age doesn't exist

// ✅ Correct
interface User {
  name: string;
  age?: number; // Optional property
}

const user: User = { name: 'John', age: 30 };
```

### Error: Cannot find module or its type declarations
**Solution**: Install type definitions:
```bash
npm install @types/package-name
```

Or create a declaration file:
```tsx
// types/package.d.ts
declare module 'package-name' {
  export function someFunction(): void;
}
```

## Tailwind CSS Errors

### Error: Class names not applying
**Cause**: Dynamic class names not being detected by Tailwind.

**Solution**: Use complete class names:
```tsx
// ❌ Wrong - Tailwind can't detect dynamic classes
const color = 'red';
<div className={`text-${color}-500`} />

// ✅ Correct
const colorClasses = {
  red: 'text-red-500',
  blue: 'text-blue-500',
  green: 'text-green-500',
};
<div className={colorClasses[color]} />

// Or use safelist in tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    'text-red-500',
    'text-blue-500',
    'text-green-500',
  ],
}
```

## Form Validation Errors

### Error: Uncontrolled to controlled component warning
**Solution**: Initialize state properly:
```tsx
// ❌ Wrong
const [value, setValue] = useState(); // undefined initial value

// ✅ Correct
const [value, setValue] = useState(''); // Empty string initial value
```

### Error: Cannot read property 'value' of null
**Solution**: Use proper ref handling:
```tsx
// ❌ Wrong
const inputRef = useRef();
const handleClick = () => {
  console.log(inputRef.current.value); // Might be null
};

// ✅ Correct
const inputRef = useRef<HTMLInputElement>(null);
const handleClick = () => {
  if (inputRef.current) {
    console.log(inputRef.current.value);
  }
};
```

## API and Data Fetching Errors

### Error: Network request failed
**Solution**: Proper error handling:
```tsx
// ❌ Wrong
const fetchData = async () => {
  const response = await fetch('/api/data');
  return response.json();
};

// ✅ Correct
const fetchData = async () => {
  try {
    const response = await fetch('/api/data');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};
```

### Error: JSON parsing failed
**Solution**: Check content type before parsing:
```tsx
// ✅ Correct
const response = await fetch('/api/data');
const contentType = response.headers.get('content-type');

if (contentType && contentType.includes('application/json')) {
  return await response.json();
} else {
  return await response.text();
}
```

## Build and Deployment Errors

### Error: Module not found during build
**Solution**: Check import paths and case sensitivity:
```tsx
// ❌ Wrong - case sensitive on production
import Component from './Component';
// But file is named component.tsx

// ✅ Correct
import Component from './component';
```

### Error: Hydration mismatch
**Solution**: Ensure server and client render the same content:
```tsx
// ❌ Wrong - different content on server/client
function Component() {
  return <div>{Date.now()}</div>;
}

// ✅ Correct - use useEffect for client-only content
function Component() {
  const [timestamp, setTimestamp] = useState<number | null>(null);
  
  useEffect(() => {
    setTimestamp(Date.now());
  }, []);
  
  return <div>{timestamp || 'Loading...'}</div>;
}
```

## Performance Issues

### Error: Too many re-renders
**Solution**: Optimize dependencies and memoization:
```tsx
// ❌ Wrong - creates new object every render
function Component() {
  const config = { option: true };
  
  useEffect(() => {
    doSomething(config);
  }, [config]); // Will run every render
}

// ✅ Correct
function Component() {
  const config = useMemo(() => ({ option: true }), []);
  
  useEffect(() => {
    doSomething(config);
  }, [config]); // Will run only once
}
```

## Debugging Tips

1. **Use console.log strategically**: Add logs to track data flow
2. **Check browser dev tools**: Network tab for API issues, Console for errors
3. **Use TypeScript strict mode**: Catches many errors at compile time
4. **Enable ESLint**: Catches common React and JavaScript issues
5. **Use React Developer Tools**: Debug component state and props
6. **Check Next.js build output**: Look for warnings and errors during build