/* global WebImporter */
export default function parse(element, { document }) {
  // Compose the table header
  const headerRow = ['Cards (cards29)'];
  const cells = [headerRow];

  // Find the wrapper for the cards
  const blogListRoot = element.querySelector('[class*="viewBlog"] .view');
  if (!blogListRoot) return;
  
  // Get each card
  const cardEls = blogListRoot.querySelectorAll(':scope > .viewBlogItem');
  cardEls.forEach(cardEl => {
    // Find the card link (wraps all content)
    const cardLink = cardEl.querySelector('a.blogTeaser');
    if (!cardLink) return;
    // Image (use as-is)
    const img = cardLink.querySelector('img');
    // Info block (contains all right-side content)
    const info = cardLink.querySelector('.blogTeaser_info');
    if (!info) return;
    // Compose the text cell by referencing the info element directly
    // (Contains heading, date, and summary per original HTML)
    cells.push([
      img,
      info
    ]);
  });

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
