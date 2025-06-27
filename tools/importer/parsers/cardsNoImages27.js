/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as specified
  const headerRow = ['Cards (cardsNoImages27)'];

  const rows = [];

  // Get the heading (if present)
  const heading = element.querySelector('h2');
  // Get the list (if present)
  const list = element.querySelector('ul');

  // Only create a card row if there is at least a heading or a list
  if (heading || (list && list.children.length > 0)) {
    const cardContent = [];
    if (heading) cardContent.push(heading);
    if (list && list.children.length > 0) cardContent.push(list);
    rows.push([cardContent]);
  }

  // Build and replace with block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
