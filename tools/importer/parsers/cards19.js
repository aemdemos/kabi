/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per requirement
  const headerRow = ['Cards (cards19)'];
  const rows = [headerRow];

  const view = element.querySelector('.view');
  if (!view) return;

  // Each card is a direct child of .view
  const cardDivs = Array.from(view.children);
  cardDivs.forEach((cardDiv) => {
    // Image (first column)
    const imgEl = cardDiv.querySelector('.userStories_img img');
    // Text Content (second column)
    const userContent = cardDiv.querySelector('.userStories_content');
    const contentParts = [];
    if (userContent) {
      // Title (h3)
      const h3 = userContent.querySelector('h3');
      if (h3) contentParts.push(h3);
      // Testimonial (p.userStories_testimonial)
      const testimonial = userContent.querySelector('p.userStories_testimonial');
      if (testimonial) contentParts.push(testimonial);
      // Description (userStories_desc)
      const descDiv = userContent.querySelector('.userStories_desc');
      if (descDiv) {
        // Remove empty paragraphs (&nbsp;)
        Array.from(descDiv.querySelectorAll('p')).forEach((p) => {
          if (!p.textContent.trim().replace(/\u00a0|\s/g, '')) {
            p.remove();
          }
        });
        // If cleaned description has remaining content
        if (descDiv.textContent.trim()) {
          contentParts.push(descDiv);
        }
      }
    }
    // Only add if both image and text exist
    if (imgEl && contentParts.length) {
      rows.push([
        imgEl,
        contentParts.length === 1 ? contentParts[0] : contentParts
      ]);
    }
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
