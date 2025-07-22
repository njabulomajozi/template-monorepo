# repo

*.....*

....

---

## 🚀 Requirements

* **Node.js**: v22.0.0+ required
* **PNPM**: v10.13.1+ ([Installation Guide](https://pnpm.io/installation))
* **Docker**: For local PostgreSQL development
* **AWS CLI**: [Session activated](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html) for AWS deployments

---

## 🛠 Setup

```bash
# Install all dependencies across the monorepo
pnpm install
```

### Development Setup

For local development, you need to run the following commands in **3 separate terminal instances** in this exact order:

**Terminal 1 - Start PostgreSQL:**
```bash
docker run \
  --rm \
  -p 5432:5432 \
  -v $(pwd)/.sst/storage/postgres:/var/lib/postgresql/data \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=local \
  postgres:16.4
```

**Terminal 2 - Start Next.js dev server:**
```bash
pnpm dev
```

**Terminal 3 - Deploy SST stack:**
```bash
pnpm deploy:dev
```

### Database Operations

```bash
# Generate database migrations
pnpm --filter @repo/db db:generate

# Run migrations
pnpm --filter @repo/db db:migrate

# Open Drizzle Studio
pnpm --filter @repo/db db:studio
```

### Build & Test Commands

```bash
# Build all packages
pnpm build

# Run tests across all packages
pnpm test

# Run linting
pnpm lint

# Clean build artifacts
pnpm clean
```

### Production Deployments

```bash
pnpm deploy:dev     # Development environment
pnpm deploy:test    # Staging environment
pnpm deploy:prod    # Production environment

# Clean up deployments
pnpm deploy:dev:clean
pnpm deploy:prod:clean
```

---

## ⚙️ Core Features

### PLACEHOLDER
- **PLACEHOLDER**: PLACEHOLDER


---

## 🧱 Architecture & Technology

### Monorepo Structure
- **`/apps`**: Applications (web-app, functions)
- **`/packages`**: Shared packages (shared, core, ai)
- **`/libs`**: Internal libraries (db, ui)
- **`/infra`**: SST infrastructure definitions

### Frontend Stack
- **Framework**: Next.js 15.3.5 with React 19 and App Router
- **Styling**: Tailwind CSS v4 + Shadcn UI components
- **State Management**: React Context, useState, TanStack React Query
- **Forms**: React Hook Form with Zod validation
- **Caching**: IndexedDB for client-side persistence
- **Icons**: ...

### Backend Stack
- **API Framework**: Hono (lightweight, fast web framework)
- **Database**: PostgreSQL (AWS RDS) + DocumentDB (MongoDB compatibility)
- **ORM**: Drizzle ORM for PostgreSQL schemas
- **Authentication**: Better Auth with email OTP
- **Caching**: Redis (AWS ElastiCache)
- **Observability**: OpenTelemetry integration with Winston logging

### Infrastructure & Deployment
- **Infrastructure as Code**: SST (Serverless Stack) v3.17.10
- **Cloud Platform**: AWS (primary), with multi-cloud support planned
- **Serverless**: AWS Lambda + API Gateway
- **Build System**: Turbo (monorepo orchestration) + tsup
- **Package Manager**: PNPM with workspace configuration

---

## 📈 Roadmap

...

---

### 🤝 How to Contribute

1. **Check Current Phase**
2. **Review Issues**: Look for `good-first-issue` and `help-wanted` labels  
3. **Follow Standards**: See `.kiro/steering/coding-standards.md` for guidelines
4. **Submit PRs**: Include tests and documentation updates

**Questions?** Open an issue or reach out to the maintainers!