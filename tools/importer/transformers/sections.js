/* eslint-disable */
/* global WebImporter */

/**
 * Section transformer for WKND Trendsetters homepage.
 *
 * Reads `payload.template.sections` (populated from page-templates.json) and:
 *   1. Inserts an <hr> before every non-first section to mark a section break.
 *   2. Inserts a "Section Metadata" block immediately after each section
 *      whose `style` is set (non-empty / non-null), so the EDS importer
 *      emits the correct section style metadata.
 *
 * Section selectors are taken verbatim from page-templates.json, which itself
 * was derived from the captured DOM in migration-work/cleaned.html. The
 * 7-section structure matches the 7 top-level <header>/<section> children
 * inside <main id="main-content">.
 *
 * Sections processed in reverse order so DOM mutations earlier in the
 * document do not affect selectors evaluated later.
 *
 * Reference: https://www.aem.live/developer/block-collection/section-metadata
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;

  const template = payload && payload.template;
  const sections = template && Array.isArray(template.sections) ? template.sections : [];
  if (sections.length < 2) return;

  // The selectors in page-templates.json are absolute (`main > ...`). We try
  // them three ways before giving up:
  //   (a) document.querySelector with the literal selector
  //   (b) relative form against `element` (`:scope > ...` after stripping
  //       the leading `main > `)
  //   (c) positional fallback: the i-th element child of `element`
  //       (most templates list sections in document order — for the WKND
  //       homepage this is verified by migration-work/page-structure.json)
  // The fallback exists because some `:nth-of-type(N)` selectors in the
  // template are tag-counted (not class-filtered), so a class-restricted
  // `:not(...):nth-of-type(2)` may fail to match even when the section
  // is structurally present. Position-based fallback covers that case.
  const doc = element.ownerDocument;
  const topLevelChildren = Array.from(element.children);

  function resolveSection(section, index) {
    if (!section || !section.selector) return null;
    try {
      const m = doc.querySelector(section.selector);
      if (m) return m;
    } catch (e) {
      // ignore invalid selector
    }
    const relSelector = section.selector.replace(/^\s*main\s*>\s*/, ':scope > ');
    try {
      const m = element.querySelector(relSelector);
      if (m) return m;
    } catch (e) {
      // ignore invalid selector
    }
    // Positional fallback: i-th top-level child of <main>.
    if (index >= 0 && index < topLevelChildren.length) {
      return topLevelChildren[index];
    }
    return null;
  }

  // Process in reverse order to keep earlier selectors stable while we
  // append/insert nodes later in the document.
  for (let i = sections.length - 1; i >= 0; i--) {
    const section = sections[i];
    const sectionEl = resolveSection(section, i);
    if (!sectionEl) continue;

    // 1. Section Metadata block (only if section has a style).
    if (section.style) {
      const metadataBlock = WebImporter.Blocks.createBlock(doc, {
        name: 'Section Metadata',
        cells: {
          style: section.style,
        },
      });
      // Insert AFTER the section element so the metadata applies to
      // the preceding section.
      if (sectionEl.parentNode) {
        sectionEl.parentNode.insertBefore(metadataBlock, sectionEl.nextSibling);
      }
    }

    // 2. Section break (<hr>) BEFORE every non-first section.
    if (i > 0) {
      const hr = doc.createElement('hr');
      if (sectionEl.parentNode) {
        sectionEl.parentNode.insertBefore(hr, sectionEl);
      }
    }
  }
}
