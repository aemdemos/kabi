/* global WebImporter */

/**
 * Parser for columns-cta block
 *
 * Source: https://www.wknd-trendsetters.site/
 * Base Block: columns
 *
 * Block Structure:
 * - Row 1: Block name header
 * - Row 2: 2 columns [text content (heading + paragraph) | buttons]
 *
 * Generated: 2025-12-15
 */

export default function parse(element, { document }) {
  // Extract heading
  const heading = element.querySelector('h2, h1, [class*="heading"]');

  // Extract subheading/paragraph
  const subheading = element.querySelector('p.subheading, p');

  // Extract buttons
  const buttons = Array.from(element.querySelectorAll('a.button, a.w-button, .button-group a'));

  // Build text content column
  const textCell = document.createElement('div');
  if (heading) textCell.appendChild(heading.cloneNode(true));
  if (subheading) textCell.appendChild(subheading.cloneNode(true));

  // Build buttons column
  const buttonsCell = document.createElement('div');
  buttons.forEach(btn => {
    buttonsCell.appendChild(btn.cloneNode(true));
  });

  // Create cells array
  const cells = [[textCell, buttonsCell]];

  // Create block
  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Columns-Cta',
    cells
  });

  element.replaceWith(block);
}
