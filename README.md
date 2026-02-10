# FE Base Project

Base frontend project với Next.js 15, TypeScript, Tailwind CSS, Ant Design và các công cụ phát triển hiện đại.

## 🚀 Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS + SCSS
- **UI Library**: Ant Design
- **State Management**: React Query (TanStack Query)
- **Form Handling**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Date Handling**: Day.js
- **Utilities**: Lodash, clsx

## 🛠️ Dev Tools

- **Linting**: ESLint
- **Formatting**: Prettier
- **Git Hooks**: Husky + lint-staged
- **Type Checking**: TypeScript

## 📦 Installation

```bash
# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

## 🏃 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check

# Type check
npm run type-check
```

## 📁 Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
├── hooks/           # Custom React hooks
├── utils/           # Utility functions
├── types/           # TypeScript type definitions
├── constants/       # App constants
├── apis/            # API functions
├── stores/          # State management
├── providers/       # React providers
└── styles/          # Global styles (SCSS)
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Path Aliases

The project uses TypeScript path aliases configured in `tsconfig.json`:

- `@/*` - src directory
- `@/components/*` - components
- `@/utils/*` - utilities
- `@/types/*` - types
- `@/hooks/*` - hooks
- `@/apis/*` - API functions
- `@/stores/*` - stores
- `@/constants/*` - constants

## 📝 Git Hooks

Husky is configured to run lint-staged on pre-commit, which will:

- Run ESLint and fix issues
- Format code with Prettier

## 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework
- **SCSS**: For custom styles and variables
- **Ant Design**: Component library with theme customization

## 📚 Additional Libraries

- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form handling
- **zod**: Schema validation
- **axios**: HTTP client
- **dayjs**: Date manipulation
- **lodash**: Utility functions
- **clsx**: Conditional class names
- **react-hot-toast**: Toast notifications

## 🔐 Best Practices

1. Use TypeScript for type safety
2. Follow ESLint and Prettier rules
3. Use path aliases for imports
4. Keep components small and reusable
5. Use React Query for server state
6. Validate forms with Zod schemas

## 📄 License

MIT
