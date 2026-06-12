/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-hero. Base: columns.
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-06-03
 *
 * Source structure:
 *   .grid-layout.tablet-1-column.grid-gap-xxl   (root – 2 columns)
 *     ├─ <div>  (column 1)
 *     │    ├─ h1.h1-heading
 *     │    ├─ p.subheading
 *     │    └─ div.button-group > a.button (×2)
 *     └─ <div class="grid-layout ... grid-gap-xs">  (column 2)
 *          └─ img.cover-image (×3, stacked)
 *
 * Target block table:
 *   | columns-hero |              <- block name row
 *   | col-1        | col-2 |      <- two columns side-by-side
 */
export default function parse(element, { document }) {
  // Direct children of the grid – the two top-level columns.
  const columnEls = Array.from(element.querySelectorAll(':scope > div'));

  // ---- Column 1: heading + subheading + CTA buttons ----
  const col1Source = columnEls[0] || null;
  const col1Content = [];

  if (col1Source) {
    const heading = col1Source.querySelector('h1, h2, h3, .h1-heading, [class*="heading"]');
    if (heading) col1Content.push(heading);

    const subheading = col1Source.querySelector('p.subheading, p[class*="subheading"], p');
    if (subheading) col1Content.push(subheading);

    // Pull every button-group anchor; fall back to any anchor with .button class.
    const buttonLinks = Array.from(
      col1Source.querySelectorAll('.button-group a, a.button, a[class*="button"]'),
    );
    // Deduplicate while preserving order (selectors above can overlap).
    const seenLinks = new Set();
    buttonLinks.forEach((a) => {
      if (!seenLinks.has(a)) {
        seenLinks.add(a);
        col1Content.push(a);
      }
    });
  }

  // ---- Column 2: stacked images ----
  const col2Source = columnEls[1] || null;
  const col2Content = [];

  if (col2Source) {
    // Pick up cover-images first, then any other <img> in the column as fallback.
    const imgs = Array.from(
      col2Source.querySelectorAll('img.cover-image, img'),
    );
    const seenImgs = new Set();
    imgs.forEach((img) => {
      if (!seenImgs.has(img)) {
        seenImgs.add(img);
        col2Content.push(img);
      }
    });
  }

  // Build the block cells:
  //   row 1 (auto via createBlock): block name
  //   row 2: two columns side-by-side
  const cells = [
    [col1Content, col2Content],
  ];

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'columns-hero',
    cells,
  });
  element.replaceWith(block);
}
