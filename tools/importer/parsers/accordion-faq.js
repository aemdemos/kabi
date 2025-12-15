/* global WebImporter */

/**
 * Parser for accordion-faq block
 *
 * Source: https://www.wknd-trendsetters.site/
 * Base Block: accordion
 *
 * Block Structure:
 * - Row 1: Block name header
 * - Row 2-N: Each row has 2 columns [question | answer]
 *
 * Generated: 2025-12-15
 */

export default function parse(element, { document }) {
  // Extract accordion items
  // Source HTML: .accordion.transparent-accordion containers with dropdown toggle and content
  const accordionItems = Array.from(element.querySelectorAll('.accordion, .w-dropdown, [class*="accordion"]'));

  const cells = [];

  accordionItems.forEach(item => {
    // Get question from toggle
    const questionEl = item.querySelector('.w-dropdown-toggle .paragraph-lg, .w-dropdown-toggle, [class*="toggle"]');
    const question = questionEl ? questionEl.textContent.trim() : '';

    // Get answer from dropdown list
    const answerEl = item.querySelector('.w-dropdown-list .rich-text p, .w-dropdown-list p, [class*="dropdown-list"] p');
    const answer = answerEl ? answerEl.textContent.trim() : '';

    if (question && answer) {
      cells.push([question, answer]);
    }
  });

  // Create block
  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Accordion-Faq',
    cells
  });

  element.replaceWith(block);
}
