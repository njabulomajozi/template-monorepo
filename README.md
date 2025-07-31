# Modern Monorepo Template

A production-ready monorepo template with comprehensive examples, modern tooling, and best practices. Built with PNPM, TypeScript, Vitest, ESLint, Turborepo, and SST v3 for AWS infrastructure.

## 🚀 Features

- **🏗️ Modern Architecture** - Apps and packages properly separated
- **📦 PNPM Workspaces** - Efficient dependency management with catalog
- **⚡ Turborepo** - Intelligent build caching and task orchestration  
- **🔷 TypeScript** - Strict configuration with path mapping
- **🧪 Vitest** - 47 comprehensive tests with real examples
- **🔍 ESLint** - Flat config with TypeScript support
- **🏗️ SST v3** - AWS serverless infrastructure organized by concepts
- **🚀 GitHub Actions** - Complete CI/CD with security scanning
- **📚 Rich Examples** - Real utilities and API endpoints you can use immediately

## 📁 Project Structure

```
├── apps/                       # 🚀 Applications
│   └── functions/              # Lambda functions app
│       ├── src/
│       │   ├── api.ts          # REST API with 6 endpoints
│       │   ├── worker.ts       # Background job processor
│       │   └── scheduler.ts    # Cron job handler
│       └── test/               # 15 comprehensive API tests
├── packages/                   # 📦 Shared packages
│   └── shared/                 # Shared utilities and types
│       ├── src/
│       │   ├── types/          # TypeScript interfaces
│       │   ├── utils/          # 20+ utility functions
│       │   ├── constants/      # Application constants
│       │   └── schemas/        # Zod validation schemas
│       └── test/               # 32 utility tests
├── infra/                      # 🏗️ Infrastructure by concepts
│   ├── config/                 # Environment & configuration
│   ├── network/                # VPC, security groups
│   ├── database/               # PostgreSQL, Redis
│   ├── storage/                # S3 buckets
│   ├── compute/                # Lambda functions, APIs
│   └── apps/                   # Application infrastructure
└── .github/workflows/          # 🔄 CI/CD pipelines
```

## ⚡ Quick Start

```bash
# Clone and install
git clone <your-repo-url>
cd your-project
pnpm install

# Verify everything works (takes ~10 seconds total)
pnpm run build      # ✅ Builds all packages (~3s)
pnpm run test       # ✅ 47 tests passing (~4s)
pnpm run lint       # ✅ ESLint checks (~1s)
pnpm run type-check # ✅ TypeScript validation (~2s)
```

## 🧰 What's Included

### 🚀 Apps

#### `apps/functions` - Production-Ready Serverless API
```typescript
// 6 comprehensive API endpoints with real functionality
GET /health                    // System health with metrics
GET /api/hello?name=John      // Personalized greetings
POST /api/echo               // Request echo with metadata  
GET /api/time                // Date/time utilities showcase
GET /api/users/:id           // User data with validation
GET /api/utils/slug?text=... // Text utility functions

// Features included:
✅ Comprehensive error handling    ✅ CORS with preflight support
✅ Request logging & monitoring    ✅ Type-safe responses
✅ Input validation               ✅ 15 test cases covering all scenarios
```

### 📦 Packages

