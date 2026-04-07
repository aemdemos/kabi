var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-landing-page.js
  var import_landing_page_exports = {};
  __export(import_landing_page_exports, {
    default: () => import_landing_page_default
  });

  // tools/importer/parsers/hero-landing.js
  function parse(element, { document }) {
    const heading = element.querySelector("h1, h2, .h1-heading");
    const description = element.querySelector("p.subheading, p");
    const ctaLinks = Array.from(element.querySelectorAll(".button-group a.button, a.button"));
    const images = Array.from(element.querySelectorAll("img.cover-image"));
    const cells = [];
    if (images.length > 0) {
      cells.push(images);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    contentCell.push(...ctaLinks);
    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-landing", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-article.js
  function parse2(element, { document }) {
    const columns = Array.from(element.querySelectorAll(":scope > div"));
    if (columns.length < 2) {
      const block2 = WebImporter.Blocks.createBlock(document, { name: "columns-article", cells: [] });
      element.replaceWith(block2);
      return;
    }
    const col1 = columns[0];
    const col2 = columns[1];
    const cells = [];
    cells.push([col1, col2]);
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-gallery.js
  function parse3(element, { document }) {
    const imageContainers = Array.from(element.querySelectorAll(".utility-aspect-1x1, :scope > div"));
    const cells = [];
    imageContainers.forEach((container) => {
      const img = container.querySelector("img");
      if (img) {
        const altText = img.getAttribute("alt") || "";
        const p = document.createElement("p");
        p.textContent = altText;
        cells.push([img, p]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-testimonial.js
  function parse4(element, { document }) {
    const tabPanes = Array.from(element.querySelectorAll(".tab-pane"));
    const tabButtons = Array.from(element.querySelectorAll(".tab-menu-link, .tab-menu button"));
    const cells = [];
    tabPanes.forEach((pane, index) => {
      const button = tabButtons[index];
      let labelText = "";
      if (button) {
        const nameEl2 = button.querySelector("strong");
        labelText = nameEl2 ? nameEl2.textContent.trim() : button.textContent.trim();
      }
      const contentContainer = document.createElement("div");
      const img = pane.querySelector("img.cover-image");
      if (img) contentContainer.append(img);
      const nameEl = pane.querySelector(".paragraph-xl strong");
      if (nameEl) {
        const h3 = document.createElement("h3");
        h3.textContent = nameEl.textContent.trim();
        contentContainer.append(h3);
      }
      const nameWrapper = pane.querySelector(".paragraph-xl.utility-margin-bottom-0");
      if (nameWrapper) {
        const roleEl = nameWrapper.parentElement ? nameWrapper.parentElement.querySelector(":scope > div:not(.paragraph-xl)") : null;
        if (roleEl) {
          const p = document.createElement("p");
          p.textContent = roleEl.textContent.trim();
          contentContainer.append(p);
        }
      }
      const quoteParas = Array.from(pane.querySelectorAll("p.paragraph-xl"));
      quoteParas.forEach((q) => contentContainer.append(q));
      cells.push([labelText, contentContainer]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse5(element, { document }) {
    const articleCards = Array.from(element.querySelectorAll("a.article-card, .article-card"));
    const cells = [];
    articleCards.forEach((card) => {
      const img = card.querySelector(".article-card-image img, img.cover-image");
      const textContent = document.createElement("div");
      const tag = card.querySelector(".tag");
      if (tag) {
        const tagP = document.createElement("p");
        tagP.append(document.createElement("em"));
        tagP.querySelector("em").textContent = tag.textContent.trim();
        textContent.append(tagP);
      }
      const dateMeta = card.querySelector(".article-card-meta .paragraph-sm.utility-text-secondary");
      if (dateMeta) {
        const dateP = document.createElement("p");
        dateP.textContent = dateMeta.textContent.trim();
        textContent.append(dateP);
      }
      const title = card.querySelector("h3, .h4-heading");
      if (title) {
        const h3 = document.createElement("h3");
        h3.textContent = title.textContent.trim();
        textContent.append(h3);
      }
      const href = card.getAttribute("href");
      if (href) {
        const link = document.createElement("a");
        link.href = href;
        link.textContent = "Read more";
        const linkP = document.createElement("p");
        linkP.append(link);
        textContent.append(linkP);
      }
      if (img) {
        cells.push([img, textContent]);
      } else {
        cells.push([textContent]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse6(element, { document }) {
    const faqItems = Array.from(element.querySelectorAll("details.faq-item, details"));
    const cells = [];
    faqItems.forEach((item) => {
      const summary = item.querySelector("summary");
      const questionSpan = summary ? summary.querySelector("span") : null;
      const questionText = questionSpan ? questionSpan.textContent.trim() : summary ? summary.textContent.trim() : "";
      const answerDiv = item.querySelector(".faq-answer");
      const answerContent = document.createElement("div");
      if (answerDiv) {
        const paragraphs = Array.from(answerDiv.querySelectorAll("p"));
        paragraphs.forEach((p) => answerContent.append(p));
      }
      cells.push([questionText, answerContent]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-banner.js
  function parse7(element, { document }) {
    const bgImage = element.querySelector("img.cover-image");
    const heading = element.querySelector(".card-body h2, .card-body h1, h1, h2");
    const description = element.querySelector(".card-body p.subheading, .card-body p");
    const ctaLinks = Array.from(element.querySelectorAll(".button-group a, a.button, a.inverse-button"));
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    contentCell.push(...ctaLinks);
    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [".skip-link"]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        ".navbar",
        "footer.footer",
        "iframe",
        "link",
        "noscript"
      ]);
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
      const sections = payload && payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const reversedSections = [...sections].reverse();
      reversedSections.forEach((section) => {
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) return;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.append(sectionMetadata);
        }
        if (section.id !== sections[0].id) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      });
    }
  }

  // tools/importer/import-landing-page.js
  var parsers = {
    "hero-landing": parse,
    "columns-article": parse2,
    "cards-gallery": parse3,
    "tabs-testimonial": parse4,
    "cards-article": parse5,
    "accordion-faq": parse6,
    "hero-banner": parse7
  };
  var PAGE_TEMPLATE = {
    name: "landing-page",
    description: "Homepage landing page with hero, featured content, and promotional sections",
    urls: [
      "https://www.wknd-trendsetters.site/"
    ],
    blocks: [
      {
        name: "hero-landing",
        instances: ["header.section.secondary-section .grid-layout.grid-gap-xxl"]
      },
      {
        name: "columns-article",
        instances: ["main > section.section:nth-of-type(1) .grid-layout.grid-gap-lg"]
      },
      {
        name: "cards-gallery",
        instances: [".grid-layout.desktop-4-column.grid-gap-sm"]
      },
      {
        name: "tabs-testimonial",
        instances: [".tabs-wrapper"]
      },
      {
        name: "cards-article",
        instances: [".grid-layout.desktop-4-column.grid-gap-md"]
      },
      {
        name: "accordion-faq",
        instances: [".faq-list"]
      },
      {
        name: "hero-banner",
        instances: ["section.inverse-section .utility-position-relative"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero",
        selector: "header.section.secondary-section",
        style: "secondary",
        blocks: ["hero-landing"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Featured Article",
        selector: "main > section.section:nth-of-type(1)",
        style: null,
        blocks: ["columns-article"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Photo Gallery",
        selector: [
          "section.section.secondary-section:has(.utility-aspect-1x1)",
          "main > section.section.secondary-section:nth-of-type(1)"
        ],
        style: "secondary",
        blocks: ["cards-gallery"],
        defaultContent: [
          ".utility-text-align-center h2.h2-heading",
          ".utility-text-align-center p.paragraph-lg"
        ]
      },
      {
        id: "section-4",
        name: "Testimonials",
        selector: "section.section:has(.tabs-wrapper)",
        style: null,
        blocks: ["tabs-testimonial"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Latest Articles",
        selector: [
          "section.section.secondary-section:has(.article-card)",
          "main > section.section.secondary-section:nth-of-type(2)"
        ],
        style: "secondary",
        blocks: ["cards-article"],
        defaultContent: [
          ".utility-text-align-center h2.h2-heading",
          ".utility-text-align-center p.paragraph-lg"
        ]
      },
      {
        id: "section-6",
        name: "FAQ",
        selector: "section.section:has(.faq-list)",
        style: null,
        blocks: ["accordion-faq"],
        defaultContent: [
          "h2.h2-heading",
          "p.subheading"
        ]
      },
      {
        id: "section-7",
        name: "CTA Banner",
        selector: "section.section.inverse-section",
        style: "dark",
        blocks: ["hero-banner"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_landing_page_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path: path || "/index",
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_landing_page_exports);
})();
