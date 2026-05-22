# Getting Started

Welcome to the SvelteKit guide! This guide will help you get started with building web applications using SvelteKit.

## Prerequisites

Before you begin, make sure you have the following installed:

- Node.js
- pnpm

## Setting Up Your SvelteKit Project

1. **Create a new SvelteKit project**:

   ```bash
   pnpm create svelte@latest my-svelte-project
   cd my-svelte-project
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Start the development server**:

   ```bash
   pnpm dev -- --open
   ```

## Project Structure

Your SvelteKit project will have the following structure:

- `src/`: Contains the source code for your application.
- `static/`: Contains static assets like images and fonts.
- `src/routes/`: Contains the pages, layouts, server load functions, and endpoints for your application.
- `src/lib/`: Contains reusable components and shared code.

## Creating Your First Page

1. **Create a new file** `src/routes/+page.svelte`:

   ```svelte
   <script>
   	let name = 'world';
   </script>

   <h1>Hello {name}!</h1>

   <style>
   	h1 {
   		color: purple;
   	}
   </style>
   ```

2. **Open your browser** and navigate to `http://localhost:5173`. You should see "Hello world!".

Congratulations! You have created your first SvelteKit page. Explore the documentation to learn more about building web applications with SvelteKit.
