/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-articles. Base: cards.
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-06-03
 *
 * Layout: 4-column grid of article cards. Each card is an <a class="article-card card-link">
 * containing a cover image, a tag chip, a date, and an h3 heading.
 *
 * Output table: one row per card with two cells:
 *   [image | tag + date + heading + clickable link]
 */
export default function parse(element, { document }) {
  // Each card is an <a> with class "article-card". Prefer direct children of the grid,
  // and fall back to any descendant article cards if the element passed in wraps the grid.
  let cards = Array.from(element.querySelectorAll(':scope > a.article-card'));
  if (!cards.length) {
    cards = Array.from(element.querySelectorAll('a.article-card'));
  }

  const cells = [];

  cards.forEach((card) => {
    // Image cell: cover image inside .article-card-image
    const image = card.querySelector('.article-card-image img, img.cover-image, img');

    // Content cell: tag, date, heading, and a clickable link preserving the article URL
    const tag = card.querySelector('.article-card-meta .tag, .tag');
    const date = card.querySelector('.article-card-meta .paragraph-sm, .article-card-meta span:not(.tag)');
    const heading = card.querySelector('h1, h2, h3, h4, .h4-heading');

    const contentParts = [];
    if (tag) contentParts.push(tag);
    if (date) contentParts.push(date);
    if (heading) contentParts.push(heading);

    // Preserve the article URL as a clickable link.
    const href = card.getAttribute('href');
    if (href) {
      const linkLabel = heading ? heading.textContent.trim() : (card.textContent.trim() || 'Read more');
      const cardLink = document.createElement('a');
      cardLink.href = href;
      cardLink.textContent = linkLabel;
      contentParts.push(cardLink);
    }

    cells.push([image, contentParts]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-articles', cells });
  element.replaceWith(block);
}
