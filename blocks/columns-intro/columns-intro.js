import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Decorate the columns-intro block.
 *
 * Two-column intro row:
 *   left  = heading + subheading + CTA button group (text column)
 *   right = stacked group of cover images (image column)
 *
 * Authored as a single row with two cells.
 */
export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;

  const cols = [...row.children];
  cols.forEach((col) => {
    const hasImage = col.querySelector('picture, img');
    if (hasImage) {
      col.classList.add('columns-intro-media');
      col.querySelectorAll('img').forEach((img) => {
        if (!img.closest('picture')) {
          const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          img.replaceWith(optimized);
        }
      });
    } else {
      col.classList.add('columns-intro-text');
    }
  });
}
