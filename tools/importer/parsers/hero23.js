/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero section with background image
  const hero = element.querySelector('.quienesSomos_hero');

  // Extract the background image URL from the style attribute
  let bgImgUrl = null;
  if (hero && hero.style && hero.style.backgroundImage) {
    const match = hero.style.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/);
    if (match) {
      bgImgUrl = match[1];
      // Make URL absolute if necessary
      if (bgImgUrl && !/^https?:/.test(bgImgUrl)) {
        const a = document.createElement('a');
        a.href = bgImgUrl;
        bgImgUrl = a.href;
      }
    }
  }

  // Create the image element for use in the table (if any)
  let imgEl = '';
  if (bgImgUrl) {
    imgEl = document.createElement('img');
    imgEl.src = bgImgUrl;
    imgEl.alt = '';
  }

  // Compose the content cell: all content relevant to the hero block (heading, subheading, etc)
  // According to the example, this consists of the main heading and the subheading (claim)
  const contentCell = [];
  // Main title (usually outside hero div, but styled as the heading)
  const mainTitle = element.querySelector('.mainTitle h1, h1');
  if (mainTitle) contentCell.push(mainTitle);
  // Subheading or claim (inside hero div)
  if (hero) {
    const claim = hero.querySelector('.quienesSomos_claim');
    if (claim) {
      // Add line break between heading and subheading if both exist
      if (contentCell.length > 0) contentCell.push(document.createElement('br'));
      contentCell.push(claim);
    }
  }
  // Add only if not empty, else empty string
  const contentRow = contentCell.length ? contentCell : '';

  // Compose table with header row matching example exactly
  const cells = [
    ['Hero'],
    [imgEl],
    [contentRow]
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the table
  element.replaceWith(table);
}
