# @remino/reslib

This repository now hosts a full TypeScript monorepo for the Rémino Site Library.
Every utility lives in its own publishable package under `packages/`, and the
`@remino/reslib` package aggregates the most common exports for convenience.

## Packages

- `@remino/reslib` – umbrella package (this repo) that re-exports the other libs
- `@remino/functions` – single entrypoint for everyday helpers (dig/undig, logger, js-class toggles, lazyload-images, store/template/url helpers, etc.)
- `@remino/postcss-plugins` – bundle of PostCSS helpers (dvh/lvh/variation)
- `@remino/remark-figure-paragraphs` – remark figure helper
- `@remino/remark-video-directive` – remark directive handler
- `@remino/rehype-back-to-top-nav` – rehype “back to top” helper
- `@remino/scroll` – scroll/section controls

See the individual package READMEs/entry files for details on usage.

## Development

```bash
npm install            # install deps across the workspace
npm run build          # builds each package in dependency order
npm test               # runs the Vitest suite for every package
npm run lint           # eslint across the repo
npm run format         # run prettier
```

Each package can also be built in isolation via `npm run build --workspace <name>`
when preparing a release.

## Deploy / Publish

1. Add a Changeset for any user-facing package change:

	```bash
	npm run changeset
	```

2. Verify the workspace:

	```bash
	npm test
	npm run build
	```

3. Apply version bumps, rebuild packages, and refresh `package-lock.json`:

	```bash
	npm run release
	```

4. Commit the source changes, generated version changes, and lockfile update.

5. Publish packages to npm:

	```bash
	npm run publish:packages
	```
