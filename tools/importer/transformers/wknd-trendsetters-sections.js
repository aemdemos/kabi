/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Trendsetters section breaks and Section Metadata.
 *
 * Honors payload.template.sections from tools/importer/page-templates.json.
 * The "home" template has 7 sections (rc1..rc7). Section styles:
 *   - rc1 (intro),   rc3 (gallery), rc5 (latest-articles) → "secondary"
 *   - rc2, rc4, rc6, rc7 → null (no Section Metadata)
 *
 * Selectors come straight from each section.selector array in the template
 * (DOM-verified during page analysis against migration-work/cleaned.html,
 * e.g. "#main-content > header.section.secondary-section").
 *
 * Both hooks are used per the reference implementation: breaks are inserted in
 * beforeTransform (while every section element still exists, before block
 * parsers replace them via element.replaceWith), and Section Metadata blocks
 * are inserted in afterTransform, anchored to a marker <hr> that survives parsing.
 */

const SECTION_MARKER_ATTR = 'data-excat-section-id';

// section.selector is an array of candidate selectors — try each in order, first match wins.
function querySection(root, selectors) {
  for (const sel of selectors) {
    const el = root.querySelector(sel);
    if (el) return el;
  }
  return null;
}

export default function transform(hookName, element, payload) {
  const sections = (payload && payload.template && payload.template.sections) || [];

  if (hookName === 'beforeTransform') {
    // Insert breaks now, before parsers can replace any section element.
    // Iterate in reverse so inserting relative to a live element never shifts
    // sections we haven't processed yet.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      // First section: no leading break, and (rc1 is styled) its metadata still
      // needs an anchor, so drop a marker <hr> we remove later in afterTransform.
      if (i === 0 && !section.style) continue;
      const sectionEl = querySection(element, section.selector);
      if (!sectionEl) continue; // no selector matched on this page — skip, never guess

      const hr = document.createElement('hr');
      if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
      sectionEl.before(hr);
    }
  }

  if (hookName === 'afterTransform') {
    // Parsers have now run and may have replaced section elements. Anchor each
    // styled section's Section Metadata block to whichever still exists: the
    // marker <hr> placed above, or (first section) the original element itself.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section.style) continue;

      const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
      const anchor = marker || querySection(element, section.selector);
      if (!anchor) continue; // neither survived — skip, never guess

      const metadataBlock = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      anchor.after(metadataBlock);

      if (marker) {
        marker.removeAttribute(SECTION_MARKER_ATTR);
        if (i === 0) marker.remove(); // section 0 never gets a real leading break
      }
    }
  }
}
