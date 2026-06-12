/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base: accordion.
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-06-03
 *
 * Source layout: a `.faq-list` container holding multiple `<details class="faq-item">`
 * elements. Each item contains:
 *   - `<summary class="faq-question"><span>{question}</span></summary>` — the question label
 *   - `<div class="faq-answer"><p>{answer}</p></div>` — the answer content
 *
 * Target block (Accordion, 2 columns, N rows):
 *   Row 1: block name only (added by createBlock)
 *   Row 2..N+1: [question | answer] — one row per FAQ item
 *     - question: the text/inline content from the <summary>
 *     - answer: the inner content of the <div class="faq-answer"> (typically a <p>)
 */
export default function parse(element, { document }) {
  // Collect FAQ items. Prefer direct children of the .faq-list, with fallback to
  // any descendant .faq-item (handles cases where the element wraps a deeper container).
  let items = Array.from(element.querySelectorAll(':scope > details.faq-item'));
  if (!items.length) {
    items = Array.from(element.querySelectorAll('details.faq-item, details'));
  }

  const cells = [];

  items.forEach((item) => {
    // ---- Question cell (from <summary class="faq-question">) ----
    const summary = item.querySelector('summary.faq-question, summary');
    let questionCell = '';
    if (summary) {
      // The question text is wrapped in a <span> inside the <summary>. Prefer the span
      // (so we don't accidentally include any decorative icon markup), with fallback to
      // the summary itself if the span isn't present.
      const questionSpan = summary.querySelector('span');
      if (questionSpan) {
        questionCell = questionSpan;
      } else {
        questionCell = summary;
      }
    }

    // ---- Answer cell (from <div class="faq-answer">) ----
    const answerWrap = item.querySelector('.faq-answer, div.faq-answer');
    const answerParts = [];
    if (answerWrap) {
      // Preserve all inner block-level nodes (typically a <p>, but could include
      // multiple paragraphs, lists, links, etc.).
      const children = Array.from(answerWrap.children);
      if (children.length) {
        children.forEach((child) => answerParts.push(child));
      } else {
        // Fallback: if there are no element children, use the wrapper itself so
        // any text content is preserved.
        answerParts.push(answerWrap);
      }
    }

    cells.push([questionCell, answerParts]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
