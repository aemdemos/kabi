/* global WebImporter */
export default function parse(element, { document }) {
  // Find the wrapper that contains all user stories
  let wrapper = element;
  // Descend until we have a wrapper whose children are the user story blocks
  while (wrapper && wrapper.children.length === 1) {
    wrapper = wrapper.children[0];
  }
  if (!wrapper) return;
  // Find all user story blocks: must contain both .userStories_img and .userStories_content
  const userStories = [];
  Array.from(wrapper.children).forEach((child) => {
    const img = child.querySelector(':scope > .userStories_img');
    const content = child.querySelector(':scope > .userStories_content');
    if (img && content) {
      // For each column: combine image and content
      userStories.push([img, content]);
    }
  });

  // Only build table if we have at least one column (user story)
  if (userStories.length === 0) return;

  // Table structure: header row with one cell, second row with N columns
  const header = ['Columns (columns24)'];
  const tableRows = [header, userStories.map(story => story)];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
