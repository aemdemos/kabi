/* global WebImporter */
export default function parse(element, { document }) {
  // The block header, as per spec
  const headerRow = ['Cards (cards17)'];

  // Find the UL that contains the cards
  const ul = element.querySelector('ul.productParaQuien_list');
  const rows = [headerRow];

  if (ul) {
    ul.querySelectorAll('li').forEach((li) => {
      // Find the round image
      const img = li.querySelector('img');
      // Find the card's text (the only <p>)
      const p = li.querySelector('p');

      if (img && p) {
        // Use the existing p directly. No need to create new elements.
        rows.push([img, p]);
      }
      // If either img or p is missing, skip (otherwise the card is incomplete)
    });
  }

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
