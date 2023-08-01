# Vue.js RSS Feed Reader

![RSS Feed Reader](/public/screenshot.png)

A simple RSS feed reader built with Vue.js, Pinia for state management, and vue-dompurify-html for secure HTML rendering. It supports internationalization (i18n) with translations for different locales.

## Features

- Fetch and display RSS feeds from provided URLs.
- Display individual feed items with details and actions.
- Secure HTML rendering using vue-dompurify-html.
- Internationalization support for translations.
- State management with Pinia.

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/lostsidewalk/vue-webfeed.git
cd vue-webfeed
```

2. Install the dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run serve
```

4. Open your browser and go to `http://localhost:8080` to view the app.

## Usage

1. Provide the RSS feed URL when using the `<RssFeed>` component.

```vue
<template>
  <RssFeed :feedUrl="rssFeedUrl" />
</template>

<script>
import RssFeed from './components/RssFeed.vue';

export default {
  components: {
    RssFeed
  },
  data() {
    return {
      rssFeedUrl: 'https://example.com/rss-feed.xml'
    };
  }
};
</script>
```

2. Customize the appearance and styles by modifying the CSS in the `assets/main.css` file.

## Configuration

### Internationalization (i18n)

The application supports multiple languages using `vue-i18n`. Translations for different locales are defined in the `./i18n/translations` directory. To add translations for other locales, create a new file (e.g., `fr.js`) in the `translations` directory and add the translations as key-value pairs.

```javascript
// fr.js
export default {
  greeting: 'Bonjour',
  ...
};
```

### State Management with Pinia

The application uses `pinia` for state management. Stores are defined in the `./stores` directory. To add new stores, create a new file in the `stores` directory and define your store using `defineStore` from `pinia`.

```javascript
// useExampleStore.js
import { defineStore } from 'pinia';

export const useExampleStore = defineStore('example', () => {
  return {
    // Store state and actions
  };
});
```

## Contributing

Contributions are welcome! If you find a bug or have a feature request, please open an issue. Feel free to fork the repository and submit pull requests for improvements or fixes.

## License

This project is licensed under the [MIT License](/path/to/LICENSE).

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
npm run test:unit -- --headless # for headless testing
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
