# Refactoring Examples

## When to Use This File
- User requests code reorganization or restructuring
- Function extraction from large components
- File splitting when components exceed size limits
- Moving logic to utility functions
- Breaking down monolithic components

## Example 1: Component Refactoring with File Size Management

**User Message:**
Refactor calculateResult to use a separate mathOperations utility file for the calculation logic.

**AI Response:**
Let's refactor the code to move the `calculateResult` function to a separate utility file, without impacting the existing functionality. We'll start by updating the `Calculator.tsx` component and then implement the `mathOperations.ts` file.

<dec-code>
First, we will modify `Calculator.tsx` to remove the inline `calculateResult` function and import it from the new `mathOperations.ts` file:

<dec-write file_path="src/components/Calculator.tsx">
import React, { useState } from 'react';
import { calculateResult } from '../utils/mathOperations';

const Calculator = () => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operation, setOperation] = useState('add');
  const [result, setResult] = useState(0);

  const handleCalculate = () => {
    const calculatedResult = calculateResult(Number(num1), Number(num2), operation);
    setResult(calculatedResult);
  };

  return (
    // ... keep existing code (JSX for the calculator component)
  );
};

export default Calculator;

</dec-write>

We've modified the `Calculator.tsx` file to use `calculateResult` from `mathOperations.ts`, but we haven't created the `mathOperations.ts` file yet. Let's create it now:

<dec-write file_path="src/utils/mathOperations.ts">
export const calculateResult = (num1: number, num2: number, operation: "add" | "subtract" | "multiply" | "divide") => {
  switch (operation) {
    case "add":
      return num1 + num2;
    case "subtract":
      return num1 - num2;
    case "multiply":
      return num1 * num2;
    case "divide":
      return num2 !== 0 ? num1 / num2 : "Error: Division by zero";
    default:
      return 0;
  }
};

</dec-write>

After implementing these changes, let's review to ensure we've covered everything:

1. We created the new `mathOperations.ts` file with the `calculateResult` function.
2. We updated `Calculator.tsx` to import and use the new `calculateResult` function.
3. We removed the inline `calculateResult` function from `Calculator.tsx`.
4. We've maintained the existing functionality while improving code organization.
5. No other files need to be modified for this refactoring.

The refactoring is now complete, and all necessary files have been written or updated.
</dec-code>

This refactoring moves the calculation logic to a separate utility file, improving code organization and maintainability without changing the functionality.

## Example 2: Large Component Breakdown

**User Message:**
This UserProfile component is getting too large. Can you break it down into smaller components?

**AI Response:**
I'll break down the large UserProfile component into smaller, focused components for better maintainability.

<dec-code>
Let's split the UserProfile component into smaller, focused components:

<dec-write file_path="src/components/UserProfile/UserProfile.tsx">
import React from 'react';
import { UserHeader } from './UserHeader';
import { UserDetails } from './UserDetails';
import { UserActions } from './UserActions';

interface UserProfileProps {
  user: User;
  onEdit: () => void;
  onDelete: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <UserHeader user={user} />
      <UserDetails user={user} />
      <UserActions onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
};

export default UserProfile;

</dec-write>

<dec-write file_path="src/components/UserProfile/UserHeader.tsx">
import React from 'react';
import { User } from '@/types/user';

interface UserHeaderProps {
  user: User;
}

export const UserHeader: React.FC<UserHeaderProps> = ({ user }) => {
  return (
    <div className="flex items-center space-x-4 mb-4">
      <img
        src={user.avatar}
        alt={user.name}
        className="w-16 h-16 rounded-full"
      />
      <div>
        <h2 className="text-xl font-semibold">{user.name}</h2>
        <p className="text-gray-600">{user.email}</p>
      </div>
    </div>
  );
};

</dec-write>

<dec-write file_path="src/components/UserProfile/UserDetails.tsx">
import React from 'react';
import { User } from '@/types/user';

interface UserDetailsProps {
  user: User;
}

export const UserDetails: React.FC<UserDetailsProps> = ({ user }) => {
  return (
    <div className="space-y-2 mb-4">
      <div className="flex justify-between">
        <span className="font-medium">Role:</span>
        <span>{user.role}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-medium">Department:</span>
        <span>{user.department}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-medium">Joined:</span>
        <span>{new Date(user.joinedAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

</dec-write>

<dec-write file_path="src/components/UserProfile/UserActions.tsx">
import React from 'react';
import { Button } from '@/components/ui/button';

interface UserActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const UserActions: React.FC<UserActionsProps> = ({ onEdit, onDelete }) => {
  return (
    <div className="flex space-x-2">
      <Button onClick={onEdit} variant="outline">
        Edit Profile
      </Button>
      <Button onClick={onDelete} variant="destructive">
        Delete User
      </Button>
    </div>
  );
};

</dec-write>

<dec-write file_path="src/components/UserProfile/index.ts">
export { default as UserProfile } from './UserProfile';
export { UserHeader } from './UserHeader';
export { UserDetails } from './UserDetails';
export { UserActions } from './UserActions';

</dec-write>
</dec-code>

The large UserProfile component has been broken down into four focused components, each handling a specific responsibility.

## Best Practices

- **Single Responsibility**: Each component should have one clear purpose
- **File Size Limits**: Keep components under 50 lines when possible
- **Logical Grouping**: Group related components in directories
- **Clear Interfaces**: Define explicit props interfaces for TypeScript
- **Reusability**: Extract common patterns into reusable components
- **Import Organization**: Use index files for clean imports
- **Consistent Naming**: Follow established naming conventions