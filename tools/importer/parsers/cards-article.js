/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article. Base: cards.
 * Source: https://www.wknd-trendsetters.site/
 * Selector: .grid-layout.desktop-4-column.grid-gap-md
 * Structure: 4 article cards with image, tag, date, title, link.
 * Target: Cards block - each row = [image | heading + text + link]
 */
export default function parse(element, { document }) {
  // Extract article cards (from captured DOM: <a class="article-card card-link">)
  const articleCards = Array.from(element.querySelectorAll('a.article-card, .article-card'));

  const cells = [];

  articleCards.forEach((card) => {
    // Image (from captured DOM: <img class="cover-image"> in .article-card-image)
    const img = card.querySelector('.article-card-image img, img.cover-image');

    // Text content container
    const textContent = document.createElement('div');

    // Category tag (from captured DOM: <span class="tag">)
    const tag = card.querySelector('.tag');
    if (tag) {
      const tagP = document.createElement('p');
      tagP.append(document.createElement('em'));
      tagP.querySelector('em').textContent = tag.textContent.trim();
      textContent.append(tagP);
    }

    // Date (from captured DOM: <span class="paragraph-sm utility-text-secondary">)
    const dateMeta = card.querySelector('.article-card-meta .paragraph-sm.utility-text-secondary');
    if (dateMeta) {
      const dateP = document.createElement('p');
      dateP.textContent = dateMeta.textContent.trim();
      textContent.append(dateP);
    }

    // Title (from captured DOM: <h3 class="h4-heading">)
    const title = card.querySelector('h3, .h4-heading');
    if (title) {
      const h3 = document.createElement('h3');
      h3.textContent = title.textContent.trim();
      textContent.append(h3);
    }

    // Link (from the card's href)
    const href = card.getAttribute('href');
    if (href) {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = 'Read more';
      const linkP = document.createElement('p');
      linkP.append(link);
      textContent.append(linkP);
    }

    if (img) {
      cells.push([img, textContent]);
    } else {
      cells.push([textContent]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
