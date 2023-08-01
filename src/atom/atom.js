/**
 * Parses an XML document representing an Atom feed and extracts relevant feed data.
 * @function parseAtomXml
 * @param {Document} xmlDocument - The XML document representing an Atom feed.
 * @returns {Object} An object containing the parsed feed data.
 */
export function parseAtomXml(xmlDocument) {
  const entries = xmlDocument.querySelectorAll('entry')
  const parsedFeed = {
    items: []
  }

  const importerDesc = getImporterDesc(xmlDocument)

  entries.forEach((entry) => {
    const title = getText(entry, 'title')
    const firstLink = getFirstLink(entry)
    const alternateLink = getAlternateLink(entry)
    const relatedLink = getRelatedLink(entry)
    const summary = getSummary(entry)
    const content = getContent(entry)
    const published = getText(entry, 'published')
    const author = getAuthor(entry)
    const contributor = getContributor(entry)
    const updated = getText(entry, 'updated')

    let parsed = {
      lastUpdatedTimestamp: updated,
      publishTimestamp: published,
      importerDesc,
      postRights: null,
      postEnclosures: null,
      guid: null,
      source: null
    }

    parsed.postUrls = []
    if (firstLink) {
      parsed.postUrls.push({
        href: firstLink,
        title: null,
        rel: null,
        type: 'link',
        hreflang: null
      })
    }
    if (alternateLink) {
      parsed.postUrls.push({
        href: alternateLink,
        title: null,
        rel: null,
        type: 'link',
        hreflang: null
      })
    }

    if (title) {
      parsed.postTitle = { type: 'text', value: title }
    }

    if (relatedLink) {
      parsed.postComment = relatedLink
    }

    if (author) {
      parsed.authors = [author]
    }

    if (contributor) {
      parsed.contributors = [contributor]
    }

    if (summary) {
      parsed.postDesc = summary
    }

    if (content) {
      parsed.postContents = [content]
    }

    parsedFeed.items.push(parsed)
  })

  return parsedFeed
}

/**
 * Retrieves the first link element from the entry object.
 * @function getFirstLink
 * @param {Element} entry - The XML element representing an entry in the Atom feed.
 * @returns {string|null} The href attribute of the first link element if available; otherwise, null.
 * @private
 */
function getFirstLink(entry) {
  return getLink(entry)
}

/**
 * Retrieves the alternate link element from the entry object.
 * @function getAlternateLink
 * @param {Element} entry - The XML element representing an entry in the Atom feed.
 * @returns {string|null} The href attribute of the alternate link element if available; otherwise, null.
 * @private
 */
function getAlternateLink(entry) {
  return getLink(entry, 'alternate')
}

/**
 * Retrieves the related link element from the entry object.
 * @function getRelatedLink
 * @param {Element} entry - The XML element representing an entry in the Atom feed.
 * @returns {string|null} The href attribute of the related link element if available; otherwise, null.
 * @private
 */
function getRelatedLink(entry) {
  return getLink(entry, 'related')
}

/**
 * Retrieves the specified link element from the given object.
 * @function getLink
 * @param {Object} obj - The object containing link elements.
 * @param {string} [linkType] - The type of link element to retrieve (optional).
 * @returns {string|null} The href attribute of the specified link element if available; otherwise, null.
 * @private
 */
function getLink(obj, linkType) {
  let l = obj.querySelectorAll('link')
  if (linkType) {
    for (let i = 0; i < l.length; i++) {
      let link = l[i]
      let rel = link.getAttribute('rel')
      if (rel && rel.toLowerCase() === linkType) {
        return link.getAttribute('href')
      }
    }
  } else {
    return l.length > 0 ? l[0].getAttribute('href') : null
  }
}

/**
 * Retrieves the summary element from the entry object.
 * @function getSummary
 * @param {Element} entry - The XML element representing an entry in the Atom feed.
 * @returns {Object|null} An object containing the summary details (type and value) if available; otherwise, null.
 * @private
 */
function getSummary(entry) {
  let summary = entry.querySelector('summary')
  if (summary) {
    let summaryType = summary.getAttribute('type')
    let summaryValue = summary.textContent
    return {
      type: summaryType ? summaryType : 'text',
      value: summaryValue
    }
  }
}

/**
 * Retrieves the content element from the entry object.
 * @function getContent
 * @param {Element} entry - The XML element representing an entry in the Atom feed.
 * @returns {Object|null} An object containing the content details (type and value) if available; otherwise, null.
 * @private
 */
function getContent(entry) {
  let content = entry.querySelector('content')
  if (content) {
    let contentType = content.getAttribute('type')
    let contentValue = content.textContent
    return {
      type: contentType ? contentType : 'text',
      value: contentValue
    }
  }
}

/**
 * Retrieves the author details from the entry object.
 * @function getAuthor
 * @param {Element} entry - The XML element representing an entry in the Atom feed.
 * @returns {Object|null} An object containing the author details (name and email) if available; otherwise, null.
 * @private
 */
function getAuthor(entry) {
  let author = entry.querySelector('author')
  if (author) {
    let authorName = author.querySelector('name')
    let authorEmail = author.querySelector('email')
    return {
      name: authorName ? authorName.textContent : '',
      email: authorEmail ? authorEmail.textContent : ''
    }
  }
}

/**
 * Retrieves the contributor details from the entry object.
 * @function getContributor
 * @param {Element} entry - The XML element representing an entry in the Atom feed.
 * @returns {Object|null} An object containing the contributor details (name and email) if available; otherwise, null.
 * @private
 */
function getContributor(entry) {
  let contributor = entry.querySelector('contributor')
  if (contributor) {
    let contributorName = contributor.querySelector('name')
    let contributorEmail = contributor.querySelector('email')
    return {
      name: contributorName ? contributorName.textContent : '',
      email: contributorEmail ? contributorEmail.textContent : ''
    }
  }
}

/**
 * Retrieves the importer description from the XML document.
 * @function getImporterDesc
 * @param {Document} xmlDocument - The XML document representing an Atom feed.
 * @returns {string|null} The importer description if available; otherwise, null.
 * @private
 */
function getImporterDesc(xmlDocument) {
  return getText(xmlDocument, 'title')
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
 * Checks whether the XML document represents an Atom feed.
 * @function isAtom
 * @param {Document} xmlDocument - The XML document to check.
 * @returns {boolean} True if the XML document represents an Atom feed; otherwise, false.
 */
export function isAtom(xmlDocument) {
  return xmlDocument.querySelectorAll('feed').length > 0
}
