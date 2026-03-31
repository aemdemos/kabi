/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs-testimonial block
 * Base block: tabs
 * Structure: Multiple rows, each tab = 1 row with 2 columns (tab label | tab content)
 * Tabs selector: main > section:nth-child(4) .tabs-wrapper
 */
export default function parse(element, { document }) {
  const cells = [];

  // Get all tab panes (content)
  const tabPanes = element.querySelectorAll('.tab-pane');
  // Get all tab menu buttons (labels)
  const tabButtons = element.querySelectorAll('.tab-menu-link');

  // Match tabs with their content
  for (let i = 0; i < tabPanes.length; i++) {
    const pane = tabPanes[i];
    const button = tabButtons[i];

    // Get tab label from button
    let tabLabel = '';
    if (button) {
      const nameElement = button.querySelector('.paragraph-sm strong');
      if (nameElement) {
        tabLabel = nameElement.textContent.trim();
      }
    }

    // Get tab content
    const tabContent = document.createElement('div');

    // Get image from tab pane
    const img = pane.querySelector('img');
    if (img) {
      tabContent.appendChild(img.cloneNode(true));
    }

    // Get name and title
    const name = pane.querySelector('.paragraph-xl strong');
    if (name) {
      const nameP = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = name.textContent.trim();
      nameP.appendChild(strong);
      tabContent.appendChild(nameP);
    }

    const role = pane.querySelector('.paragraph-xl.utility-margin-bottom-0 + div');
    if (role) {
      const roleP = document.createElement('p');
      roleP.textContent = role.textContent.trim();
      tabContent.appendChild(roleP);
    }

    // Get quote text
    const quote = pane.querySelector('p.paragraph-xl');
    if (quote) {
      tabContent.appendChild(quote.cloneNode(true));
    }

    // Tabs format: [tab label, tab content] per row
    cells.push([tabLabel, tabContent]);
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'tabs-testimonial',
    cells
  });

  element.replaceWith(block);
}
