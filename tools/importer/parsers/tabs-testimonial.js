/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-testimonial. Base: tabs.
 * Source: https://www.wknd-trendsetters.site/
 * Selector: .tabs-wrapper
 * Structure: Tabbed testimonials with 4 panels. Each has image, name, role, quote.
 * Target: Tabs block - each row = [tab label | tab content]
 */
export default function parse(element, { document }) {
  // Extract tab panes (from captured DOM: <div class="tab-pane">)
  const tabPanes = Array.from(element.querySelectorAll('.tab-pane'));

  // Extract tab buttons for labels (from captured DOM: <button class="tab-menu-link">)
  const tabButtons = Array.from(element.querySelectorAll('.tab-menu-link, .tab-menu button'));

  const cells = [];

  tabPanes.forEach((pane, index) => {
    // Tab label: person name from the tab button
    const button = tabButtons[index];
    let labelText = '';
    if (button) {
      const nameEl = button.querySelector('strong');
      labelText = nameEl ? nameEl.textContent.trim() : button.textContent.trim();
    }

    // Tab content: the full pane content (image + name + role + quote)
    // Clone the content from the tab pane
    const contentContainer = document.createElement('div');

    // Image (from captured DOM: <img class="cover-image"> in grid)
    const img = pane.querySelector('img.cover-image');
    if (img) contentContainer.append(img);

    // Name (from captured DOM: <strong> in .paragraph-xl)
    const nameEl = pane.querySelector('.paragraph-xl strong');
    if (nameEl) {
      const h3 = document.createElement('h3');
      h3.textContent = nameEl.textContent.trim();
      contentContainer.append(h3);
    }

    // Role (from captured DOM: text after the name div)
    const nameWrapper = pane.querySelector('.paragraph-xl.utility-margin-bottom-0');
    if (nameWrapper) {
      const roleEl = nameWrapper.parentElement ? nameWrapper.parentElement.querySelector(':scope > div:not(.paragraph-xl)') : null;
      if (roleEl) {
        const p = document.createElement('p');
        p.textContent = roleEl.textContent.trim();
        contentContainer.append(p);
      }
    }

    // Quote (from captured DOM: <p class="paragraph-xl"> - the quote text)
    const quoteParas = Array.from(pane.querySelectorAll('p.paragraph-xl'));
    quoteParas.forEach((q) => contentContainer.append(q));

    cells.push([labelText, contentContainer]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
  element.replaceWith(block);
}
