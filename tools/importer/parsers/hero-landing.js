/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-landing. Base: hero.
 * Source: https://www.wknd-trendsetters.site/
 * Selector: header.section.secondary-section .grid-layout.grid-gap-xxl
 * Structure: Two-column hero with heading+text+buttons on left, image grid on right.
 * Target: Hero block - row1: images, row2: heading + text + CTAs
 */
export default function parse(element, { document }) {
  // Extract heading (from captured DOM: <h1 class="h1-heading">)
  const heading = element.querySelector('h1, h2, .h1-heading');

  // Extract description paragraph (from captured DOM: <p class="subheading">)
  const description = element.querySelector('p.subheading, p');

  // Extract CTA buttons (from captured DOM: <div class="button-group"> with <a class="button">)
  const ctaLinks = Array.from(element.querySelectorAll('.button-group a.button, a.button'));

  // Extract images (from captured DOM: <img class="cover-image"> in the right grid)
  const images = Array.from(element.querySelectorAll('img.cover-image'));

  const cells = [];

  // Row 1: Images (background/hero images)
  if (images.length > 0) {
    cells.push(images);
  }

  // Row 2: Heading + description + CTAs
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  contentCell.push(...ctaLinks);
  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-landing', cells });
  element.replaceWith(block);
}
