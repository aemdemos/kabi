/* global WebImporter */
export default function parse(element, { document }) {
  // Get background-image url from style attribute
  const style = element.getAttribute('style') || '';
  let imgUrl = null;
  // Look for url(...) pattern
  const urlMatch = style.match(/url\((['"]?)([^'")]+)\1\)/);
  if (urlMatch && urlMatch[2]) {
    imgUrl = urlMatch[2];
    // Make relative URLs absolute
    const link = document.createElement('a');
    link.href = imgUrl;
    imgUrl = link.href;
  }

  let imgEl = '';
  if (imgUrl) {
    imgEl = document.createElement('img');
    imgEl.src = imgUrl;
    // No alt text available in this source
  }

  // Build block table according to example: 1 column, 3 rows, 'Hero' header, image, empty cell
  const cells = [
    ['Hero'],
    [imgEl],
    [''],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
