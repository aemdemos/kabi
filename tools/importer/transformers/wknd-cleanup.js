/* eslint-disable */
/* global WebImporter */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable content: header navigation, footer, breadcrumbs, skip links
    // All selectors extracted from captured DOM (cleaned.html)
    WebImporter.DOMUtils.remove(element, [
      '.skip-link',
      '.navbar',
      '.breadcrumbs',
      'footer.footer'
    ]);
  }
}
