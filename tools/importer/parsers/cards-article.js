/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article. Base: cards.
 * Source: https://www.wknd-trendsetters.site/
 * Model fields: image (reference), text (richtext) - container block
 * Structure: Each card = 1 row with 2 columns (image | text with tag + date + title)
 */
export default function parse(element, { document }) {
  // Each .article-card is one card item
  const items = element.querySelectorAll('.article-card, a.article-card');
  const cells = [];

  items.forEach((item) => {
    // Col 1: Image with field hint
    const imgFrag = document.createDocumentFragment();
    imgFrag.appendChild(document.createComment(' field:image '));
    const img = item.querySelector('.article-card-image img, img');
    if (img) {
      const pic = img.closest('picture') || img;
      imgFrag.appendChild(pic.cloneNode(true));
    }

    // Col 2: Text content (tag + date + title + link)
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));

    const tag = item.querySelector('.tag');
    const date = item.querySelector('.article-card-meta .paragraph-sm, .article-card-meta .utility-text-secondary');
    const heading = item.querySelector('h3');

    if (tag) {
      const tagP = document.createElement('p');
      tagP.textContent = tag.textContent.trim();
      textFrag.appendChild(tagP);
    }
    if (date) {
      const dateP = document.createElement('p');
      dateP.textContent = date.textContent.trim();
      textFrag.appendChild(dateP);
    }
    if (heading) {
      textFrag.appendChild(heading.cloneNode(true));
    }

    // Add link if the card is an anchor
    const href = item.getAttribute('href');
    if (href) {
      const linkP = document.createElement('p');
      const a = document.createElement('a');
      a.href = href;
      a.textContent = heading ? heading.textContent.trim() : 'Read more';
      linkP.appendChild(a);
      textFrag.appendChild(linkP);
    }

    cells.push([imgFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
