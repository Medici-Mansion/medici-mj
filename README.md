```
npx github-label-sync --access-token <TOKEN> --labels ./label.json <REPOSITORY_NAME>
```
# Elysia with Bun runtime

## Getting Started
To get started with this template, simply paste this command into your terminal:
```bash
bun create elysia ./elysia-example
```

## Development
To start the development server run:
```bash
bun run dev
```

Open http://localhost:3000/ with your browser to see the result.

```
docker buildx build --platform linux/amd64 -t medici-mj:1.0.6 .
gcloud builds submit --tag  asia-northeast1-docker.pkg.dev/premium-archery-400204/medici/medici-mj:1.0.6
```