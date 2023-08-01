import { beforeEach, describe, expect, test, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useFeedStore } from '../useFeedStore'
import axios from 'axios'

vi.mock('axios')

const pinia = createPinia()
setActivePinia(pinia)

const feedStore = useFeedStore()

describe('Feed Store', () => {
  beforeEach(() => {
    feedStore.clearFeed()
    feedStore.clearError()
  })

  test('fetchRSSData should set feed and feedLoading correctly on successful API call', async () => {
    const mockResponse = {
      data: '<?xml version="1.0" encoding="UTF-8"?><rss></rss>'
    }
    axios.get.mockResolvedValue(mockResponse)

    feedStore.fetchRSSData('http://example.com/feed')

    expect(feedStore.feedLoading).toBe(true)

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(feedStore.feedLoading).toBe(false)

    expect(feedStore.feed).toEqual({
      items: [
        // {
        //   title: 'Item 1 Title',
        //   link: 'https://example.com/item-1',
        //   description: 'Item 1 Description',
        //   pubDate: '2023-07-28T12:34:56Z',
        // },
      ]
    })
  })

  test('fetchRSSData should set feedError correctly on failed API call', async () => {
    const mockError = new Error('Network Error')
    axios.get.mockRejectedValue(mockError)

    feedStore.fetchRSSData('http://example.com/feed')

    expect(feedStore.feedLoading).toBe(true)

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(feedStore.feedError).toBe('Network Error')

    expect(feedStore.feed).toBe(null)

    expect(feedStore.feedLoading).toBe(false)
  })

  test('clearFeed should reset feed to null', () => {
    feedStore.feed = { items: [] }

    feedStore.clearFeed()

    expect(feedStore.feed).toBe(null)
  })

  test('clearError should reset feedError to null', () => {
    feedStore.feedError = 'Error message'

    feedStore.clearError()

    expect(feedStore.feedError).toBe(null)
  })
})
