/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match exactly
  const headerRow = ['Cards (cards21)'];
  const rows = [];
  // Get all direct <a> children (cards)
  const cardElements = Array.from(element.querySelectorAll(':scope > a.productTeaser'));
  cardElements.forEach(card => {
    // Get image (first <img>)
    const img = card.querySelector('img');
    // Get title (first <h1> inside card)
    const title = card.querySelector('h1');
    // Description (<p> inside card)
    const desc = card.querySelector('p');
    // Compose text cell: title as heading, description as paragraph, only if available
    // Use existing elements, do not clone
    const textFragments = [];
    if (title) {
      // Use a <strong> so the header stays bold, as in the visual example
      const strong = document.createElement('strong');
      strong.textContent = title.textContent;
      textFragments.push(strong);
      if (desc) {
        textFragments.push(document.createElement('br'));
      }
    }
    if (desc) {
      textFragments.push(desc);
    }
    rows.push([
      img,
      textFragments.length === 1 ? textFragments[0] : textFragments
    ]);
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
