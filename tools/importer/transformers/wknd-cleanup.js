/* global WebImporter */

/**
 * Transformer for WKND website cleanup
 * Purpose: Remove non-content elements (headers, footers, navigation)
 * Applies to: wknd.site (all templates)
 * Generated: 2026-01-09
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration workflow (https://wknd.site/us/en/adventures.html)
 * - Verified against cleaned.html from page scraping phase
 */

import { TransformHook } from './transform.js';

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeParse) {
    // Remove WKND header and navigation elements
    // EXTRACTED: Found in captured DOM:
    // - <header class="experiencefragment cmp-experiencefragment--header">
    // - <div class="wknd-sign-in-buttons">
    // - <div class="languagenavigation cmp-languagenavigation--default">
    WebImporter.DOMUtils.remove(element, [
      '.experiencefragment.cmp-experiencefragment--header',
      'header.experiencefragment',
      '.wknd-sign-in-buttons',
      '.languagenavigation',
      '.cmp-languagenavigation',
    ]);

    // Remove WKND footer elements (if present)
    // EXTRACTED: Standard AEM pattern for footers
    WebImporter.DOMUtils.remove(element, [
      '.experiencefragment.cmp-experiencefragment--footer',
      'footer.experiencefragment',
    ]);

    // Remove AEM-specific utility containers that wrap content
    // EXTRACTED: Found in captured DOM: <div class="cmp-layoutcontainer--utility">
    const utilityContainers = element.querySelectorAll('.cmp-layoutcontainer--utility');
    utilityContainers.forEach(container => {
      if (container) container.remove();
    });
  }

  if (hookName === TransformHook.afterTransform) {
    // Final cleanup - remove remaining AEM-specific elements
    // Standard elements safe to remove after block parsing
    WebImporter.DOMUtils.remove(element, [
      'meta',
      '.aem-Grid',
      '.aem-GridColumn',
    ]);
  }
}
