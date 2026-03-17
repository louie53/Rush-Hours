# Rush-Hours

This is a MERN stack application built with React, Vite, Node.js, Express, and MongoDB.

## Git Branching Strategy & Workflow

This project follows a structured Git workflow for team collaboration.

### Core Branches
- `main`: Production-ready code. Never commit directly to main.
- `release`: Pre-production. Used for final testing and versioning before merging to main.
- `testing`: QA/User Acceptance Testing. Deployed to staging for testing.
- `develop`: Integration branch. All completed features are merged here.

### Daily Development Workflow (For Team Members)

**1. Update your local `develop` branch before starting work:**
```bash
git checkout develop
git pull origin develop
```

**2. Create a new branch for your feature or bugfix:**
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b bugfix/your-bugfix-name
```

**3. Write code, commit, and push your branch:**
```bash
git add .
git commit -m "Description of what you did"
git push -u origin feature/your-feature-name
```

**4. Create a Pull Request (PR):**
- Go to the GitHub repository page.
- Create a PR from your feature branch to the `develop` branch.
- **Never PR directly to `main`!**
- Have a teammate review your PR before merging.
