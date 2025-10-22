# Contributing to react-google-gtm

Thank you for your interest in contributing to react-google-gtm! We welcome contributions from the community.

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher
- Git

### Development Setup

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/your-username/react-google-gtm.git
cd react-google-gtm
```

3. Install dependencies:

```bash
npm install
```

4. Create a new branch for your feature or bugfix:

```bash
git checkout -b feature/your-feature-name
```

## Development Workflow

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Linting

```bash
# Run ESLint
npm run lint

# Auto-fix linting issues
npm run lint -- --fix
```

### Formatting

```bash
# Format code with Prettier
npm run format
```

### Building

```bash
# Build the project
npm run build
```

The build outputs both CommonJS and ESM modules to the `dist` directory.

### Type Checking

```bash
# Run TypeScript compiler without emitting files
npx tsc --noEmit
```

## Code Standards

### TypeScript

- Use TypeScript for all new code
- Provide proper type definitions
- Avoid using `any` where possible
- Export all public interfaces and types

### React

- Use functional components with hooks
- Follow React best practices
- Ensure components are properly typed

### Testing

- Write tests for all new features
- Maintain or improve code coverage
- Test both happy paths and error cases
- Use descriptive test names

Example test structure:

```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    // Setup
  });

  it('should do something specific', () => {
    // Test implementation
  });
});
```

### Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `test:` Adding or updating tests
- `refactor:` Code refactoring
- `style:` Code style changes (formatting, etc.)
- `chore:` Maintenance tasks

Examples:

```
feat: add support for custom dataLayer names
fix: prevent script duplication on re-render
docs: update README with Next.js examples
test: add tests for GTM environment parameters
```

## Pull Request Process

1. **Update documentation**: If you're adding a new feature, update the README.md

2. **Add tests**: Ensure your changes are covered by tests

3. **Run the test suite**: Make sure all tests pass

```bash
npm test
npm run lint
npm run build
```

4. **Update TypeScript types**: Export any new public interfaces

5. **Create a pull request**:
   - Use a clear, descriptive title
   - Reference any related issues
   - Describe your changes in detail
   - Include screenshots for UI changes (if applicable)

6. **Code review**: Address any feedback from maintainers

7. **Merge**: Once approved, a maintainer will merge your PR

## Project Structure

```
react-google-gtm/
├── src/
│   ├── __tests__/          # Test files
│   ├── utils/              # Utility functions
│   ├── GoogleTagManager.tsx # Main component
│   ├── NoScript.tsx        # NoScript component
│   └── sendGTMEvent.ts     # Event sending logic
├── dist/                   # Build output (generated)
├── index.ts               # Package entry point
├── global.d.ts            # Global type definitions
├── tsconfig.json          # TypeScript configuration
├── jest.config.js         # Jest configuration
├── .eslintrc.js          # ESLint configuration
└── .prettierrc           # Prettier configuration
```

## Reporting Bugs

When reporting bugs, please include:

1. **Description**: Clear description of the issue
2. **Steps to reproduce**: Minimal steps to reproduce the behavior
3. **Expected behavior**: What you expected to happen
4. **Actual behavior**: What actually happened
5. **Environment**:
   - react-google-gtm version
   - React version
   - Node.js version
   - Browser (if applicable)
6. **Code sample**: Minimal code to reproduce the issue

## Feature Requests

We welcome feature requests! When proposing a new feature:

1. Check if the feature has already been requested
2. Clearly describe the use case
3. Explain how it would benefit users
4. Consider implementation details (if applicable)

## Questions?

If you have questions about contributing:

1. Check existing issues and pull requests
2. Read the documentation
3. Open a new issue with the "question" label

## Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

Examples of unacceptable behavior:

- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by opening an issue or contacting the project maintainers. All complaints will be reviewed and investigated promptly and fairly.

## License

By contributing to react-google-gtm, you agree that your contributions will be licensed under the MIT License.

## Thank You!

Your contributions make this project better. We appreciate your time and effort!
