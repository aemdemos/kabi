/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct li children (steps)
  const steps = Array.from(element.querySelectorAll(':scope > li'));
  // Each column = one step
  const columnsCells = steps.map((li, idx) => {
    // Compose: number, image, and description
    const frag = document.createDocumentFragment();

    // Step number (as heading for semantics)
    const stepNum = document.createElement('div');
    stepNum.textContent = (idx + 1).toString();
    stepNum.style.fontWeight = 'bold';
    stepNum.style.fontSize = '2em';
    stepNum.style.textAlign = 'center';
    frag.appendChild(stepNum);

    // The image
    const imgDiv = li.querySelector('.productComoTomar_img');
    if (imgDiv && imgDiv.firstElementChild && imgDiv.firstElementChild.tagName.toLowerCase() === 'img') {
      // Use cloneNode so we don't move it out of DOM
      frag.appendChild(imgDiv.firstElementChild.cloneNode(true));
    }

    // The description
    const p = li.querySelector('p');
    if (p) {
      frag.appendChild(p.cloneNode(true));
    }
    return frag;
  });
  // Create the table manually to ensure header row spans all columns
  const table = document.createElement('table');
  const headerTr = document.createElement('tr');
  const th = document.createElement('th');
  th.textContent = 'Columns (columns30)';
  th.colSpan = String(columnsCells.length);
  headerTr.appendChild(th);
  table.appendChild(headerTr);
  const rowTr = document.createElement('tr');
  columnsCells.forEach(cell => {
    const td = document.createElement('td');
    td.appendChild(cell);
    rowTr.appendChild(td);
  });
  table.appendChild(rowTr);
  element.replaceWith(table);
}
