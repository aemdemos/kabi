/* eslint-disable */
/* global WebImporter */

/**
 * WKND Sections Transformer - Adds section breaks and section metadata
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { template } = payload;

    if (!template || !template.sections || template.sections.length < 2) {
      return;
    }

    const document = element.ownerDocument || window.document;

    // Collect all section elements first
    const sectionElements = [];
    const foundElements = new Set(); // Track already-found elements to avoid duplicates

    for (let i = 0; i < template.sections.length; i++) {
      const section = template.sections[i];
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];

      let sectionElement = null;
      for (const selector of selectors) {
        try {
          const el = element.querySelector(selector);
          if (el && !foundElements.has(el)) {
            sectionElement = el;
            foundElements.add(el);
            break;
          }
        } catch (e) {
          // Selector might be invalid, skip
          continue;
        }
      }

      if (sectionElement) {
        sectionElements.push({ section, element: sectionElement, index: i });
      }
    }

    // Process sections in reverse order to maintain correct insertion points
    for (let i = sectionElements.length - 1; i >= 0; i--) {
      const { section, element: sectionElement, index } = sectionElements[i];

      // Add section-metadata block if section has a style
      if (section.style) {
        const sectionMetadataBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: {
            style: section.style
          }
        });

        // Insert section-metadata after the section element
        if (sectionElement.nextSibling) {
          sectionElement.parentNode.insertBefore(sectionMetadataBlock, sectionElement.nextSibling);
        } else {
          sectionElement.parentNode.appendChild(sectionMetadataBlock);
        }
      }

      // Add <hr> before section (except for the first section)
      if (index > 0) {
        const hr = document.createElement('hr');
        sectionElement.parentNode.insertBefore(hr, sectionElement);
      }
    }
  }
}
