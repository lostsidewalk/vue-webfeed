import { describe, it, expect } from 'vitest'
import { parseRssXml } from '@/rss/rss'

describe('parseRssXml', () => {
  const sampleXmlDocument = new DOMParser().parseFromString(
    `
    <rss version="2.0">
      <channel>
        <title>Channel Title</title>
        <item>
          <title>Post 1</title>
          <link>https://example.com/post-1</link>
          <description>This is the description of Post 1</description>
          <pubDate>2023-08-01T12:00:00Z</pubDate>
          <author>Author 1</author>
          <category>Category 1</category>
          <comments>https://example.com/post-1#comments</comments>
          <guid>post-1-guid</guid>
          <source>Example Source</source>
        </item>
        <item>
          <title>Post 2</title>
          <link>https://example.com/post-2</link>
        </item>
      </channel>
    </rss>
    `,
    'text/xml'
  )

  it('parses RSS XML and returns the correct feed object', () => {
    const expectedParsedFeed = {
      items: [
        {
          lastUpdatedTimestamp: null,
          publishTimestamp: '2023-08-01T12:00:00Z',
          importerDesc: 'Channel Title',
          postContents: null,
          postComment: 'https://example.com/post-1#comments',
          contributors: null,
          postRights: null,
          postEnclosures: [],
          guid: 'post-1-guid',
          source: 'Example Source',
          postUrls: [
            {
              href: 'https://example.com/post-1',
              title: null,
              rel: null,
              type: 'link',
              hreflang: null
            }
          ],
          postTitle: { type: 'text', value: 'Post 1' },
          postDesc: { type: 'text', value: 'This is the description of Post 1' },
          postCategories: ['Category 1'],
          authors: [{ name: 'Author 1', email: null }]
        },
        {
          lastUpdatedTimestamp: null,
          publishTimestamp: null,
          importerDesc: 'Channel Title',
          postContents: null,
          postComment: null,
          contributors: null,
          postRights: null,
          postEnclosures: [],
          guid: null,
          source: null,
          postUrls: [
            {
              href: 'https://example.com/post-2',
              title: null,
              rel: null,
              type: 'link',
              hreflang: null
            }
          ],
          postTitle: { type: 'text', value: 'Post 2' }
        }
      ]
    }

    const parsedFeed = parseRssXml(sampleXmlDocument)
    expect(parsedFeed).toEqual(expectedParsedFeed)
  })
})
