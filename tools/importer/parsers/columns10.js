/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must be exactly one column
  const headerRow = ['Columns (columns10)'];

  // Extract heading, intro and columns
  const children = Array.from(element.children);
  const heading = children.find((el) => el.tagName.toLowerCase() === 'h2');
  const intro = children.find((el) => el.tagName.toLowerCase() === 'p');
  const ul = children.find((el) => el.tagName.toLowerCase() === 'ul');

  // Compose main cell (heading + intro)
  const cell0 = document.createElement('div');
  if (heading) cell0.appendChild(heading);
  if (intro) cell0.appendChild(intro);

  // Compose each column cell from each <li>
  let columns = [];
  if (ul) {
    const lis = Array.from(ul.children).filter(li => li.tagName.toLowerCase() === 'li');
    columns = lis.map((li) => {
      const frag = document.createElement('div');
      Array.from(li.children).forEach(child => frag.appendChild(child));
      return frag;
    });
  }

  // The table must have a single-cell header row, then a row with N columns
  const rows = [
    headerRow,
    [cell0, ...columns]
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
