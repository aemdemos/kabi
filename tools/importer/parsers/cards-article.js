/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article. Base: cards.
 * Source: https://www.wknd-trendsetters.site/
 * Structure (metadata.json + cards convention): one row per card, two cells.
 *   Cell 1: cover image (mandatory).
 *   Cell 2: text content — category tag + date + title (linked).
 *
 * NOTE (inline-wrapper trap): each card is a sibling <a class="article-card">
 * wrapping block-level content. Runs of adjacent anchors can be merged by html2md
 * preprocessing, collapsing N cards into 1. So iteration is keyed on the stable
 * inner .article-card-body wrapper, not the anchor, and the card href is read off
 * the wrapping anchor and re-attached to the title.
 */
export default function parse(element, { document }) {
  // Prefer the inner block wrapper as the iteration key (immune to anchor merging).
  let bodies = [...element.querySelectorAll(':scope > a .article-card-body')];
  if (!bodies.length) {
    // Fallback: anchors are intact in this DOM.
    bodies = [...element.querySelectorAll(':scope > a.article-card')]
      .map((a) => a.querySelector('.article-card-body'))
      .filter(Boolean);
  }

  const cells = [];
  bodies.forEach((body) => {
    const card = body.closest('a.article-card') || body.parentElement;
    const image = card && card.querySelector('.article-card-image img, img');
    const href = card && card.tagName === 'A' ? card.getAttribute('href') : null;

    const bodyCell = [];
    const meta = body.querySelector('.article-card-meta');
    if (meta) bodyCell.push(meta);

    const heading = body.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
    if (heading && href) {
      // Re-attach the card link to the title so the link is not lost.
      const link = document.createElement('a');
      link.setAttribute('href', href);
      link.append(...heading.childNodes);
      heading.append(link);
    }
    if (heading) bodyCell.push(heading);

    cells.push([image || '', bodyCell]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
