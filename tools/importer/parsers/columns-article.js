/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: columns-article
 * Base block: columns
 * Source URL: https://www.wknd-trendsetters.site/
 * Generated: 2026-06-03
 *
 * Layout (2 columns):
 *  - Column 1: large 3:2 cover image
 *  - Column 2: breadcrumbs (links) + h2 heading + author name + date + read time
 */
export default function parse(element, { document }) {
  // Direct children of the grid-layout act as the two columns.
  const columns = element.querySelectorAll(':scope > div');
  const firstCol = columns[0] || null;
  const secondCol = columns[1] || null;

  // ---------- Column 1: cover image ----------
  // Prefer the specific cover-image class; fall back to any <img> within first column.
  let coverImage = null;
  if (firstCol) {
    coverImage = firstCol.querySelector('img.cover-image, img[class*="cover"], img');
  }

  // ---------- Column 2: breadcrumbs, heading, author, meta ----------
  const rightCellContent = [];

  if (secondCol) {
    // Breadcrumbs container (preserves links and separators if any).
    const breadcrumbs = secondCol.querySelector('.breadcrumbs, nav[aria-label*="readcrumb"], [class*="breadcrumb"]');
    if (breadcrumbs) rightCellContent.push(breadcrumbs);

    // Heading - prefer h2 (matches library example), fall back to any heading in this column.
    const heading = secondCol.querySelector('h1, h2, h3, .h2-heading, [class*="heading"]');
    if (heading) rightCellContent.push(heading);

    // Author + date/read-time meta block.
    // The source wraps these in a div containing two flex rows. Grab them via :scope > div
    // skipping the breadcrumbs (which has its own class) and any direct heading children.
    const metaContainers = Array.from(secondCol.querySelectorAll(':scope > div')).filter((d) => {
      if (d.classList.contains('breadcrumbs')) return false;
      // Skip if it IS a heading (defensive — headings shouldn't be wrapped in div, but just in case).
      if (d.matches('h1, h2, h3, h4, h5, h6')) return false;
      return true;
    });
    metaContainers.forEach((container) => rightCellContent.push(container));
  }

  // ---------- Build cells matching the columns block table shape ----------
  // Row 1: block name (added by createBlock). Row 2: two cells (one per column).
  const cells = [
    [
      coverImage || '',
      rightCellContent.length ? rightCellContent : '',
    ],
  ];

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'columns-article',
    cells,
  });
  element.replaceWith(block);
}
