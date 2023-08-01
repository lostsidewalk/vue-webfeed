import { createI18n } from 'vue-i18n'

let lang = window.navigator.languages ? window.navigator.languages[0] : null
lang =
  lang ||
  window.navigator.language ||
  window.navigator.browserLanguage ||
  window.navigator.userLanguage

let shortLang = lang
if (shortLang.indexOf('-') !== -1) shortLang = shortLang.split('-')[0]

if (shortLang.indexOf('_') !== -1) shortLang = shortLang.split('_')[0]

import en from '@/translations/en'

const i18n = createI18n({
  /**
   * The locale to be used for translations.
   * @type {string} locale
   */
  locale: shortLang,
  /**
   * The fallback locale to be used if a translation is not available in the current locale.
   * @type {string} fallbackLocale
   */
  fallbackLocale: 'en',
  /**
   * Whether to allow message composition for translation interpolations.
   * @type {boolean} allowComposition
   */
  allowComposition: true,
  /**
   * The messages (translations) for different locales.
   * @type {Object} messages
   */
  messages: {
    en: en
  }
})

export default i18n
