import { describe, it, expect } from 'vitest'
import { parseAtomXml } from '@/atom/atom'

describe('parseAtomXml', () => {
  const sampleXmlDocument = new DOMParser().parseFromString(
    `
    <feed xmlns="http://www.w3.org/2005/Atom">
      <title>Feed Title</title>
      <entry>
        <title>Post 1</title>
        <link href="https://example.com/post-1" />
        <link rel="alternate" href="https://example.com/post-1-alternate" />
        <summary type="text">Summary of Post 1</summary>
        <content type="html">Content of Post 1</content>
        <published>2023-08-01T12:00:00Z</published>
        <author>
          <name>Author 1</name>
          <email>author1@example.com</email>
        </author>
        <contributor>
          <name>Contributor 1</name>
          <email>contributor1@example.com</email>
        </contributor>
        <updated>2023-08-02T10:00:00Z</updated>
      </entry>
      <entry>
        <title>Post 2</title>
        <link href="https://example.com/post-2" />
      </entry>
    </feed>
    `,
    'text/xml'
  )

  it('parses Atom XML and returns the correct feed object', () => {
    const expectedParsedFeed = {
      items: [
        {
          lastUpdatedTimestamp: '2023-08-02T10:00:00Z',
          publishTimestamp: '2023-08-01T12:00:00Z',
          importerDesc: 'Feed Title',
          postRights: null,
          postEnclosures: null,
          guid: null,
          source: null,
          postDesc: {
            type: 'text',
            value: 'Summary of Post 1'
          },
          postContents: [
            {
              type: 'html',
              value: 'Content of Post 1'
            }
          ],
          authors: [
            {
              name: 'Author 1',
              email: 'author1@example.com'
            }
          ],
          contributors: [
            {
              name: 'Contributor 1',
              email: 'contributor1@example.com'
            }
          ],
          postUrls: [
            {
              href: 'https://example.com/post-1',
              title: null,
              rel: null,
              type: 'link',
              hreflang: null
            },
            {
              href: 'https://example.com/post-1-alternate',
              title: null,
              rel: null,
              type: 'link',
              hreflang: null
            }
          ],
          postTitle: {
            type: 'text',
            value: 'Post 1'
          }
        },
        {
          lastUpdatedTimestamp: null,
          publishTimestamp: null,
          importerDesc: 'Feed Title',
          postRights: null,
          postEnclosures: null,
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
          postTitle: {
            type: 'text',
            value: 'Post 2'
          }
        }
      ]
    }

    const parsedFeed = parseAtomXml(sampleXmlDocument)
    expect(parsedFeed).toEqual(expectedParsedFeed)
  })
})
