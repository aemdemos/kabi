/* global WebImporter */
export default function parse(element, { document }) {
  // Find all column items (should be direct children)
  const items = element.querySelectorAll(':scope > .productDestacados_item');

  // For each item, build a column cell using the original elements
  const columns = Array.from(items).map((item) => {
    // Create a wrapper div for this column content
    const colDiv = document.createElement('div');
    // Get icon img (preserve if present)
    const iconDiv = item.querySelector(':scope > .productDestacados_icon');
    if (iconDiv && iconDiv.firstElementChild) {
      colDiv.appendChild(iconDiv.firstElementChild);
    }
    // Get title (h3)
    const title = item.querySelector(':scope > .productDestacados_title');
    if (title) {
      // Use <strong> for title text for visual emphasis, as in the screenshot
      const strong = document.createElement('strong');
      strong.textContent = title.textContent;
      colDiv.appendChild(strong);
      colDiv.appendChild(document.createElement('br'));
    }
    // Get descriptive text (p)
    const text = item.querySelector(':scope > .productDestacados_text');
    if (text) {
      // Append the text node
      colDiv.appendChild(document.createTextNode(text.textContent));
    }
    return colDiv;
  });

  // Table header must match the example block name exactly
  const cells = [
    ['Columns (columns35)'],
    columns
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
