/* global WebImporter */

/**
 * Transformer for WKND Trendsetters website cleanup
 * Purpose: Remove navigation, footer, and non-content elements
 * Applies to: www.wknd-trendsetters.site (all templates)
 * Tested: / (homepage)
 * Generated: 2025-12-15
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration workflow (migration-work/cleaned.html)
 * - Page structure analysis from page migration
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform'
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove navigation
    // EXTRACTED: Found <div class="nav secondary-nav"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.nav.secondary-nav',
      '.nav-container.w-nav',
      '.nav-mobile-menu-button'
    ]);

    // Remove footer
    // EXTRACTED: Found <footer class="footer inverse-footer"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      'footer.footer',
      'footer.inverse-footer'
    ]);

    // Remove Webflow overlay elements
    // EXTRACTED: Found <div class="w-nav-overlay"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.w-nav-overlay'
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove remaining unwanted elements
    // Standard HTML elements - safe to use
    WebImporter.DOMUtils.remove(element, [
      'script',
      'noscript',
      'link'
    ]);

    // Clean up Webflow-specific attributes
    // EXTRACTED: Captured DOM showed multiple elements with w-node-* IDs
    const allElements = element.querySelectorAll('*');
    allElements.forEach(el => {
      // Remove Webflow node IDs
      if (el.id && el.id.startsWith('w-node-')) {
        el.removeAttribute('id');
      }
      // Remove Webflow classes that don't affect styling
      if (el.className && typeof el.className === 'string') {
        el.className = el.className
          .split(' ')
          .filter(cls => !cls.startsWith('w-node-'))
          .join(' ');
      }
    });
  }
}
