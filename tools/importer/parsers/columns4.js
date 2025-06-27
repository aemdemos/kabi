/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Extract all columns
  const ul = element.querySelector('ul.productParaQuien_list');
  const lis = ul ? Array.from(ul.children) : [];

  // 2. For each column, combine img and p as the cell content (reference actual elements)
  const columns = lis.map((li) => {
    const img = li.querySelector('img');
    const p = li.querySelector('p');
    const items = [];
    if (img) items.push(img);
    if (p) items.push(p);
    return items.length === 1 ? items[0] : items;
  });

  // 3. Create table rows: header must be single cell, then one row with as many columns as needed
  const cells = [
    ['Columns (columns4)'], // header row: one cell only
    columns                // content row: one cell per column
  ];

  // 4. Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
