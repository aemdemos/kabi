/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Trendsetters cleanup.
 * Selectors from captured DOM of https://www.wknd-trendsetters.site/
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove skip link (from captured DOM: <a href="#main-content" class="skip-link">)
    WebImporter.DOMUtils.remove(element, ['.skip-link']);
  }
  if (hookName === H.after) {
    // Remove non-authorable content from captured DOM:
    // - Navigation: <div class="navbar">
    // - Footer: <footer class="footer inverse-footer">
    // - Iframes, link tags, noscript
    WebImporter.DOMUtils.remove(element, [
      '.navbar',
      'footer.footer',
      'iframe',
      'link',
      'noscript',
    ]);
  }
}
