/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-testimonial. Base: tabs.
 * Source: https://www.wknd-trendsetters.site/
 * Model fields per item: title (skip - tabs component), content_heading, content_headingType (collapsed),
 *   content_image (reference), content_richtext (richtext)
 * Structure: Each tab = 1 row with 2 columns (tab label | tab panel content)
 */
export default function parse(element, { document }) {
  // Each .tab-pane is one tab panel
  const panels = element.querySelectorAll('.tab-pane');
  // Tab buttons hold the labels
  const tabButtons = element.querySelectorAll('.tab-menu-link');
  const cells = [];

  panels.forEach((panel, i) => {
    // Col 1: Tab label (name + role from button)
    const labelFrag = document.createDocumentFragment();
    if (tabButtons[i]) {
      const strong = tabButtons[i].querySelector('strong');
      const role = tabButtons[i].querySelector('.paragraph-sm:not(:first-child), .paragraph-sm.utility-margin-bottom-0:last-child');
      const labelText = [];
      if (strong) labelText.push(strong.textContent.trim());
      if (role) labelText.push(role.textContent.trim());
      const p = document.createElement('p');
      p.textContent = labelText.join(' - ');
      labelFrag.appendChild(p);
    }

    // Col 2: Tab panel content (image + name + role + quote)
    const contentFrag = document.createDocumentFragment();

    // Image with field hint
    const img = panel.querySelector('img');
    if (img) {
      contentFrag.appendChild(document.createComment(' field:content_image '));
      const pic = img.closest('picture') || img;
      contentFrag.appendChild(pic.cloneNode(true));
    }

    // Name as heading with field hint
    const name = panel.querySelector('strong');
    if (name) {
      contentFrag.appendChild(document.createComment(' field:content_heading '));
      const h3 = document.createElement('h3');
      h3.textContent = name.textContent.trim();
      contentFrag.appendChild(h3);
    }

    // Role + quote as richtext
    const roleEl = panel.querySelector('.paragraph-xl.utility-margin-bottom-0 + div, strong + div');
    const quote = panel.querySelector('p.paragraph-xl');
    contentFrag.appendChild(document.createComment(' field:content_richtext '));
    if (roleEl) {
      const roleP = document.createElement('p');
      roleP.textContent = roleEl.textContent.trim();
      contentFrag.appendChild(roleP);
    }
    if (quote) {
      contentFrag.appendChild(quote.cloneNode(true));
    }

    cells.push([labelFrag, contentFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
  element.replaceWith(block);
}
