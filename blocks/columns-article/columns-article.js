import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Decorate the columns-article block.
 *
 * Two-column featured/case-study row:
 *   left  = single cover image (3:2)
 *   right = breadcrumb + heading + author/meta line
 *
 * Authored as a single row with two cells.
 */
export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;

  [...row.children].forEach((col) => {
    if (col.querySelector('picture, img')) {
      col.classList.add('columns-article-media');
      col.querySelectorAll('img').forEach((img) => {
        if (!img.closest('picture')) {
          const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          img.replaceWith(optimized);
        }
      });
    } else {
      col.classList.add('columns-article-text');
    }
  });
}
