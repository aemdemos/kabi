/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-editorial. Base: columns.
 * Source: https://www.wknd-trendsetters.site/
 * Columns blocks do NOT require field hints (xwalk exception).
 * Structure: 1 row with 2 columns (image | metadata content)
 */
export default function parse(element, { document }) {
  // Column 1: Large image
  const image = element.querySelector('.cover-image, img');
  const col1 = document.createDocumentFragment();
  if (image) {
    const pic = image.closest('picture') || image;
    col1.appendChild(pic.cloneNode(true));
  }

  // Column 2: Breadcrumb + heading + author + date
  const col2 = document.createDocumentFragment();

  // Breadcrumb links
  const breadcrumbLinks = element.querySelectorAll('.breadcrumbs a, .breadcrumb a');
  if (breadcrumbLinks.length > 0) {
    const breadP = document.createElement('p');
    breadcrumbLinks.forEach((link, idx) => {
      if (idx > 0) breadP.appendChild(document.createTextNode(' > '));
      breadP.appendChild(link.cloneNode(true));
    });
    col2.appendChild(breadP);
  }

  // H2 heading
  const heading = element.querySelector('h2');
  if (heading) col2.appendChild(heading.cloneNode(true));

  // Author info
  const authorName = element.querySelector('.utility-text-black, .paragraph-sm.utility-text-black');
  if (authorName) {
    const authorP = document.createElement('p');
    authorP.textContent = 'By ' + authorName.textContent.trim();
    col2.appendChild(authorP);
  }

  // Date and read time
  const dateEl = element.querySelector('.utility-margin-top-0-5rem .utility-text-secondary, .flex-gap-xxs.utility-margin-top-0-5rem');
  if (dateEl) {
    const dateP = document.createElement('p');
    const dateTexts = dateEl.querySelectorAll('.utility-text-secondary');
    const parts = [];
    dateTexts.forEach((t) => {
      const text = t.textContent.trim();
      if (text !== '•') parts.push(text);
    });
    dateP.textContent = parts.join(' · ');
    col2.appendChild(dateP);
  }

  const cells = [[col1, col2]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-editorial', cells });
  element.replaceWith(block);
}
