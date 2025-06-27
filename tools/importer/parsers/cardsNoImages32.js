/* global WebImporter */
export default function parse(element, { document }) {
  // Header from the example
  const headerRow = ['Cards (cardsNoImages32)'];
  const rows = [headerRow];

  // Get all direct <li> children (cards)
  const items = Array.from(element.querySelectorAll(':scope > li'));

  items.forEach((li) => {
    // Reference the li's content as-is to preserve formatting and links
    // Wrap li's childNodes in a div to match the structure of a single card cell
    const div = document.createElement('div');
    while (li.firstChild) {
      div.appendChild(li.firstChild);
    }
    rows.push([div]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the element
  element.replaceWith(table);
}
