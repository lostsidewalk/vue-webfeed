/**
 * Utility function for working with timestamps, dates, and currencies.
 * @function useTimestamp
 * @returns {Object} An object containing utility functions for timestamp formatting and currency conversion.
 */
export function useTimestamp() {
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  })

  /**
   * Formats the given timestamp to a localized date and time string.
   * @function formatTimestamp
   * @param {string} timestamp - The timestamp to format (e.g., '2023-08-01T12:34:56').
   * @returns {string|null} The formatted date and time string, or null if the timestamp is invalid.
   */
  function formatTimestamp(timestamp) {
    if (!timestamp) {
      return null
    }
    try {
      let d = new Date(Date.parse(timestamp))
      return d.toLocaleString()
    } catch (error) {
      console.debug('Unable to format timestamp due to: ' + error)
    }
  }
  
  /**
   * Converts an epoch time (seconds since January 1, 1970) to a localized date string.
   * @function toLocalDate
   * @param {number} epochTime - The epoch time value (seconds since January 1, 1970).
   * @returns {string} The localized date string in the format 'MM/DD/YYYY'.
   */
  function toLocalDate(epochTime) {
    return new Date(epochTime * 1000).toLocaleDateString()
  }

  /**
   * Formats the given amount as a localized currency string in USD.
   * @function toLocalCurrency
   * @param {number} amount - The amount to format (in cents, e.g., 1234 for $12.34).
   * @returns {string} The formatted currency string in the format '$XX.XX'.
   */
  function toLocalCurrency(amount) {
    return currencyFormatter.format(amount / 100)
  }

  return {
    formatTimestamp,
    toLocalDate,
    toLocalCurrency
  }
}
