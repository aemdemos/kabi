/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-article block
 * Base block: cards
 * Structure: 2 columns per card (image | text content)
 * Articles selector: main > section:nth-child(5) .grid-layout.desktop-4-column
 */
export default function parse(element, { document }) {
  const cells = [];

  // Get all article card links
  const articleCards = element.querySelectorAll('a.article-card, .article-card');

  if (articleCards.length > 0) {
    articleCards.forEach(card => {
      // Get the image from the card
      const img = card.querySelector('img');

      // Get the text content (category, date, heading)
      const textContent = document.createElement('div');

      // Get category tag
      const tag = card.querySelector('.tag');
      if (tag) {
        const tagP = document.createElement('p');
        tagP.textContent = tag.textContent.trim();
        textContent.appendChild(tagP);
      }

      // Get heading
      const heading = card.querySelector('h3, h4');
      if (heading) {
        const h = document.createElement('h3');
        h.textContent = heading.textContent.trim();
        textContent.appendChild(h);
      }

      // Get date
      const date = card.querySelector('.article-card-meta .paragraph-sm');
      if (date) {
        const dateP = document.createElement('p');
        dateP.textContent = date.textContent.trim();
        textContent.appendChild(dateP);
      }

      // Get link URL
      const link = card.getAttribute('href');
      if (link) {
        const linkP = document.createElement('p');
        const linkA = document.createElement('a');
        linkA.href = link;
        linkA.textContent = 'Read more';
        linkP.appendChild(linkA);
        textContent.appendChild(linkP);
      }

      // Cards format: [image, text] per row
      cells.push([img, textContent]);
    });
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-article',
    cells
  });

  element.replaceWith(block);
}
