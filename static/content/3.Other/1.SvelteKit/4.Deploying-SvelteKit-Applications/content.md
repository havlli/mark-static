# Deploying SvelteKit Applications

This guide covers the deployment process for SvelteKit applications, including static hosting and server-side deployment options.

## Static Site Deployment

If you are using the `@sveltejs/adapter-static`, you can deploy your application to any static hosting service.

### Vercel

1. **Login with the Vercel CLI**:

   ```bash
   pnpm dlx vercel login
   ```

2. **Deploy**:

   ```bash
   pnpm dlx vercel
   ```

### Netlify

1. **Login to Netlify**:

   ```bash
   pnpm dlx netlify-cli login
   ```

2. **Deploy**:

   ```bash
   pnpm dlx netlify-cli deploy --prod
   ```

### GitHub Pages

For a repository page, configure a base path and publish the static `build` directory:

```bash
BASE_PATH=/my-repo pnpm build
```

## Server-Side Deployment

For server-side deployment, you need a suitable adapter like `@sveltejs/adapter-node`.

### Node.js Server

1. **Install Node adapter**:

   ```bash
   pnpm add -D @sveltejs/adapter-node
   ```

2. **Configure SvelteKit**:

   Update `svelte.config.js`:

   ```js
   import adapter from '@sveltejs/adapter-node';

   export default {
    kit: {
      adapter: adapter()
    }
   };
   ```

3. **Build and Start**:

   ```bash
   pnpm build
   node build
   ```

### Docker

1. **Create a Dockerfile**:

   ```Dockerfile
   FROM node:22-alpine

   WORKDIR /app

   RUN corepack enable

   COPY package.json pnpm-lock.yaml ./
   RUN pnpm install --frozen-lockfile

   COPY . .

   RUN pnpm build

   EXPOSE 3000
   CMD ["node", "build"]
   ```

2. **Build Docker Image**:

   ```bash
   docker build -t sveltekit-app .
   ```

3. **Run Docker Container**:

   ```bash
   docker run -p 3000:3000 sveltekit-app
   ```

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [SvelteKit Documentation](https://svelte.dev/docs/kit)
- [Docker Documentation](https://docs.docker.com/)

These steps should help you deploy your SvelteKit applications effectively.
