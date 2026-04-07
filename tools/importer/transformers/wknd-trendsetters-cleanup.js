/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Trendsetters cleanup.
 * Selectors from captured DOM at https://www.wknd-trendsetters.site/
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove skip-to-content link (a.skip-link)
    WebImporter.DOMUtils.remove(element, ['a.skip-link']);
  }
  if (hookName === H.after) {
    // Remove non-authorable content: navbar (header), footer
    // From captured DOM: div.navbar, footer.footer
    WebImporter.DOMUtils.remove(element, [
      '.navbar',
      'footer.footer',
      'noscript',
      'iframe',
      'link',
    ]);
    // Clean up data attributes
    element.querySelectorAll('[data-astro-cid-37fxchfa]').forEach((el) => {
      el.removeAttribute('data-astro-cid-37fxchfa');
    });
  }
}
