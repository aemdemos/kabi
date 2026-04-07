/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Trendsetters section breaks and section-metadata.
 * Runs in afterTransform only. Uses payload.template.sections.
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.after) {
    const template = payload && payload.template;
    if (!template || !template.sections || template.sections.length < 2) return;

    const sections = template.sections;

    // Process sections in reverse order to avoid offset issues
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const document = element.ownerDocument;

      // Find the section element using selector(s)
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      let sectionEl = null;
      for (const sel of selectors) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }

      if (!sectionEl) continue;

      // Add section-metadata block if section has a style
      if (section.style) {
        const sectionMetaBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.append(sectionMetaBlock);
      }

      // Add <hr> before section (except the first section)
      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
