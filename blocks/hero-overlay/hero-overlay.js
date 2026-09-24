import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Decorate the hero-overlay block.
 *
 * Expected authored structure (rows):
 *   row 1: background/cover image
 *   row 2: text content (heading, subheading, CTA button)
 *
 * The block renders the image as a full-bleed background with a dark overlay,
 * and stacks the text content on top of it.
 */
export default function decorate(block) {
  const rows = [...block.children];

  // First row that contains a picture/image is the background.
  const imageRow = rows.find((row) => row.querySelector('picture, img'));
  // The content row is the first row without an image (fallbacks handled below).
  const contentRow = rows.find((row) => row !== imageRow && row.textContent.trim());

  if (imageRow) {
    imageRow.classList.add('hero-overlay-background');
    const img = imageRow.querySelector('img');
    if (img && !imageRow.querySelector('picture')) {
      const optimized = createOptimizedPicture(img.src, img.alt, true, [{ width: '1600' }]);
      img.replaceWith(optimized);
    }
    // Dark overlay layer sits between the image and the content.
    const overlay = document.createElement('div');
    overlay.className = 'hero-overlay-scrim';
    imageRow.append(overlay);
  } else {
    block.classList.add('no-image');
  }

  if (contentRow) {
    contentRow.classList.add('hero-overlay-content');
  }
}
