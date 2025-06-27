/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches example
  const cells = [['Cards (cards7)']];

  // Get the card anchor, image, and content
  const link = element.querySelector('a.productTeaser');
  if (!link) return;
  const img = link.querySelector('img');
  const contentDiv = link.querySelector('div');
  if (!img || !contentDiv) return;

  // Compose the text cell, preserving semantic HTML and all text
  const textParts = [];
  const h1 = contentDiv.querySelector('h1');
  if (h1) textParts.push(h1);
  const p = contentDiv.querySelector('p');
  if (p) textParts.push(p);
  const details = contentDiv.querySelector('.productDetails');
  if (details) {
    // .productDetails usually contains multiple <div>s (e.g., flavors)
    // Group as a <div> for semantic preservation
    textParts.push(details);
  }

  cells.push([
    img, // use the original img element
    textParts // array of existing DOM elements
  ]);

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
