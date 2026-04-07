/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS - Import all parsers needed for this template
import heroLandingParser from './parsers/hero-landing.js';
import columnsArticleParser from './parsers/columns-article.js';
import cardsGalleryParser from './parsers/cards-gallery.js';
import tabsTestimonialParser from './parsers/tabs-testimonial.js';
import cardsArticleParser from './parsers/cards-article.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import heroBannerParser from './parsers/hero-banner.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';
import sectionsTransformer from './transformers/wknd-trendsetters-sections.js';

// PARSER REGISTRY - Map parser names to functions
const parsers = {
  'hero-landing': heroLandingParser,
  'columns-article': columnsArticleParser,
  'cards-gallery': cardsGalleryParser,
  'tabs-testimonial': tabsTestimonialParser,
  'cards-article': cardsArticleParser,
  'accordion-faq': accordionFaqParser,
  'hero-banner': heroBannerParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'landing-page',
  description: 'Homepage landing page with hero, featured content, and promotional sections',
  urls: [
    'https://www.wknd-trendsetters.site/'
  ],
  blocks: [
    {
      name: 'hero-landing',
      instances: ['header.section.secondary-section .grid-layout.grid-gap-xxl']
    },
    {
      name: 'columns-article',
      instances: ['main > section.section:nth-of-type(1) .grid-layout.grid-gap-lg']
    },
    {
      name: 'cards-gallery',
      instances: ['.grid-layout.desktop-4-column.grid-gap-sm']
    },
    {
      name: 'tabs-testimonial',
      instances: ['.tabs-wrapper']
    },
    {
      name: 'cards-article',
      instances: ['.grid-layout.desktop-4-column.grid-gap-md']
    },
    {
      name: 'accordion-faq',
      instances: ['.faq-list']
    },
    {
      name: 'hero-banner',
      instances: ['section.inverse-section .utility-position-relative']
    }
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero',
      selector: 'header.section.secondary-section',
      style: 'secondary',
      blocks: ['hero-landing'],
      defaultContent: []
    },
    {
      id: 'section-2',
      name: 'Featured Article',
      selector: 'main > section.section:nth-of-type(1)',
      style: null,
      blocks: ['columns-article'],
      defaultContent: []
    },
    {
      id: 'section-3',
      name: 'Photo Gallery',
      selector: [
        'section.section.secondary-section:has(.utility-aspect-1x1)',
        'main > section.section.secondary-section:nth-of-type(1)'
      ],
      style: 'secondary',
      blocks: ['cards-gallery'],
      defaultContent: [
        '.utility-text-align-center h2.h2-heading',
        '.utility-text-align-center p.paragraph-lg'
      ]
    },
    {
      id: 'section-4',
      name: 'Testimonials',
      selector: 'section.section:has(.tabs-wrapper)',
      style: null,
      blocks: ['tabs-testimonial'],
      defaultContent: []
    },
    {
      id: 'section-5',
      name: 'Latest Articles',
      selector: [
        'section.section.secondary-section:has(.article-card)',
        'main > section.section.secondary-section:nth-of-type(2)'
      ],
      style: 'secondary',
      blocks: ['cards-article'],
      defaultContent: [
        '.utility-text-align-center h2.h2-heading',
        '.utility-text-align-center p.paragraph-lg'
      ]
    },
    {
      id: 'section-6',
      name: 'FAQ',
      selector: 'section.section:has(.faq-list)',
      style: null,
      blocks: ['accordion-faq'],
      defaultContent: [
        'h2.h2-heading',
        'p.subheading'
      ]
    },
    {
      id: 'section-7',
      name: 'CTA Banner',
      selector: 'section.section.inverse-section',
      style: 'dark',
      blocks: ['hero-banner'],
      defaultContent: []
    }
  ]
};

// TRANSFORMER REGISTRY - Array of transformer functions
// Section transformer runs after cleanup in afterTransform hook
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - The payload containing { document, url, html, params }
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
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
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

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
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

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path: path || '/index',
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
