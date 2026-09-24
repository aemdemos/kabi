/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base: accordion.
 * Source: https://www.wknd-trendsetters.site/
 * Structure (metadata.json + accordion convention): one row per FAQ, two cells.
 *   Cell 1: question (title).
 *   Cell 2: answer (content).
 *
 * Source uses native <details class="faq-item"> with a <summary> question (plus a
 * decorative +/- icon we drop) and a .faq-answer body.
 */
export default function parse(element, { document }) {
  const items = [...element.querySelectorAll(':scope > details.faq-item, details.faq-item')];

  const cells = [];
  items.forEach((item) => {
    const summary = item.querySelector('summary, .faq-question');
    // Question text lives in the <span>; the sibling <img> is a decorative toggle icon.
    const questionText = summary && (summary.querySelector('span') || summary);

    const answer = item.querySelector('.faq-answer');
    const answerContent = answer ? [...answer.childNodes] : [];

    if (questionText || answerContent.length) {
      cells.push([questionText || '', answerContent]);
    }
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
