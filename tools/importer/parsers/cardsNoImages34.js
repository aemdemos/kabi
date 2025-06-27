/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per block name and variant
  const headerRow = ['Cards (cardsNoImages34)'];
  const rows = [headerRow];

  // Select all direct child LI elements (cards)
  const items = element.querySelectorAll(':scope > li');
  items.forEach((item) => {
    // For each card, include all meaningful text content from the question portion only
    // The example only shows the question text for each card (no answers, images, or CTA)
    // So, only .recomendadorPregunta_text content should be included in each card
    const q = item.querySelector('.recomendadorPregunta_text');
    if (q) {
      // Use the existing DOM element for resilience and semantic meaning
      rows.push([q]);
    }
  });

  // Create and replace with the 1-column cards table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
