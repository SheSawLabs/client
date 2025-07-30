# Shesaw

A modern Next.js project with shadcn/ui, Tailwind CSS, and React Query.

## Package Manager

This project uses **pnpm** as the package manager. Please use pnpm for all package management operations.

## Getting Started

First, install dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

### Core Framework

- **Next.js 13** - React framework with App Router
- **TypeScript** - Type safety
- **React 18** - UI library

### State Management

- **React Query (@tanstack/react-query)** - Server state management
- **React Hook Form** - Form state management

### Styling & UI

- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern component library
- **PostCSS** - CSS post-processing
- **SCSS** - Sass preprocessing (legacy styles)

### Utility Libraries

- **clsx** - Conditional class name utility
- **tailwind-merge** - Tailwind class merging utility
- **class-variance-authority** - Component variant management

### Development Tools

- **ESLint 9** - Linting with flat config
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **lint-staged** - Pre-commit linting

## Project Structure

```
├── app/           # Next.js App Router pages
├── components/    # Reusable components
│   └── ui/        # shadcn/ui components
├── hooks/         # Custom hooks
├── lib/           # Utility libraries
├── styles/        # Global styles and SCSS utilities (legacy)
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
    └── cn.ts      # Class name utility (shadcn/ui)
```

## Features

- ✅ Next.js 13 with App Router
- ✅ TypeScript support
- ✅ shadcn/ui component library
- ✅ Tailwind CSS utility classes
- ✅ React Query for server state management
- ✅ React Hook Form for form handling
- ✅ ESLint 9 with flat config
- ✅ Husky git hooks with lint-staged
- ✅ SVG loader configuration

## Commands

```bash
# Development
pnpm run dev          # Start development server
pnpm run build        # Build for production
pnpm run start        # Start production server

# Code Quality
pnpm run lint         # Run ESLint
pnpm run lint:fix     # Fix ESLint issues
pnpm run format       # Format code with Prettier

# shadcn/ui
pnpm dlx shadcn@latest add [component]  # Add shadcn/ui components
```
