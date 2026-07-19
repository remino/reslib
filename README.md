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
- `@remino/swup-html-class-plugin` – swup plugin for syncing filtered next-page classes onto `<html>`

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

## Deploy / Publish a New Version

This repo uses Changesets for packages under `packages/*`. The root
`@remino/reslib` package is not part of the Changesets workspace, so do not add
it to changeset files unless the workspace config is changed first.

`npm run release` prepares package versions locally and commits the generated
version changes. It does not publish anything. `npm run publish:packages` is the
explicit npm publish step, and Changesets will publish the bumped workspace
packages that are not already on npm.

1. Make the code/docs change and commit it with a changeset:

	```bash
	npm test
	npm run build
	npm run changeset
	git add .
	git commit -m "Describe the package change"
	```

	The changeset should name the package under `packages/*`, for example:

	```md
	---
	'@remino/functions': minor
	---

	Add copy-buttons
	```

2. Before versioning, confirm Changesets sees the package that should publish:

	```bash
	npx changeset status --verbose
	```

	For a functions release, the output must include something like:

	```text
	Packages to be bumped at minor
	- @remino/functions 1.2.0
	```

3. Apply the version bump, rebuild, and auto-commit the release changes:

	```bash
	npm run release
	```

	This consumes the changeset, updates package versions, rebuilds packages, and
	commits those generated release changes automatically.

4. Verify package versions:

	```bash
	npm run version:list
	```

5. Publish the bumped packages:

	```bash
	npm run publish:packages
	```

	Do not run `npm publish --workspace ...` unless `changeset publish` fails and
	you intentionally want to bypass Changesets.

6. Push the release commit and package tags:

	```bash
	git push --follow-tags
	```
