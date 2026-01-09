/* global WebImporter */

/**
 * Parser for hero-adventure block
 *
 * Source: https://wknd.site/us/en/adventures.html
 * Base Block: hero
 *
 * Block Structure (from markdown example):
 * - Row 1: Single column containing image, heading, and description
 *
 * Source HTML Pattern (VALIDATED against captured DOM):
 * <div class="teaser cmp-teaser--hero">
 *   <div class="cmp-teaser">
 *     <div class="cmp-teaser__content">
 *       <h2 class="cmp-teaser__title">Heading</h2>
 *       <div class="cmp-teaser__description"><p>Description</p></div>
 *     </div>
 *     <div class="cmp-teaser__image">
 *       <img src="..." alt="..." class="cmp-image__image">
 *     </div>
 *   </div>
 * </div>
 *
 * Generated: 2026-01-09
 */

export default function parse(element, { document }) {
  // Extract content from source HTML
  // Using selectors validated against actual WKND HTML structure

  // VALIDATED: .cmp-teaser__image img exists in source HTML (line 186)
  const image = element.querySelector('.cmp-teaser__image img, .cmp-image__image') ||
                element.querySelector('img');

  // VALIDATED: h2.cmp-teaser__title exists in source HTML (line 177-178)
  const heading = element.querySelector('h2.cmp-teaser__title, .cmp-teaser__title') ||
                  element.querySelector('h1, h2, h3') ||
                  element.querySelector('[class*="title"]');

  // VALIDATED: .cmp-teaser__description exists in source HTML (line 180-182)
  const description = element.querySelector('.cmp-teaser__description p, .cmp-teaser__description') ||
                      element.querySelector('p') ||
                      element.querySelector('[class*="description"]');

  // Build cells array matching markdown example structure
  // Single column with all content combined
  const contentCell = [];

  if (image) contentCell.push(image);
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);

  const cells = [contentCell];

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Hero-Adventure',
    cells
  });

  // Replace original element with structured block table
  element.replaceWith(block);
}
