/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-testimonial. Base: tabs.
 * Source: https://www.wknd-trendsetters.site/
 * Structure (metadata.json + blocks/tabs-testimonial/tabs-testimonial.js):
 * one row per testimonial, two cells.
 *   Cell 1: portrait image.
 *   Cell 2: name + role + quote.
 *
 * The source has switchable .tab-pane panels plus a separate avatar .tab-menu.
 * The block JS rebuilds the avatar tab menu from each panel's own content, so we
 * only extract the panels (one row each) and ignore the duplicate .tab-menu.
 */
export default function parse(element, { document }) {
  const panes = [...element.querySelectorAll('.tabs-content .tab-pane, .tab-pane')];

  const cells = [];
  panes.forEach((pane) => {
    // Inside each pane the grid has two columns: image div, then text div.
    const cols = [...pane.querySelectorAll(':scope > div > div')];
    const imageCol = cols.find((c) => c.querySelector('img'));
    const textCol = cols.find((c) => c !== imageCol);

    const image = imageCol && imageCol.querySelector('img');
    const textCell = textCol ? [...textCol.children] : [];

    if (image || textCell.length) {
      cells.push([image || '', textCell]);
    }
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
  element.replaceWith(block);
}
