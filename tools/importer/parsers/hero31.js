/* global WebImporter */
export default function parse(element, { document }) {
  // Table structure: [ [Header], [Background Image], [Content] ]
  // 1. Block Header - must be exactly 'Hero' per the example
  const cells = [];
  cells.push(['Hero']);

  // 2. Background image row (none in provided HTML)
  cells.push(['']);

  // 3. Content: heading, subheading, CTA (all optional)
  // Reference elements directly, only if present
  const rowContent = [];
  const heading = element.querySelector('h2');
  if (heading) rowContent.push(heading);
  const subheading = element.querySelector('p');
  if (subheading) rowContent.push(subheading);
  const buttonRow = element.querySelector('.buttonRow');
  if (buttonRow) {
    // Add all a elements inside buttonRow
    buttonRow.querySelectorAll('a').forEach(a => rowContent.push(a));
  }
  cells.push([rowContent]);

  // Create the table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