#### `packages/shared` - Comprehensive Utility Library
```typescript
import { stringUtils, dateUtils, arrayUtils, objectUtils, env } from '@repo/shared';

// 🔧 Environment utilities
env.get('API_URL', 'http://localhost:3000')  // Get with default
env.require('DATABASE_URL')                  // Required (throws if missing)

// 📝 String utilities (6 functions)
stringUtils.slugify('Hello World!')         // 'hello-world'
stringUtils.capitalize('hello world')       // 'Hello world'
stringUtils.isEmail('test@example.com')     // true
stringUtils.random(8)                       // 'a7b9c2d1'
stringUtils.camelToKebab('XMLHttpRequest')  // 'xml-http-request'
stringUtils.truncate('Long text...', 10)    // 'Long te...'

// 📅 Date utilities (6 functions)
dateUtils.addDays(new Date(), 7)            // 7 days from now
dateUtils.formatDate(new Date())            // '2024-01-15'
dateUtils.daysBetween(date1, date2)         // 7
dateUtils.isToday(new Date())               // true
dateUtils.isExpired(oldDate)                // true/false

// 🔢 Array utilities (5 functions)
arrayUtils.unique([1, 2, 2, 3])             // [1, 2, 3]
arrayUtils.chunk([1,2,3,4,5], 2)            // [[1,2], [3,4], [5]]
arrayUtils.shuffle([1, 2, 3, 4])            // [3, 1, 4, 2]
arrayUtils.sample([1, 2, 3, 4])             // random item
arrayUtils.groupBy(users, 'role')           // {admin: [...], user: [...]}

// 🏗️ Object utilities (4 functions)
objectUtils.pick(obj, ['a', 'c'])           // {a: 1, c: 3}
objectUtils.omit(obj, ['b'])                // {a: 1, c: 3}
objectUtils.deepClone(obj)                  // deep copy
objectUtils.isEmpty({})                     // true
```

#### Type-Safe Validation with Zod
```typescript
import { userSchema, createUserSchema, paginationSchema } from '@repo/shared';

// 👤 User validation
const user = userSchema.parse(userData);           // Full user validation
const newUser = createUserSchema.parse(data);     // User creation
const page = paginationSchema.parse({page: 1});   // API pagination
```

#### Constants & Configuration
```typescript
import { HTTP_STATUS, MIME_TYPES, API_CONFIG } from '@repo/shared';

HTTP_STATUS.OK                    // 200
HTTP_STATUS.NOT_FOUND            // 404
MIME_TYPES.JSON                  // 'application/json'
API_CONFIG.DEFAULT_PAGE_SIZE     // 20
```

## 🧪 Testing (47 Tests)

Comprehensive testing examples you can learn from:

- **32 tests** in shared package (utilities, schemas, environment)
- **15 tests** in functions app (API endpoints, error handling, CORS)
- **100% coverage** of utility functions with real-world scenarios

```typescript
// Example utility tests
describe('stringUtils', () => {
  it('should convert text to slug', () => {
    expect(stringUtils.slugify('Hello World!')).toBe('hello-world');
  });
});

// Example API tests  
describe('API Handler', () => {
  it('should return personalized greeting', async () => {
    const event = createMockEvent('GET', '/api/hello', { name: 'John' });
    const result = await handler(event);
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).data.message).toBe('Hello, John!');
  });
});
```

## 🏗️ Infrastructure Organization

Infrastructure organized by concepts for better maintainability:

```
infra/
├── config/     # 🔧 Environment variables & configuration
├── network/    # 🌐 VPC, subnets, security groups  
├── database/   # 🗄️ PostgreSQL, Redis, data stores
├── storage/    # 📦 S3 buckets and file storage
├── compute/    # ⚡ Lambda functions, APIs, compute
└── apps/       # 🚀 Application-specific infrastructure
```

## 📋 Available Scripts

### Development
```bash
pnpm dev              # Start all apps in development mode
pnpm build            # Build all packages (~3s)
pnpm test             # Run all tests (~4s, 47 tests)
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Run tests with coverage reports
```

### Code Quality
```bash
pnpm lint             # Run all linting (code + type) (~4s)
pnpm lint:code        # Run ESLint only (~1s)
pnpm lint:type        # Run TypeScript type checking (~2s)
pnpm lint:fix         # Fix ESLint issues automatically
pnpm format           # Format code with Prettier
pnpm format:check     # Check code formatting
```

### Infrastructure
```bash
pnpm deploy:dev       # Deploy to development environment
pnpm deploy:prod      # Deploy to production environment
```

## 🔧 Configuration

