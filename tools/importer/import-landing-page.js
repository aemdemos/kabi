/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS - Import all parsers needed for this template
import columnsLandingParser from './parsers/columns-landing.js';
import cardsGalleryParser from './parsers/cards-gallery.js';
import tabsTestimonialParser from './parsers/tabs-testimonial.js';
import cardsArticleParser from './parsers/cards-article.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import heroOverlayParser from './parsers/hero-overlay.js';

// TRANSFORMER IMPORTS - Import all transformers
import wkndCleanupTransformer from './transformers/wknd-cleanup.js';
import wkndSectionsTransformer from './transformers/wknd-sections.js';

// PARSER REGISTRY - Map parser names to functions
const parsers = {
  'columns-landing': columnsLandingParser,
  'cards-gallery': cardsGalleryParser,
  'tabs-testimonial': tabsTestimonialParser,
  'cards-article': cardsArticleParser,
  'accordion-faq': accordionFaqParser,
  'hero-overlay': heroOverlayParser,
};

// TRANSFORMER REGISTRY - Array of transformer functions
const transformers = [
  wkndCleanupTransformer,
  wkndSectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'landing-page',
  urls: [
    'https://www.wknd-trendsetters.site/'
  ],
  description: 'WKND Trendsetters landing page',
  sections: [
    {
      id: 'section-1',
      name: 'Hero Section',
      selector: 'header.section',
      style: 'light-grey',
      blocks: ['columns-landing'],
      defaultContent: []
    },
    {
      id: 'section-2',
      name: 'Article Info Section',
      selector: 'main > section:nth-child(2)',
      style: null,
      blocks: ['columns-landing'],
      defaultContent: []
    },
    {
      id: 'section-3',
      name: 'Gallery Section',
      selector: 'main > section:nth-child(3)',
      style: 'light-grey',
      blocks: ['cards-gallery'],
      defaultContent: ['h2.h2-heading', 'p.paragraph-lg']
    },
    {
      id: 'section-4',
      name: 'Testimonials Section',
      selector: 'main > section:nth-child(4)',
      style: null,
      blocks: ['tabs-testimonial'],
      defaultContent: []
    },
    {
      id: 'section-5',
      name: 'Articles Section',
      selector: 'main > section:nth-child(5)',
      style: 'light-grey',
      blocks: ['cards-article'],
      defaultContent: ['h2.h2-heading', 'p.paragraph-lg']
    },
    {
      id: 'section-6',
      name: 'FAQ Section',
      selector: 'main > section:nth-child(6)',
      style: null,
      blocks: ['columns-landing', 'accordion-faq'],
      defaultContent: []
    },
    {
      id: 'section-7',
      name: 'CTA Hero Section',
      selector: 'main > section:nth-child(7)',
      style: null,
      blocks: ['hero-overlay'],
      defaultContent: []
    }
  ],
  blocks: [
    {
      name: 'columns-landing',
      instances: [
        'header.section.secondary-section .grid-layout',
        'section.section:nth-of-type(1) .grid-layout',
        'section.section:nth-of-type(3) .grid-layout'
      ]
    },
    {
      name: 'cards-gallery',
      instances: [
        'main > section:nth-child(3) .grid-layout.desktop-4-column'
      ]
    },
    {
      name: 'tabs-testimonial',
      instances: [
        'main > section:nth-child(4) .tabs-wrapper'
      ]
    },
    {
      name: 'cards-article',
      instances: [
        'main > section:nth-child(5) .grid-layout.desktop-4-column'
      ]
    },
    {
      name: 'accordion-faq',
      instances: [
        'main > section:nth-child(6) .faq-list'
      ]
    },
    {
      name: 'hero-overlay',
      instances: [
        'section.section.inverse-section .utility-position-relative'
      ]
    }
  ]
};

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - The hook name ('beforeTransform' or 'afterTransform')
 * @param {Element} element - The DOM element to transform (typically document.body or main)
 * @param {Object} payload - The payload containing { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  // Pass PAGE_TEMPLATE to transformers so they can access section information
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE
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
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  // Find all block instances defined in the template
  template.blocks.forEach(blockDef => {
    blockDef.instances.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach(element => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  /**
   * Main transformation function
   */
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach(block => {
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

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path (full localized path without extension)
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path: path || '/index',
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map(b => b.name),
      }
    }];
  }
};
