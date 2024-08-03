# Deploying SvelteKit Applications

This guide covers the deployment process for SvelteKit applications, including static hosting and server-side deployment options.

## Static Site Deployment

If you are using the `@sveltejs/adapter-static`, you can deploy your application to any static hosting service.

### Vercel

1. **Install Vercel CLI**:

    ```bash
    npm install -g vercel
    ```

2. **Login to Vercel**:

    ```bash
    vercel login
    ```

3. **Deploy**:

    ```bash
    vercel
    ```

### Netlify

1. **Install Netlify CLI**:

    ```bash
    npm install -g netlify-cli
    ```

2. **Login to Netlify**:

    ```bash
    netlify login
    ```

3. **Deploy**:

    ```bash
    netlify deploy --prod
    ```

## Server-Side Deployment

For server-side deployment, you need a suitable adapter like `@sveltejs/adapter-node`.

### Node.js Server

1. **Install Node adapter**:

    ```bash
    npm install @sveltejs/adapter-node
    ```

2. **Configure SvelteKit**:

   Update `svelte.config.js`:

    ```js
    import adapter from '@sveltejs/adapter-node';

    export default {
      kit: {
        adapter: adapter(),
        target: '#svelte'
      }
    };
    ```

3. **Build and Start**:

    ```bash
    npm run build
    node build
    ```

### Docker

1. **Create a Dockerfile**:

    ```Dockerfile
    FROM node:16

    WORKDIR /app

    COPY package*.json ./
    RUN npm install

    COPY . .

    RUN npm run build

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
- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [Docker Documentation](https://docs.docker.com/)

These steps should help you deploy your SvelteKit applications effectively.