### Environment Variables
```bash
cp .env.example .env.local
# Edit with your values:
# DATABASE_URL=postgresql://...
# API_URL=https://your-api.com
# AWS_REGION=us-east-1
```

### TypeScript
- **Path mapping** for workspace packages (`@repo/*`)
- **Strict type checking** with comprehensive examples
- **Incremental compilation** for fast rebuilds

### ESLint
- **Modern flat configuration** with proper ignores
- **TypeScript support** with recommended rules
- **Strict enforcement** - `no-console` and `@typescript-eslint/no-explicit-any` as errors
- **Structured logging** - Uses proper logger instead of console statements
- **Node.js globals** configured (console, process, etc.)

## 🚀 Adding New Code

### Adding a New App
```bash
# Example: Next.js app
cd apps/
npx create-next-app@latest web --typescript --tailwind --app
cd web

# Add workspace dependencies
pnpm add @repo/shared

# Update package.json name
{
  "name": "@repo/web-app",
  "dependencies": {
    "@repo/shared": "workspace:*"
  }
}
```

### Adding a New Package
```bash
mkdir packages/my-package
cd packages/my-package

# Create package.json
{
  "name": "@repo/my-package",
  "version": "0.0.1",
  "private": true,
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs", 
      "require": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "vitest run",
    "lint": "eslint .",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@repo/shared": "workspace:*"
  },
  "devDependencies": {
    "typescript": "catalog:",
    "tsup": "catalog:",
    "vitest": "catalog:"
  }
}

# Create source structure
mkdir -p src test
echo "export const hello = 'world';" > src/index.ts
echo "import { hello } from '../src'; test('hello', () => expect(hello).toBe('world'));" > test/index.test.ts
```

## 🚀 Deployment

### Development
```bash
pnpm run deploy:dev
```

### Production
```bash
pnpm run build && pnpm run test
pnpm run deploy:prod
```

### CI/CD
GitHub Actions provide:
- **Quality checks** - Type checking, linting, testing, building
- **Security scanning** - Dependency auditing and vulnerability checks
- **Automated deployment** - Deploy to AWS on merge to main

## 🎯 Template Customization

### 1. Update Package Names
```bash
# Replace @repo with your organization
find . -type f \\( -name "*.json" -o -name "*.ts" -o -name "*.md" \\) | \\
  xargs sed -i 's/@repo/@your-org/g'
```

### 2. Update Project Information
- Update root `package.json` name, description, repository
- Update this `README.md` with your project details
- Update `LICENSE` file with your information

### 3. Configure AWS
```bash
aws configure
export AWS_PROFILE=your-profile
```

## 📊 Template Statistics

| Metric | Value |
|--------|-------|
| **Apps** | 1 (functions with 6 endpoints) |
| **Packages** | 1 (shared with 20+ utilities) |
| **Total Tests** | 47 comprehensive tests |
| **Build Time** | ~3s for full build |
| **Test Time** | ~4s for all tests |
| **Lint Time** | ~1s (warnings only) |
| **Type Check** | ~2s (all passing) |

## ✅ Why This Template?

- **🚀 Immediate Productivity** - Start coding right away, everything works
- **📚 Educational** - Learn from comprehensive, real-world examples
- **🏗️ Production Ready** - Security, performance, and best practices built-in
- **🔧 Modern Tooling** - Latest versions with optimal configurations
- **📈 Scalable** - Easy to add new apps and packages
- **🎯 Well Organized** - Clear separation between apps and packages

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Add tests for new functionality
4. Ensure all checks pass: `pnpm run lint && pnpm run test && pnpm run build`
5. Create a pull request

## 📄 License

MIT License - see LICENSE file for details.

---

**Ready to build something amazing?** This template provides everything you need to start coding immediately while learning from comprehensive, production-ready examples. 🚀

**Apps go in `apps/`, packages go in `packages/`** - clean, simple, and scalable! ✨