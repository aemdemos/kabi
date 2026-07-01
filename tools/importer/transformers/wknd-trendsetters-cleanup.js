/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for WKND Trendsetters website cleanup
 * Purpose: Remove navigation, footer, and site-specific widgets
 * Applies to: www.wknd-trendsetters.site (all templates)
 * Tested: /fashion-insights
 * Generated: 2026-01-16
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration workflow (./migration-work/cleaned.html)
 * - Page structure analysis from page migration workflow
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform'
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove navigation (entire nav structure with menu)
    // EXTRACTED: Found in captured HTML lines 2-234: <div class="nav secondary-nav">
    WebImporter.DOMUtils.remove(element, [
      '.nav.secondary-nav',
      '.nav-container',
      '.w-nav'
    ]);

    // Remove footer
    // EXTRACTED: Found in captured HTML line 349: <footer class="footer inverse-footer">
    WebImporter.DOMUtils.remove(element, [
      'footer.footer',
      '.inverse-footer'
    ]);

    // Remove Webflow-specific elements (if present)
    // EXTRACTED: Found multiple w-* class patterns in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.w-nav-overlay',
      '[class*="w-dropdown"]'
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Clean up any remaining utility classes (Webflow framework classes)
    // EXTRACTED: Captured DOM shows extensive use of utility-* classes
    const allElements = element.querySelectorAll('*');
    allElements.forEach(el => {
      // Remove Webflow-specific attributes
      const attrNames = el.getAttributeNames().filter((a) =>
        a.startsWith('w-') ||
        a.startsWith('data-w-') ||
        a === 'data-wf-'
      );
      attrNames.forEach((a) => {
        el.removeAttribute(a);
      });
    });
  }
}
