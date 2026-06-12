/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import accordionFaqParser from './parsers/accordion-faq.js';
import cardsArticlesParser from './parsers/cards-articles.js';
import cardsGalleryParser from './parsers/cards-gallery.js';
import columnsArticleParser from './parsers/columns-article.js';
import columnsHeroParser from './parsers/columns-hero.js';
import heroOverlayParser from './parsers/hero-overlay.js';
import tabsTestimonialsParser from './parsers/tabs-testimonials.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/cleanup.js';
import sectionsTransformer from './transformers/sections.js';

// PARSER REGISTRY
const parsers = {
  'accordion-faq': accordionFaqParser,
  'cards-articles': cardsArticlesParser,
  'cards-gallery': cardsGalleryParser,
  'columns-article': columnsArticleParser,
  'columns-hero': columnsHeroParser,
  'hero-overlay': heroOverlayParser,
  'tabs-testimonials': tabsTestimonialsParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'WKND Trendsetters homepage with hero, featured content, and brand sections',
  urls: [
    'https://www.wknd-trendsetters.site/',
  ],
  blocks: [
    {
      name: 'columns-hero',
      instances: ['main > header.section.secondary-section .grid-layout.tablet-1-column.grid-gap-xxl'],
    },
    {
      name: 'columns-article',
      instances: ['main > section.section:not(.secondary-section):not(.inverse-section):nth-of-type(1) .grid-layout.tablet-1-column.grid-gap-lg'],
    },
    {
      name: 'cards-gallery',
      instances: ['main > section.section.secondary-section:nth-of-type(2) .grid-layout.desktop-4-column.grid-gap-sm'],
    },
    {
      name: 'tabs-testimonials',
      instances: ['.tabs-wrapper'],
    },
    {
      name: 'cards-articles',
      instances: ['main > section.section.secondary-section .grid-layout.desktop-4-column.grid-gap-md'],
    },
    {
      name: 'accordion-faq',
      instances: ['.faq-list'],
    },
    {
      name: 'hero-overlay',
      instances: ['main > section.section.inverse-section .utility-position-relative'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero',
      selector: 'main > header.section.secondary-section',
      style: 'grey',
      blocks: ['columns-hero'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Article header',
      selector: 'main > section.section:not(.secondary-section):not(.inverse-section):nth-of-type(1)',
      style: null,
      blocks: ['columns-article'],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'Style in every snapshot - image grid',
      selector: 'main > section.section.secondary-section:nth-of-type(2)',
      style: 'grey',
      blocks: ['cards-gallery'],
      defaultContent: [
        'main > section.section.secondary-section:nth-of-type(2) .utility-text-align-center > h2',
        'main > section.section.secondary-section:nth-of-type(2) .utility-text-align-center > p',
      ],
    },
    {
      id: 'section-4',
      name: 'Tabbed testimonials',
      selector: 'main > section.section:not(.secondary-section):not(.inverse-section):nth-of-type(2)',
      style: null,
      blocks: ['tabs-testimonials'],
      defaultContent: [],
    },
    {
      id: 'section-5',
      name: 'Latest articles',
      selector: 'main > section.section.secondary-section:nth-of-type(3)',
      style: 'grey',
      blocks: ['cards-articles'],
      defaultContent: [
        'main > section.section.secondary-section:nth-of-type(3) .utility-text-align-center > h2',
        'main > section.section.secondary-section:nth-of-type(3) .utility-text-align-center > p',
      ],
    },
    {
      id: 'section-6',
      name: 'FAQ',
      selector: 'main > section.section:not(.secondary-section):not(.inverse-section):nth-of-type(3)',
      style: null,
      blocks: ['accordion-faq'],
      defaultContent: [
        'main > section.section:not(.secondary-section):not(.inverse-section):nth-of-type(3) > .container > .grid-layout > div:first-child > h2',
        'main > section.section:not(.secondary-section):not(.inverse-section):nth-of-type(3) > .container > .grid-layout > div:first-child > p',
      ],
    },
    {
      id: 'section-7',
      name: 'Closing CTA hero',
      selector: 'main > section.section.inverse-section',
      style: null,
      blocks: ['hero-overlay'],
      defaultContent: [],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform: initial cleanup
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks defined for this template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block via its registered parser
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform: final cleanup + section breaks/metadata
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Sanitize path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index',
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
