/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per the block name
  const headerRow = ['Cards (cards16)'];

  // The card anchor 'a.productTeaser'
  const cardLink = element.querySelector('a.productTeaser');
  if (!cardLink) return; // Graceful exit if not present

  // Find the image (mandatory for cards16)
  const img = cardLink.querySelector('img');

  // Get the container div (contains title, desc, details)
  const infoDiv = cardLink.querySelector('div');
  // Defensive: if not found, create empty div to keep structure
  const mainInfo = infoDiv || document.createElement('div');

  // Get the heading, description, and details
  const title = mainInfo.querySelector('h1');
  const desc = mainInfo.querySelector('p');
  const details = mainInfo.querySelector('.productDetails');

  // Compose the text cell, order: title, desc, details (each on a separate line)
  const textCell = [];
  if (title) textCell.push(title);
  if (desc) textCell.push(desc);
  if (details) textCell.push(details);

  // If no text, ensure at least an empty cell
  if (textCell.length === 0) textCell.push('');

  // Each row: [image, text cell]
  const rows = [
    headerRow,
    [img || '', textCell]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}
