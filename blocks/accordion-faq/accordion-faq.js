/*
 * accordion-faq
 * Expandable question/answer pairs, rendered with native <details>/<summary>.
 * Each authored row has a question cell and an answer cell.
 */

import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  [...block.children].forEach((row) => {
    // question → summary
    const label = row.children[0];
    const summary = document.createElement('summary');
    summary.className = 'accordion-faq-question';
    summary.append(...label.childNodes);

    // answer → body
    const body = row.children[1];
    body.className = 'accordion-faq-answer';

    const details = document.createElement('details');
    moveInstrumentation(row, details);
    details.className = 'accordion-faq-item';
    details.append(summary, body);
    row.replaceWith(details);
  });
}
