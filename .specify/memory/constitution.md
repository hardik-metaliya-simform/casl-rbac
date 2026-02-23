<!--
RBAC Backend Constitution
Version: 1.0.0
Ratified: 2026-02-20

Defines core principles and project setup for the RBAC backend.
-->

# RBAC Backend Constitution

**Version**: 1.0.0 | **Ratified**: 2026-02-20 | **Last Amended**: 2026-02-20

---

## Specify Project Initialization

To initialize Specify for this project, run from the project root:

```
uvx --from git+https://github.com/github/spec-kit.git specify init rbac
```

This command bootstraps Specify using the official spec-kit template for the rbac project.

---

## Core Principles

### I. Modular NestJS Architecture

**Folder boundaries MUST be strictly enforced:**

- `src/modules/` - Feature modules only (auth, user, etc.). Each module MUST have: `module.ts`, `controller.ts`, `service.ts`, `dto/` folder
- `src/core/` - Framework-level concerns: guards, interceptors, middleware, base classes, shared interfaces
- `src/common/` - Business-agnostic utilities: constants, messages, decorators, shared DTOs, utility services
- `src/database/` - Prisma client, schema, migrations, seed scripts only
- `src/config/` - Configuration files using `@nestjs/config` pattern

**NO business logic in `core/` or `common/`; NO framework setup in `modules/`**

**Rationale**: Strict boundaries prevent tight coupling, enable independent testing, and make the system maintainable as it scales.


### Make sure you are following the ts standard and dto every e