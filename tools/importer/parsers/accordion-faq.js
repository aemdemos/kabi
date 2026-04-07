/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base: accordion.
 * Source: https://www.wknd-trendsetters.site/
 * Model fields per item: summary (text), text (richtext) - container block
 * Structure: Each item = 1 row with 2 columns (summary | answer text)
 */
export default function parse(element, { document }) {
  // Each .faq-item details element is one accordion item
  const items = element.querySelectorAll('details.faq-item, details');
  const cells = [];

  items.forEach((item) => {
    // Col 1: Summary/question with field hint
    const summaryFrag = document.createDocumentFragment();
    summaryFrag.appendChild(document.createComment(' field:summary '));
    const summary = item.querySelector('summary span, summary');
    if (summary) {
      const questionText = summary.querySelector('span') || summary;
      const p = document.createElement('p');
      p.textContent = questionText.textContent.trim();
      summaryFrag.appendChild(p);
    }

    // Col 2: Answer body with field hint
    const bodyFrag = document.createDocumentFragment();
    bodyFrag.appendChild(document.createComment(' field:text '));
    const answer = item.querySelector('.faq-answer');
    if (answer) {
      Array.from(answer.children).forEach((child) => {
        bodyFrag.appendChild(child.cloneNode(true));
      });
    }

    cells.push([summaryFrag, bodyFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
