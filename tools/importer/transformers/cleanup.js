/* eslint-disable */
/* global WebImporter */

/**
 * Site-wide cleanup transformer for WKND Trendsetters (wknd-trendsetters.site).
 *
 * All selectors are taken from the captured DOM in
 * migration-work/cleaned.html. They are not guessed.
 *
 * Removed (non-authorable site chrome / decorative wrappers):
 *   - <a class="skip-link">             (a11y skip link, top of <body>)
 *   - .navbar                           (global header / mega-menu, top of <body>)
 *   - footer.footer                     (global inverse footer, bottom of <body>)
 *   - script / style / link / noscript / iframe   (non-authorable head/body chrome)
 *
 * Decorative inline SVGs (data:image/svg+xml;base64,...) appear as <img> tags
 * inside main content as well:
 *   - .breadcrumbs > img                (chevron between breadcrumb links)
 *   - .button-icon > img                (arrow inside text-button — none survive in
 *                                        main content after navbar removal, but kept
 *                                        for safety)
 *   - .faq-question > img               (toggle plus icon inside <summary>)
 * These are presentation-only and have no authorable equivalent — strip them.
 *
 * The hero/article/cards/tabs/CTA <img> tags are real PNG content (./images/*.png)
 * and must NOT be removed.
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Strip global site chrome BEFORE block parsing so block parsers
    // do not accidentally pick up navbar/footer markup.
    WebImporter.DOMUtils.remove(element, [
      'a.skip-link',
      '.navbar',
      'footer.footer',
      'script',
      'style',
      'noscript',
      'iframe',
    ]);

    // Remove decorative inline base64 SVG icons that survive inside main content.
    // We only target <img> tags whose src is a base64-encoded SVG — leaving real
    // PNG content imagery (./images/*.png) untouched.
    element.querySelectorAll('img[src^="data:image/svg+xml;base64"]').forEach((img) => {
      img.remove();
    });
  }

  if (hookName === TransformHook.afterTransform) {
    // Defensive second pass: any leftover non-authorable elements after parsers
    // have run. The selectors are intentionally conservative — same selectors
    // that were used in beforeTransform — to avoid removing authorable content.
    WebImporter.DOMUtils.remove(element, [
      'a.skip-link',
      '.navbar',
      'footer.footer',
      'header.navbar',
      'script',
      'style',
      'link',
      'noscript',
      'iframe',
    ]);

    // Strip non-authorable presentational attributes left behind by the
    // source build (Astro scoped style hashes). These add noise to the
    // imported markdown without changing rendering.
    element.querySelectorAll('*').forEach((el) => {
      // Astro adds data-astro-cid-* attributes on every element it scopes.
      [...el.attributes]
        .filter((a) => a.name.startsWith('data-astro-cid-'))
        .forEach((a) => el.removeAttribute(a.name));
      el.removeAttribute('onclick');
      el.removeAttribute('onload');
    });
  }
}
