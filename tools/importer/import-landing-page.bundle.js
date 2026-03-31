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

  // tools/importer/parsers/columns-landing.js
  function parse(element, { document }) {
    const cells = [];
    const rows = Array.from(element.querySelectorAll(".grid-layout > div, .grid-layout > *")).filter(
      (el) => el.matches("div:not(.grid-layout)")
    );
    const columns = rows.length > 0 ? rows : Array.from(element.children);
    for (let i = 0; i < columns.length; i += 2) {
      const col1 = columns[i];
      const col2 = columns[i + 1];
      if (col1 && col2) {
        cells.push([col1, col2]);
      } else if (col1) {
        cells.push([col1]);
      }
    }
    const block = WebImporter.Blocks.createBlock(document, {
      name: "columns-landing",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-gallery.js
  function parse2(element, { document }) {
    const cells = [];
    const children = Array.from(element.children);
    children.forEach((child) => {
      const img = child.querySelector("img");
      if (img) {
        cells.push([img, ""]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "cards-gallery",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-testimonial.js
  function parse3(element, { document }) {
    const cells = [];
    const tabPanes = element.querySelectorAll(".tab-pane");
    const tabButtons = element.querySelectorAll(".tab-menu-link");
    for (let i = 0; i < tabPanes.length; i++) {
      const pane = tabPanes[i];
      const button = tabButtons[i];
      let tabLabel = "";
      if (button) {
        const nameElement = button.querySelector(".paragraph-sm strong");
        if (nameElement) {
          tabLabel = nameElement.textContent.trim();
        }
      }
      const tabContent = document.createElement("div");
      const img = pane.querySelector("img");
      if (img) {
        tabContent.appendChild(img.cloneNode(true));
      }
      const name = pane.querySelector(".paragraph-xl strong");
      if (name) {
        const nameP = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = name.textContent.trim();
        nameP.appendChild(strong);
        tabContent.appendChild(nameP);
      }
      const role = pane.querySelector(".paragraph-xl.utility-margin-bottom-0 + div");
      if (role) {
        const roleP = document.createElement("p");
        roleP.textContent = role.textContent.trim();
        tabContent.appendChild(roleP);
      }
      const quote = pane.querySelector("p.paragraph-xl");
      if (quote) {
        tabContent.appendChild(quote.cloneNode(true));
      }
      cells.push([tabLabel, tabContent]);
    }
    const block = WebImporter.Blocks.createBlock(document, {
      name: "tabs-testimonial",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse4(element, { document }) {
    const cells = [];
    const articleCards = element.querySelectorAll("a.article-card, .article-card");
    if (articleCards.length > 0) {
      articleCards.forEach((card) => {
        const img = card.querySelector("img");
        const textContent = document.createElement("div");
        const tag = card.querySelector(".tag");
        if (tag) {
          const tagP = document.createElement("p");
          tagP.textContent = tag.textContent.trim();
          textContent.appendChild(tagP);
        }
        const heading = card.querySelector("h3, h4");
        if (heading) {
          const h = document.createElement("h3");
          h.textContent = heading.textContent.trim();
          textContent.appendChild(h);
        }
        const date = card.querySelector(".article-card-meta .paragraph-sm");
        if (date) {
          const dateP = document.createElement("p");
          dateP.textContent = date.textContent.trim();
          textContent.appendChild(dateP);
        }
        const link = card.getAttribute("href");
        if (link) {
          const linkP = document.createElement("p");
          const linkA = document.createElement("a");
          linkA.href = link;
          linkA.textContent = "Read more";
          linkP.appendChild(linkA);
          textContent.appendChild(linkP);
        }
        cells.push([img, textContent]);
      });
    }
    const block = WebImporter.Blocks.createBlock(document, {
      name: "cards-article",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse5(element, { document }) {
    const cells = [];
    const faqItems = element.querySelectorAll(".faq-item, details");
    faqItems.forEach((item) => {
      const summary = item.querySelector("summary, .faq-question");
      let question = "";
      if (summary) {
        const span = summary.querySelector("span");
        question = span ? span.textContent.trim() : summary.textContent.trim();
      }
      const answerDiv = item.querySelector(".faq-answer");
      let answer = "";
      if (answerDiv) {
        const answerP = answerDiv.querySelector("p");
        answer = answerP ? answerP.textContent.trim() : answerDiv.textContent.trim();
      }
      if (question && answer) {
        cells.push([question, answer]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "accordion-faq",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-overlay.js
  function parse6(element, { document }) {
    const cells = [];
    const heroContent = document.createElement("div");
    const bgImage = element.querySelector("img");
    if (bgImage) {
      heroContent.appendChild(bgImage.cloneNode(true));
    }
    const heading = element.querySelector("h2, h1");
    if (heading) {
      heroContent.appendChild(heading.cloneNode(true));
    }
    const paragraph = element.querySelector("p");
    if (paragraph) {
      heroContent.appendChild(paragraph.cloneNode(true));
    }
    const button = element.querySelector("a.button, .button a");
    if (button) {
      const link = document.createElement("p");
      const anchor = document.createElement("a");
      anchor.href = button.getAttribute("href") || button.parentElement.getAttribute("href") || "#";
      anchor.textContent = button.textContent.trim();
      link.appendChild(anchor);
      heroContent.appendChild(link);
    }
    cells.push([heroContent]);
    const block = WebImporter.Blocks.createBlock(document, {
      name: "hero-overlay",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".skip-link",
        ".navbar",
        ".breadcrumbs",
        "footer.footer"
      ]);
    }
  }

  // tools/importer/transformers/wknd-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) {
        return;
      }
      const document = element.ownerDocument || window.document;
      const sectionElements = [];
      const foundElements = /* @__PURE__ */ new Set();
      for (let i = 0; i < template.sections.length; i++) {
        const section = template.sections[i];
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionElement = null;
        for (const selector of selectors) {
          try {
            const el = element.querySelector(selector);
            if (el && !foundElements.has(el)) {
              sectionElement = el;
              foundElements.add(el);
              break;
            }
          } catch (e) {
            continue;
          }
        }
        if (sectionElement) {
          sectionElements.push({ section, element: sectionElement, index: i });
        }
      }
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const { section, element: sectionElement, index } = sectionElements[i];
        if (section.style) {
          const sectionMetadataBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: {
              style: section.style
            }
          });
          if (sectionElement.nextSibling) {
            sectionElement.parentNode.insertBefore(sectionMetadataBlock, sectionElement.nextSibling);
          } else {
            sectionElement.parentNode.appendChild(sectionMetadataBlock);
          }
        }
        if (index > 0) {
          const hr = document.createElement("hr");
          sectionElement.parentNode.insertBefore(hr, sectionElement);
        }
      }
    }
  }

  // tools/importer/import-landing-page.js
  var parsers = {
    "columns-landing": parse,
    "cards-gallery": parse2,
    "tabs-testimonial": parse3,
    "cards-article": parse4,
    "accordion-faq": parse5,
    "hero-overlay": parse6
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "landing-page",
    urls: [
      "https://www.wknd-trendsetters.site/"
    ],
    description: "WKND Trendsetters landing page",
    sections: [
      {
        id: "section-1",
        name: "Hero Section",
        selector: "header.section",
        style: "light-grey",
        blocks: ["columns-landing"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Article Info Section",
        selector: "main > section:nth-child(2)",
        style: null,
        blocks: ["columns-landing"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Gallery Section",
        selector: "main > section:nth-child(3)",
        style: "light-grey",
        blocks: ["cards-gallery"],
        defaultContent: ["h2.h2-heading", "p.paragraph-lg"]
      },
      {
        id: "section-4",
        name: "Testimonials Section",
        selector: "main > section:nth-child(4)",
        style: null,
        blocks: ["tabs-testimonial"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Articles Section",
        selector: "main > section:nth-child(5)",
        style: "light-grey",
        blocks: ["cards-article"],
        defaultContent: ["h2.h2-heading", "p.paragraph-lg"]
      },
      {
        id: "section-6",
        name: "FAQ Section",
        selector: "main > section:nth-child(6)",
        style: null,
        blocks: ["columns-landing", "accordion-faq"],
        defaultContent: []
      },
      {
        id: "section-7",
        name: "CTA Hero Section",
        selector: "main > section:nth-child(7)",
        style: null,
        blocks: ["hero-overlay"],
        defaultContent: []
      }
    ],
    blocks: [
      {
        name: "columns-landing",
        instances: [
          "header.section.secondary-section .grid-layout",
          "section.section:nth-of-type(1) .grid-layout",
          "section.section:nth-of-type(3) .grid-layout"
        ]
      },
      {
        name: "cards-gallery",
        instances: [
          "main > section:nth-child(3) .grid-layout.desktop-4-column"
        ]
      },
      {
        name: "tabs-testimonial",
        instances: [
          "main > section:nth-child(4) .tabs-wrapper"
        ]
      },
      {
        name: "cards-article",
        instances: [
          "main > section:nth-child(5) .grid-layout.desktop-4-column"
        ]
      },
      {
        name: "accordion-faq",
        instances: [
          "main > section:nth-child(6) .faq-list"
        ]
      },
      {
        name: "hero-overlay",
        instances: [
          "section.section.inverse-section .utility-position-relative"
        ]
      }
    ]
  };
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
    /**
     * Main transformation function
     */
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
