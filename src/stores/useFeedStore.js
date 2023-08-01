/**
 * This module defines a Pinia store for managing feed data, including fetching, parsing, and storing RSS or Atom feeds.
 * @module useFeedStore
 */

import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { isRss, parseRssXml } from '@/rss/rss'
import { isAtom, parseAtomXml } from '@/atom/atom'

/**
 * Pinia store for managing feed data.
 * @typedef {Object} FeedStore
 * @property {Object|null} feed - The parsed feed data. Set to `null` if no feed data is available.
 * @property {string|null} feedError - Error message if there was an issue fetching or parsing the feed. Set to `null` if no error occurred.
 * @property {boolean} feedLoading - A flag indicating whether the feed is currently being fetched or parsed.
 * @property {Function} fetchRSSData - Asynchronously fetches and parses the given URL as an RSS or Atom feed.
 * @property {Function} clearFeed - Clears the stored feed data.
 * @property {Function} clearError - Clears the feed error message.
 */

/**
 * Create and export a new Pinia store instance for managing feed data.
 * @function useFeedStore
 * @returns {FeedStore} The created FeedStore instance.
 */
export const useFeedStore = defineStore('feed', () => {
  // Reactive variables
  const feed = ref(null)
  const feedError = ref(null)
  const feedLoading = ref(false)

  return {
    feed,
    feedError,
    feedLoading,

    /**
     * Fetches and parses the given URL as an RSS or Atom feed.
     * @async
     * @function fetchRSSData
     * @param {string} url - The URL of the RSS or Atom feed to fetch and parse.
     * @returns {Promise<void>} A promise that resolves when the fetching and parsing are completed.
     */
    async fetchRSSData(url) {
      try {
        this.feedLoading = true
        const response = await axios.get(url)
        const parser = new DOMParser()
        const rssXml = response.data
        const xmlDocument = parser.parseFromString(rssXml, 'text/xml')

        // Determine the feed type (RSS or Atom) and parse accordingly
        if (isRss(xmlDocument)) {
          this.feed = parseRssXml(xmlDocument)
        } else if (isAtom(xmlDocument)) {
          this.feed = parseAtomXml(xmlDocument)
        }
      } catch (error) {
        console.error('Error fetching RSS data from url: ' + url + ' due to: ', error)
        this.feedError = error.message
      } finally {
        this.feedLoading = false
      }
    },

    /**
     * Clears the stored feed data and error message.
     * @function clearFeed
     */
    clearFeed() {
      this.feed = null
      this.feedError = null
    },

    /**
     * Clears the feed error message.
     * @function clearError
     */
    clearError() {
      this.feedError = null
    }
  }
})
