/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion-faq block
 * Base block: accordion
 * Structure: Multiple rows, each item = 1 row with 2 columns (question | answer)
 * FAQ selector: main > section:nth-child(6) .faq-list
 */
export default function parse(element, { document }) {
  const cells = [];

  // Get all FAQ items (details elements)
  const faqItems = element.querySelectorAll('.faq-item, details');

  faqItems.forEach(item => {
    // Get question (summary element)
    const summary = item.querySelector('summary, .faq-question');
    let question = '';
    if (summary) {
      const span = summary.querySelector('span');
      question = span ? span.textContent.trim() : summary.textContent.trim();
    }

    // Get answer (div with answer class)
    const answerDiv = item.querySelector('.faq-answer');
    let answer = '';
    if (answerDiv) {
      const answerP = answerDiv.querySelector('p');
      answer = answerP ? answerP.textContent.trim() : answerDiv.textContent.trim();
    }

    // Accordion format: [question, answer] per row
    if (question && answer) {
      cells.push([question, answer]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'accordion-faq',
    cells
  });

  element.replaceWith(block);
}
