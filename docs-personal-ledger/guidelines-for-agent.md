Before generating or modifying any code, read and understand all documentation in the docs/ directory.

The repository contains the following design documents:

docs/architecture.md
docs/database-schema.md
docs/api-spec.md
docs/project-setup.md
docs/future-features.md

Treat these documents as the source of truth for system design decisions.

You must follow their architecture and constraints when generating code.

--------------------------------------------------

Engineering Standards

Follow production-quality engineering practices for Node.js (TypeScript) backend and React frontend.

Adhere to the following principles:

1. Clean System Design
- Follow separation of concerns
- Keep business logic separate from transport layers
- Avoid tightly coupled modules
- Design code that is maintainable and testable

2. Modular Programming
- Organize code by domain modules
- Avoid large files with mixed responsibilities
- Extract reusable utilities where appropriate

3. MVP (Model–View–Presenter / layered architecture approach)
Backend:
- Lambda handlers = request layer
- Services = business logic
- Models = data representation

Frontend:
- Pages = route-level UI
- Components = reusable UI elements
- Services = API communication layer

4. Production-Friendly Node.js (TypeScript) Practices
- Avoid monolithic files
- Use environment configuration via .env
- Use async/await consistently
- Implement structured error handling
- Avoid duplicated logic across lambdas

5. React Best Practices
- Functional components only
- Use hooks instead of class components
- Keep components small and composable
- Separate UI logic from API logic

6. File and Code Quality
- Use consistent naming conventions
- Use clear folder boundaries
- Add comments where architectural decisions are important
- Ensure the project can scale beyond MVP

--------------------------------------------------

Goal

The generated code should represent a clean, scalable foundation for the project, not just a quick prototype.

After understanding these instructions and the documentation, proceed to implement the project scaffolding.