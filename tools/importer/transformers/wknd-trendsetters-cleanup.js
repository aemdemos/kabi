/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Trendsetters site-wide cleanup.
 *
 * Removes non-authorable site chrome and framework artifacts from the
 * Astro-based static site so the import contains only page-level authorable
 * content. Every selector below was verified against migration-work/cleaned.html.
 *
 * Non-authorable elements found in captured DOM:
 *   - a.skip-link            → "Skip to main content" accessibility link (body top)
 *   - div.navbar             → global top navigation (logo, mega menu, subscribe)
 *   - footer.footer          → global footer (logo, social icons, link columns)
 *   - div.breadcrumbs        → breadcrumb nav inside the featured-article section
 *   - img[src^="data:image/svg+xml"] → decorative inline data-URI SVG icons
 *       (nav carets, mega-menu icons, button arrows, breadcrumb chevron,
 *        FAQ +/- icons, social icons, logo mark). None are content images;
 *        all real content images use ./images/*.png or absolute site URLs.
 *
 * Framework attributes: data-astro-* (e.g. data-astro-cid-37fxchfa on <body>,
 * data-astro-cid-rbygaycu on FAQ SVGs) are stripped from every element.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove non-authorable chrome and decorative icons BEFORE block parsing so
    // parsers (e.g. columns-article, accordion-faq) never extract them into cells.
    WebImporter.DOMUtils.remove(element, [
      'a.skip-link',
      'div.navbar',
      'footer.footer',
      'div.breadcrumbs',
      'img[src^="data:image/svg+xml"]',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Strip Astro framework attributes left on any remaining element.
    element.querySelectorAll('[data-astro-cid-37fxchfa], [data-astro-cid-rbygaycu]').forEach((el) => {
      el.getAttributeNames()
        .filter((a) => a.startsWith('data-astro-'))
        .forEach((a) => el.removeAttribute(a));
    });
  }
}
