/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-testimonials. Base: tabs.
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-06-03
 *
 * Source layout: a `.tabs-wrapper` that contains:
 *   - `.tabs-content` with `.tab-pane[id="tabpanel-N"]` items, each holding
 *     a hero image, a name (strong), a role line, and a quote paragraph.
 *   - `.tab-menu` with `<button class="tab-menu-link" id="tab-N">` items, each
 *     holding an avatar image plus a name + role label.
 *
 * Target block (Tabs, 2 columns, N+1 rows):
 *   Row 1: block name only
 *   Row 2..N+1: [Tab Label | Tab Content]
 *     - Tab Label: avatar image + name (strong) + role from the matching `.tab-menu-link`.
 *     - Tab Content: cover image + name (strong) + role + quote from the matching `.tab-pane`.
 */
export default function parse(element, { document }) {
  // Tab triggers (label cells) and tab panes (content cells).
  const tabButtons = Array.from(element.querySelectorAll('.tab-menu .tab-menu-link, button.tab-menu-link'));
  const tabPanes = Array.from(element.querySelectorAll('.tabs-content .tab-pane, .tab-pane'));

  // Pair buttons to panes by index, preferring id-based pairing (tab-N <-> tabpanel-N) when ids exist.
  const pairs = [];
  const usedPaneIndexes = new Set();

  tabButtons.forEach((btn, idx) => {
    let pane = null;
    const btnId = btn.getAttribute('id') || '';
    const match = btnId.match(/tab-(\d+)/);
    if (match) {
      const targetId = `tabpanel-${match[1]}`;
      pane = tabPanes.find((p) => p.getAttribute('id') === targetId) || null;
    }
    if (!pane && tabPanes[idx]) {
      pane = tabPanes[idx];
    }
    if (pane) usedPaneIndexes.add(tabPanes.indexOf(pane));
    pairs.push({ btn, pane });
  });

  // Include any panes that didn't get matched to a button (graceful fallback).
  tabPanes.forEach((pane, idx) => {
    if (!usedPaneIndexes.has(idx)) {
      pairs.push({ btn: null, pane });
    }
  });

  const cells = [];

  pairs.forEach(({ btn, pane }) => {
    // ---- Tab Label cell (from the menu button) ----
    const labelParts = [];
    if (btn) {
      const avatarImg = btn.querySelector('.avatar img, img.cover-image, img');
      if (avatarImg) labelParts.push(avatarImg);

      // Name + role text container inside the button (the <div> sibling of `.avatar`).
      const btnTextBlocks = Array.from(btn.querySelectorAll(':scope > div > div:not(.avatar)'));
      btnTextBlocks.forEach((blk) => labelParts.push(blk));

      // Fallback: if the structured selector didn't find anything, fall back to all
      // text-bearing direct-children divs except the avatar wrapper.
      if (btnTextBlocks.length === 0) {
        const fallbackTextBlocks = Array.from(btn.querySelectorAll('div')).filter(
          (d) => !d.classList.contains('avatar')
            && !d.querySelector('img')
            && d.textContent.trim().length > 0,
        );
        fallbackTextBlocks.forEach((blk) => labelParts.push(blk));
      }
    }

    // ---- Tab Content cell (from the tab pane) ----
    const contentParts = [];
    if (pane) {
      const paneImg = pane.querySelector('img.cover-image, img');
      if (paneImg) contentParts.push(paneImg);

      // Name + role: the inner <div> containing <strong> and the role line.
      const nameRoleBlock = pane.querySelector('.paragraph-xl strong')
        ? pane.querySelector('.paragraph-xl strong').closest('div').parentElement
        : null;
      if (nameRoleBlock) {
        contentParts.push(nameRoleBlock);
      } else {
        // Fallback: collect the strong + the role div directly.
        const strongEl = pane.querySelector('strong');
        if (strongEl) contentParts.push(strongEl.parentElement || strongEl);
      }

      // Quote paragraph (the long testimonial text).
      const quote = pane.querySelector('p.paragraph-xl, p');
      if (quote) contentParts.push(quote);
    }

    cells.push([labelParts, contentParts]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonials', cells });
  element.replaceWith(block);
}
