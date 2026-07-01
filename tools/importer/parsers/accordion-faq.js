/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq variant.
 * Base block: accordion
 * Source: https://main--kabi--aemdemos.aem.page/ (section: .accordion.accordion19)
 * Generated: 2026-05-06
 *
 * Source DOM:
 *   <div class="accordion accordion19 block">
 *     <details class="accordion-item">
 *       <summary class="accordion-item-label"><p>Title text</p></summary>
 *       <div class="accordion-item-body"><p>Body text</p></div>
 *     </details>
 *     ...
 *   </div>
 *
 * Target table (from block library "Accordion" example + description):
 *   Row 1: block name cell ("accordion-faq")
 *   Row 2..N: two cells per row — Title (mandatory) | Content (mandatory).
 *
 * Variations handled:
 *   - Title/body may be wrapped in <p> (current source) or may contain inline markup
 *     or multiple children — we prefer the inner children when present, otherwise
 *     fall back to the wrapper element itself so text is preserved.
 *   - Body may contain rich content (paragraphs, lists, images, links) — we keep
 *     semantic children intact rather than flattening to text.
 *   - Some accordions may use class-based structures instead of <details>/<summary>;
 *     extraction uses class selectors with <details>/<summary> as a secondary signal.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Each accordion item is a direct <details class="accordion-item"> under the block.
  // Fall back to any descendant with the same class (or a raw <details>) to handle variants.
  let items = element.querySelectorAll(':scope > details.accordion-item, :scope > .accordion-item');
  if (!items.length) {
    items = element.querySelectorAll('details.accordion-item, .accordion-item');
  }
  if (!items.length) {
    items = element.querySelectorAll(':scope > details, details');
  }

  items.forEach((item) => {
    // Title: <summary class="accordion-item-label"> (or any <summary> as fallback).
    const labelEl = item.querySelector('.accordion-item-label, summary');
    // Content: <div class="accordion-item-body"> (fallback: any class containing "body").
    const bodyEl = item.querySelector('.accordion-item-body, [class*="accordion-item-body"], [class*="item-body"]');

    // Prefer the inner children of label/body so we keep semantic elements (p, strong,
    // links, lists, images) without the wrapper. If the wrapper has no element children
    // (e.g. plain text only), fall back to the wrapper itself.
    let titleCell;
    if (labelEl) {
      const labelChildren = Array.from(labelEl.children);
      if (labelChildren.length > 0) {
        titleCell = labelChildren.length === 1 ? labelChildren[0] : labelChildren;
      } else {
        titleCell = labelEl.textContent.trim();
      }
    } else {
      titleCell = '';
    }

    let contentCell;
    if (bodyEl) {
      const bodyChildren = Array.from(bodyEl.children);
      if (bodyChildren.length > 0) {
        contentCell = bodyChildren.length === 1 ? bodyChildren[0] : bodyChildren;
      } else {
        contentCell = bodyEl.textContent.trim();
      }
    } else {
      contentCell = '';
    }

    // Block library "Accordion" uses a 2-column table: Title | Content per row.
    cells.push([titleCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'accordion-faq',
    cells,
  });
  element.replaceWith(block);
}
