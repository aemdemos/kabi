/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion-faq block
 *
 * Source: https://www.wknd-trendsetters.site/faq
 * Base Block: accordion
 *
 * Block Structure:
 * - Each Q&A pair is one row with 2 columns: [question] [answer]
 *
 * DOM Structure (validated against source HTML):
 * - .flex-horizontal.flex-vertical.flex-gap-sm (container)
 *   - .divider (Q&A pair wrapper)
 *     - .grid-layout > .h4-heading (question)
 *     - .grid-layout > .rich-text.paragraph-lg (answer)
 *
 * Generated: 2026-01-16
 */

export default function parse(element, { document }) {
  const cells = [];

  // Extract all Q&A pairs
  // Validated: Source HTML shows each Q&A in a .divider container
  const qaPairs = Array.from(element.querySelectorAll('.divider, [class*="divider"]'));

  qaPairs.forEach((pair) => {
    // Extract question
    // Validated: .h4-heading exists in source HTML for each Q&A pair
    const question = pair.querySelector('.h4-heading, [class*="h4-heading"], [class*="heading"]');

    // Extract answer
    // Validated: .rich-text.paragraph-lg or .w-richtext exists in source HTML
    const answer = pair.querySelector('.rich-text, .w-richtext, [class*="richtext"]');

    // Only add row if both question and answer exist
    if (question && answer) {
      cells.push([question, answer]);
    }
  });

  // Create block using WebImporter API
  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Accordion-Faq',
    cells
  });

  // Replace element with block
  element.replaceWith(block);
}
