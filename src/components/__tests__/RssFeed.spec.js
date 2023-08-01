import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'

import RssFeed from '@/components/RssFeed.vue'

const pinia = createPinia()

import i18n from '@/i18n'

describe('RssFeed', () => {
  it('renders properly', () => {
    const wrapper = mount(RssFeed, {
      props: {
        feedUrl: 'http://rss.cnn.com/rss/cnn_topstories.rss'
      },
      global: {
        plugins: [pinia, i18n]
      }
    })
    expect(wrapper.text()).toContain('Loading...')
  })
})
