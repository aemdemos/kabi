/* global WebImporter */

/**
 * Parser for tabs-dark block
 *
 * Source: https://www.wknd-trendsetters.site/
 * Base Block: tabs
 *
 * Block Structure:
 * - Row 1: Block name header
 * - Row 2-N: Each row has 2 columns [tab label | tab content]
 *
 * Generated: 2025-12-15
 */

export default function parse(element, { document }) {
  // Extract tab labels from menu
  const tabLinks = Array.from(element.querySelectorAll('.w-tab-link, a[class*="tab"]'));

  // Extract tab content panes
  const tabPanes = Array.from(element.querySelectorAll('.w-tab-pane, [class*="tab-pane"]'));

  const cells = [];

  // Match tabs with their content
  tabLinks.forEach((link, index) => {
    const label = link.textContent.trim();
    const pane = tabPanes[index];

    if (label && pane) {
      // Get heading from pane
      const heading = pane.querySelector('h3, h2, [class*="heading"]');

      // Get image from pane
      const img = pane.querySelector('img');

      // Build content cell
      const contentCell = document.createElement('div');
      if (heading) contentCell.appendChild(heading.cloneNode(true));
      if (img) contentCell.appendChild(img.cloneNode(true));

      cells.push([label, contentCell]);
    }
  });

  // Create block
  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Tabs-Dark',
    cells
  });

  element.replaceWith(block);
}
