/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-banner. Base: hero.
 * Source: https://www.wknd-trendsetters.site/
 * Selector: section.inverse-section .utility-position-relative
 * Structure: Full-width CTA banner with background image, overlay, heading, text, button.
 * Target: Hero block - row1: background image, row2: heading + text + CTA
 */
export default function parse(element, { document }) {
  // Background image (from captured DOM: <img class="cover-image utility-overlay">)
  const bgImage = element.querySelector('img.cover-image');

  // Heading (from captured DOM: <h2 class="h1-heading"> inside .card-body)
  const heading = element.querySelector('.card-body h2, .card-body h1, h1, h2');

  // Description (from captured DOM: <p class="subheading"> inside .card-body)
  const description = element.querySelector('.card-body p.subheading, .card-body p');

  // CTA button (from captured DOM: <a class="button inverse-button"> inside .button-group)
  const ctaLinks = Array.from(element.querySelectorAll('.button-group a, a.button, a.inverse-button'));

  const cells = [];

  // Row 1: Background image
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: Heading + description + CTAs
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  contentCell.push(...ctaLinks);
  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
