/**
 * Parses an XML document representing an RSS feed and extracts relevant feed data.
 * @function parseRssXml
 * @param {Document} xmlDocument - The XML document representing an RSS feed.
 * @returns {Object} An object containing the parsed feed data.
 */
export function parseRssXml(xmlDocument) {
  const items = xmlDocument.querySelectorAll('item')
  const parsedFeed = {
    items: []
  }

  const importerDesc = getImporterDesc(xmlDocument)

  items.forEach((item) => {
    const title = getText(item, 'title')
    const link = getText(item, 'link')
    const description = getText(item, 'description')
    const pubDate = getText(item, 'pubDate')
    const author = getText(item, 'author')
    const category = getText(item, 'category')
    const comments = getText(item, 'comments')
    const guid = getText(item, 'guid')
    const source = getText(item, 'source')

    let postEnclosures = []

    let parsed = {
      lastUpdatedTimestamp: null,
      publishTimestamp: pubDate,
      importerDesc,
      postContents: null,
      postComment: comments,
      contributors: null,
      postRights: null,
      postEnclosures,
      guid,
      source
    }

    parsed.postUrls = [
      {
        href: link,
        title: null,
        rel: null,
        type: 'link',
        hreflang: null
      }
    ]
    if (title) {
      parsed.postTitle = { type: 'text', value: title }
    }

    if (description) {
      parsed.postDesc = { type: 'text', value: description }
    }

    if (category) {
      parsed.postCategories = [category]
    }

    if (author) {
      parsed.authors = [{ name: author, email: null }]
    }

    parsedFeed.items.push(parsed)
  })

  return parsedFeed
}

/**
 * Extracts the importer description from the XML document.
 * @function getImporterDesc
 * @param {Document} xmlDocument - The XML document representing an RSS feed.
 * @returns {string|null} The importer description if available; otherwise, null.
 * @private
 */
function getImporterDesc(xmlDocument) {
  let channelTitle = xmlDocument.querySelector('channel > title')
  if (channelTitle) {
    return channelTitle.textContent
  }
}

/**
 * Retrieves the text content of the specified element within the given item.
 * @function getText
 * @param {Element} item - The XML element representing an item in the feed.
 * @param {string} elem - The name of the element to retrieve the text content from.
 * @returns {string|null} The text content of the specified element if available; otherwise, null.
 * @private
 */
function getText(item, elem) {
  let e = item.querySelector(elem)
  return e ? e.textContent : null
}

/**
 * Checks whether the XML document represents an RSS feed.
 * @function isRss
 * @param {Document} xmlDocument - The XML document to check.
 * @returns {boolean} True if the XML document represents an RSS feed; otherwise, false.
 */
export function isRss(xmlDocument) {
  return xmlDocument.querySelectorAll('rss').length > 0
}
