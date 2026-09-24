import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Decorate the tabs-testimonial block.
 *
 * Each authored row is one testimonial with two cells:
 *   cell 1: portrait image
 *   cell 2: name, role, and quote
 *
 * Renders switchable panels plus an avatar tab menu (portrait + name + role)
 * built from each panel's own content.
 */
export default function decorate(block) {
  const tablist = document.createElement('div');
  tablist.className = 'tabs-testimonial-list';
  tablist.setAttribute('role', 'tablist');

  const panels = [...block.children];

  panels.forEach((panel, i) => {
    const id = `testimonial-${i}`;
    panel.className = 'tabs-testimonial-panel';
    panel.id = `tabpanel-${id}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-hidden', i !== 0);
    panel.setAttribute('aria-labelledby', `tab-${id}`);

    const cells = [...panel.children];
    const imageCell = cells.find((c) => c.querySelector('picture, img'));
    const textCell = cells.find((c) => c !== imageCell);
    if (imageCell) imageCell.classList.add('tabs-testimonial-portrait');
    if (textCell) textCell.classList.add('tabs-testimonial-text');

    // Optimize the portrait image.
    const img = imageCell && imageCell.querySelector('img');
    if (img && !img.closest('picture')) {
      const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]);
      moveInstrumentation(img, optimized.querySelector('img'));
      img.replaceWith(optimized);
    }

    // Build the tab button from the panel's avatar + first two text lines.
    const button = document.createElement('button');
    button.className = 'tabs-testimonial-tab';
    button.id = `tab-${id}`;
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');
    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', i === 0);

    const avatarSrc = img ? img.src : (imageCell && imageCell.querySelector('img')?.src);
    if (avatarSrc) {
      const avatar = createOptimizedPicture(avatarSrc, '', false, [{ width: '80' }]);
      avatar.className = 'tabs-testimonial-avatar';
      button.append(avatar);
    }
    const label = document.createElement('span');
    label.className = 'tabs-testimonial-tab-label';
    const lines = textCell ? [...textCell.children].slice(0, 2) : [];
    lines.forEach((line) => label.append(line.cloneNode(true)));
    button.append(label);

    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((p) => p.setAttribute('aria-hidden', true));
      tablist.querySelectorAll('button').forEach((b) => b.setAttribute('aria-selected', false));
      panel.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });

    tablist.append(button);
  });

  block.append(tablist);
}
