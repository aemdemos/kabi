/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base: accordion.
 * Source: https://www.wknd-trendsetters.site/
 * Selector: .faq-list
 * Structure: 4 FAQ items with question (summary) and answer (details content).
 * Target: Accordion block - each row = [question | answer]
 */
export default function parse(element, { document }) {
  // Extract FAQ items (from captured DOM: <details class="faq-item">)
  const faqItems = Array.from(element.querySelectorAll('details.faq-item, details'));

  const cells = [];

  faqItems.forEach((item) => {
    // Question (from captured DOM: <summary class="faq-question"> > <span>)
    const summary = item.querySelector('summary');
    const questionSpan = summary ? summary.querySelector('span') : null;
    const questionText = questionSpan ? questionSpan.textContent.trim() : (summary ? summary.textContent.trim() : '');

    // Answer (from captured DOM: <div class="faq-answer"> > <p>)
    const answerDiv = item.querySelector('.faq-answer');
    const answerContent = document.createElement('div');
    if (answerDiv) {
      const paragraphs = Array.from(answerDiv.querySelectorAll('p'));
      paragraphs.forEach((p) => answerContent.append(p));
    }

    cells.push([questionText, answerContent]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
