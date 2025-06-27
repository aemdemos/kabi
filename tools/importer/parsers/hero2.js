/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row exactly as in the example
  const headerRow = ['Hero'];

  // 2. Second row: block image element if present, else blank
  const img = element.querySelector('img.productImg');
  const imageRow = [img ? img : ''];

  // 3. Third row: content block
  // Extract CTA (back link)
  const cta = element.querySelector('.productBack a');
  // Title (h1)
  const title = element.querySelector('h1.productTitle');
  // Subtitle (p)
  const subtitle = element.querySelector('p.productSubtitle');
  // Details (chips)
  const details = element.querySelector('.productDetails');

  // Compose content: each element on its own line, omit blanks
  const content = [];
  if (cta) content.push(cta);
  if (title) content.push(title);
  if (subtitle) content.push(subtitle);
  if (details && details.children.length > 0) {
    // details is a div of divs, place each on its own line
    Array.from(details.children).forEach(detail => {
      content.push(detail);
    });
  }

  const contentRow = [content.length ? content : ''];

  // 4. Compose the block with 1 column, 3 rows
  const tableRows = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
