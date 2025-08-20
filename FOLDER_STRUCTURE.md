# LetterBuddy Folder Structure

This document outlines the recommended folder structure for the LetterBuddy Next.js application.

## 📁 Root Structure

```
letterbuddy/
├── src/                    # Source code
├── public/                 # Static assets
├── package.json           # Dependencies and scripts
├── next.config.mjs        # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── README.md              # Project documentation
```

## 🗂️ Source Code Organization (`src/`)

### `/app` - Next.js App Router
- **`layout.js`** - Root layout component
- **`page.js`** - Home page route (imports from home.js)
- **`home.js`** - Home page component
- **`globals.css`** - Global styles
- **`(routes)/`** - Route groups (optional)
  - `(auth)/` - Authentication pages
    - `login/` - Login route
      - `page.js` - Login route (imports from login.js)
      - `login.js` - Login page component
    - `signup/` - Signup route
      - `page.js` - Signup route (imports from signup.js)
      - `signup.js` - Signup page component
  - `(dashboard)/` - Dashboard pages
    - `dashboard/` - Dashboard route
      - `page.js` - Dashboard route (imports from dashboard.js)
      - `dashboard.js` - Dashboard page component
- **`api/`** - API routes

### `/components` - Reusable Components

#### `/ui` - Basic UI Components
- **`Button.js`** - Reusable button component
- **`Input.js`** - Reusable input component
- **`Card.js`** - Reusable card component
- **`index.js`** - Barrel exports for easy importing

#### `/forms` - Form Components
- **`LetterForm.js`** - Letter creation/editing form
- **`index.js`** - Barrel exports

#### `/layout` - Layout Components
- **`Header.js`** - Site header/navigation
- **`Footer.js`** - Site footer
- **`index.js`** - Barrel exports

#### `/features` - Feature-Specific Components
- **`LetterEditor.js`** - Letter editing interface
- **`index.js`** - Barrel exports

### `/lib` - Utility Functions & Configuration
- **`utils.js`** - Common utility functions
- **`constants.js`** - Application constants
- **`index.js`** - Barrel exports

### `/hooks` - Custom React Hooks
- **`useLocalStorage.js`** - Local storage management hook
- **`index.js`** - Barrel exports

### `/context` - React Context Providers
- **`AuthContext.js`** - Authentication state management
- **`index.js`** - Barrel exports

### `/types` - Type Definitions
- For TypeScript interfaces and types (when migrating to TS)

### `/styles` - Additional Styles
- Component-specific CSS files

## 🚀 Best Practices

### 1. **Component Organization**
- Keep components small and focused
- Use descriptive names that reflect their purpose
- Group related components in feature folders

### 2. **Page Naming Convention**
- **`page.js`** - Next.js route files (thin wrappers)
- **`componentName.js`** - Actual page components (e.g., `home.js`, `login.js`)
- This separation allows for better organization and reusability

### 3. **Import/Export Strategy**
- Use barrel exports (`index.js` files) for clean imports
- Import from specific files for tree-shaking benefits
- Example: `import { Button } from '@/components/ui'`

### 4. **File Naming**
- Use PascalCase for component files: `LetterEditor.js`
- Use camelCase for utility files: `useLocalStorage.js`
- Use kebab-case for CSS files: `component-styles.css`

### 5. **Component Structure**
- Place business logic in custom hooks
- Keep components focused on presentation
- Use context for global state management

### 6. **Code Organization**
- Keep related functionality together
- Separate concerns (UI, logic, data)
- Use consistent patterns across similar components

## 📝 Usage Examples

### Importing Components
```javascript
// From barrel exports
import { Button, Input, Card } from '@/components/ui';
import { Header, Footer } from '@/components/layout';
import { LetterForm } from '@/components/forms';

// From specific files
import Button from '@/components/ui/Button';
```

### Using Utilities
```javascript
import { formatDate, generateId } from '@/lib';
import { useLocalStorage } from '@/hooks';
import { useAuth } from '@/context';
```

## 🔄 Migration Path

1. **Start with basic structure** (current state)
2. **Add components as needed** in appropriate folders
3. **Refactor existing code** to fit the new structure
4. **Add TypeScript** when ready (move `.js` to `.tsx`)
5. **Add testing** with `__tests__` folders or separate test directory

## 📚 Additional Resources

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [React Component Patterns](https://react.dev/learn)
- [Tailwind CSS Best Practices](https://tailwindcss.com/docs)
