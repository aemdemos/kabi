/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as specified
  const headerRow = ['Cards (cards22)'];
  const rows = [headerRow];

  // Select each card (immediate children) - covers all examples
  const cardDivs = element.querySelectorAll(':scope > div');
  cardDivs.forEach(cardDiv => {
    const anchor = cardDiv.querySelector('a.recetalist_card');
    if (!anchor) return;

    // Get the image element (first cell)
    const img = anchor.querySelector('img.recetalist_img');
    // Reference it directly if found, else use empty string
    const imgCell = img || '';

    // Prepare text cell content
    const textCell = [];
    // Title as <strong>
    const title = anchor.querySelector('p.recetalist_title');
    if (title && title.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      textCell.push(strong);
    }
    // Description (family and time)
    const family = anchor.querySelector('p.recetalist_family');
    if (family && family.innerHTML.trim()) {
      // Add <br> if there was a title (to match design)
      if (textCell.length > 0) {
        textCell.push(document.createElement('br'));
      }
      // The description preserves time formatting (span)
      // Use the existing element instead of string or cloning
      textCell.push(family);
    }
    // If no text at all, use empty string to ensure two columns
    rows.push([imgCell, textCell.length > 0 ? textCell : '']);
  });

  // Create and replace table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
