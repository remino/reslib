# @remino/swup-html-class-plugin

A small `swup` plugin that copies selected classes from the next page's
`<html>` element onto the current page's `<html>` element during
`content:replace`.

This is useful when you want page-level state classes on `<html>` instead of
`<body>`, while preserving unrelated runtime classes such as `js`, open-menu
states, or other toggles.

## Install

```bash
npm install @remino/swup-html-class-plugin
```

## Usage

```ts
import Swup from 'swup'
import SwupHtmlClassPlugin from '@remino/swup-html-class-plugin'

const swup = new Swup({
	plugins: [
		new SwupHtmlClassPlugin({
			classFilter: [/^page-/, /^theme-/],
		}),
	],
})
```

## Options

### `classFilter`

Controls which classes from the next page's `<html>` element are managed by the
plugin.

Accepted values:

- a string for an exact class match
- a `RegExp` for pattern matching
- a `(className: string) => boolean` callback
- an array combining any of the above

If `classFilter` is omitted, all classes from the next page's `<html>` element
are managed by the plugin.

## Behavior

- On each `content:replace`, the plugin removes classes it previously added.
- It then reads the incoming page's `<html class="...">`.
- Matching classes are added to `document.documentElement`.
- Other existing classes on the current page's `<html>` element are left alone.
