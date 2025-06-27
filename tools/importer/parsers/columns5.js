/* global WebImporter */
export default function parse(element, { document }) {
  // Get both major columns: .recipePrep and .recipeIngredients
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  // Defensive: Ensure we have at least two columns, otherwise gracefully degrade
  const leftCol = columns[0] || document.createElement('div');
  const rightCol = columns[1] || document.createElement('div');

  // Block table, header exactly matching requirements
  const headerRow = ['Columns (columns5)'];
  const contentRow = [leftCol, rightCol];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace original element with the generated block
  element.replaceWith(block);
}
