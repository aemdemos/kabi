/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-overlay block
 * Base block: hero
 * Structure: 1 row with 1 column containing image, heading, content
 */
export default function parse(element, { document }) {
  const cells = [];

  // Create a single cell with all hero content
  const heroContent = document.createElement('div');

  // Get background image
  const bgImage = element.querySelector('img');
  if (bgImage) {
    heroContent.appendChild(bgImage.cloneNode(true));
  }

  // Get heading
  const heading = element.querySelector('h2, h1');
  if (heading) {
    heroContent.appendChild(heading.cloneNode(true));
  }

  // Get paragraph
  const paragraph = element.querySelector('p');
  if (paragraph) {
    heroContent.appendChild(paragraph.cloneNode(true));
  }

  // Get button/link
  const button = element.querySelector('a.button, .button a');
  if (button) {
    const link = document.createElement('p');
    const anchor = document.createElement('a');
    anchor.href = button.getAttribute('href') || button.parentElement.getAttribute('href') || '#';
    anchor.textContent = button.textContent.trim();
    link.appendChild(anchor);
    heroContent.appendChild(link);
  }

  // Hero format: single row with all content in one cell
  cells.push([heroContent]);

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'hero-overlay',
    cells
  });

  element.replaceWith(block);
}
