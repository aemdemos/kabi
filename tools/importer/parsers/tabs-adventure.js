/* global WebImporter */

/**
 * Parser for tabs-adventure block
 *
 * Source: https://wknd.site/us/en/adventures.html
 * Base Block: tabs
 *
 * Block Structure (from markdown example):
 * - Row 1-N: Two columns [tab name | tab content]
 *
 * Source HTML Pattern (VALIDATED against captured DOM):
 * <div class="tabs panelcontainer">
 *   <div class="cmp-tabs">
 *     <ol class="cmp-tabs__tablist">
 *       <li class="cmp-tabs__tab">Tab Name</li>
 *       ...
 *     </ol>
 *     <div class="cmp-tabs__tabpanel">
 *       <div class="image-list list">
 *         <ul class="cmp-image-list">
 *           <li class="cmp-image-list__item">
 *             <article>
 *               <a class="cmp-image-list__item-title-link" href="...">
 *                 <span class="cmp-image-list__item-title">Title</span>
 *               </a>
 *               <span class="cmp-image-list__item-description">Description</span>
 *             </article>
 *           </li>
 *         </ul>
 *       </div>
 *     </div>
 *     ...
 *   </div>
 * </div>
 *
 * Generated: 2026-01-09
 */

export default function parse(element, { document }) {
  // Extract tab names
  // VALIDATED: .cmp-tabs__tab exists in source HTML (lines 203-208)
  const tabNames = Array.from(
    element.querySelectorAll('.cmp-tabs__tab, .cmp-tabs__tablist li') || []
  );

  // Extract tab panels
  // VALIDATED: .cmp-tabs__tabpanel exists in source HTML (line 210+)
  const tabPanels = Array.from(
    element.querySelectorAll('.cmp-tabs__tabpanel') || []
  );

  // Build cells array - two columns per tab
  const cells = [];

  tabPanels.forEach((panel, index) => {
    // Get corresponding tab name
    const tabName = tabNames[index]?.textContent?.trim() || `Tab ${index + 1}`;

    // Extract adventure items from this tab panel
    // VALIDATED: .cmp-image-list__item exists in source HTML (lines 213+)
    const listItems = Array.from(
      panel.querySelectorAll('.cmp-image-list__item, .cmp-list__item, li') || []
    );

    // Build content cell with adventure links
    const contentElements = [];

    listItems.forEach((item) => {
      // Extract title link
      // VALIDATED: .cmp-image-list__item-title-link exists (lines 222, 237, 252, etc.)
      const titleLink = item.querySelector(
        '.cmp-image-list__item-title-link, a[href*="adventures"]'
      );

      // Extract title text
      // VALIDATED: .cmp-image-list__item-title exists (lines 223, 238, 253, etc.)
      const titleSpan = item.querySelector(
        '.cmp-image-list__item-title, .cmp-list__item-title'
      );
      const title = titleSpan?.textContent?.trim() || titleLink?.textContent?.trim();

      // Extract description
      // VALIDATED: .cmp-image-list__item-description exists (lines 225, 240, 255, etc.)
      const descSpan = item.querySelector(
        '.cmp-image-list__item-description, .cmp-list__item-description, .description'
      );
      const description = descSpan?.textContent?.trim() || '';

      // Create formatted list item: - **[Title](URL)** - Description
      if (titleLink && title) {
        const href = titleLink.getAttribute('href');

        // Create link element
        const link = document.createElement('a');
        link.href = href;

        // Create strong element for title
        const strong = document.createElement('strong');
        strong.textContent = title;
        link.appendChild(strong);

        // Create text node for description
        const descText = description ? ` - ${description}` : '';

        // Create list item
        const listItem = document.createElement('li');
        listItem.appendChild(link);
        if (descText) {
          listItem.appendChild(document.createTextNode(descText));
        }

        contentElements.push(listItem);
      }
    });

    // Create unordered list to hold all items
    const contentList = document.createElement('ul');
    contentElements.forEach((item) => contentList.appendChild(item));

    // Add row with tab name and content (two columns)
    cells.push([tabName, contentList]);
  });

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Tabs-Adventure',
    cells
  });

  // Replace original element with structured block table
  element.replaceWith(block);
}
