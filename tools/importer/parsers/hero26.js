/* global WebImporter */
export default function parse(element, { document }) {
  // Extract background image URL from style
  const style = element.getAttribute('style') || '';
  let bgUrl = '';
  const match = style.match(/background-image:\s*url\(([^)]+)\)/i);
  if (match) {
    bgUrl = match[1].replace(/['"]/g, '');
    // If the URL is relative, prepend with the domain
    if (bgUrl.startsWith('/')) {
      bgUrl = 'https://main--sta-boilerplate--aemdemos.hlx.page' + bgUrl;
    }
  }
  // Create image element if there's a background URL
  let bgImg = '';
  if (bgUrl) {
    bgImg = document.createElement('img');
    bgImg.src = bgUrl;
    // Optionally could add alt, width, height, but not present in this HTML
  }
  // Table rows: header, background image, content row (empty, as there is no heading/copy in HTML)
  const cells = [
    ['Hero'],
    [bgImg || ''],
    [''],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
