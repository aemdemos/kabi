/* eslint-disable */
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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/accordion-faq.js
  function parse(element, { document }) {
    let items = Array.from(element.querySelectorAll(":scope > details.faq-item"));
    if (!items.length) {
      items = Array.from(element.querySelectorAll("details.faq-item, details"));
    }
    const cells = [];
    items.forEach((item) => {
      const summary = item.querySelector("summary.faq-question, summary");
      let questionCell = "";
      if (summary) {
        const questionSpan = summary.querySelector("span");
        if (questionSpan) {
          questionCell = questionSpan;
        } else {
          questionCell = summary;
        }
      }
      const answerWrap = item.querySelector(".faq-answer, div.faq-answer");
      const answerParts = [];
      if (answerWrap) {
        const children = Array.from(answerWrap.children);
        if (children.length) {
          children.forEach((child) => answerParts.push(child));
        } else {
          answerParts.push(answerWrap);
        }
      }
      cells.push([questionCell, answerParts]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-articles.js
  function parse2(element, { document }) {
    let cards = Array.from(element.querySelectorAll(":scope > a.article-card"));
    if (!cards.length) {
      cards = Array.from(element.querySelectorAll("a.article-card"));
    }
    const cells = [];
    cards.forEach((card) => {
      const image = card.querySelector(".article-card-image img, img.cover-image, img");
      const tag = card.querySelector(".article-card-meta .tag, .tag");
      const date = card.querySelector(".article-card-meta .paragraph-sm, .article-card-meta span:not(.tag)");
      const heading = card.querySelector("h1, h2, h3, h4, .h4-heading");
      const contentParts = [];
      if (tag) contentParts.push(tag);
      if (date) contentParts.push(date);
      if (heading) contentParts.push(heading);
      const href = card.getAttribute("href");
      if (href) {
        const linkLabel = heading ? heading.textContent.trim() : card.textContent.trim() || "Read more";
        const cardLink = document.createElement("a");
        cardLink.href = href;
        cardLink.textContent = linkLabel;
        contentParts.push(cardLink);
      }
      cells.push([image, contentParts]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-articles", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-gallery.js
  function parse3(element, { document }) {
    const itemEls = Array.from(element.querySelectorAll(":scope > div"));
    const cells = [];
    const seen = /* @__PURE__ */ new Set();
    itemEls.forEach((item) => {
      const img = item.querySelector("img.cover-image, img");
      if (img && !seen.has(img)) {
        seen.add(img);
        cells.push([img]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "cards-gallery",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-article.js
  function parse4(element, { document }) {
    const columns = element.querySelectorAll(":scope > div");
    const firstCol = columns[0] || null;
    const secondCol = columns[1] || null;
    let coverImage = null;
    if (firstCol) {
      coverImage = firstCol.querySelector('img.cover-image, img[class*="cover"], img');
    }
    const rightCellContent = [];
    if (secondCol) {
      const breadcrumbs = secondCol.querySelector('.breadcrumbs, nav[aria-label*="readcrumb"], [class*="breadcrumb"]');
      if (breadcrumbs) rightCellContent.push(breadcrumbs);
      const heading = secondCol.querySelector('h1, h2, h3, .h2-heading, [class*="heading"]');
      if (heading) rightCellContent.push(heading);
      const metaContainers = Array.from(secondCol.querySelectorAll(":scope > div")).filter((d) => {
        if (d.classList.contains("breadcrumbs")) return false;
        if (d.matches("h1, h2, h3, h4, h5, h6")) return false;
        return true;
      });
      metaContainers.forEach((container) => rightCellContent.push(container));
    }
    const cells = [
      [
        coverImage || "",
        rightCellContent.length ? rightCellContent : ""
      ]
    ];
    const block = WebImporter.Blocks.createBlock(document, {
      name: "columns-article",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-hero.js
  function parse5(element, { document }) {
    const columnEls = Array.from(element.querySelectorAll(":scope > div"));
    const col1Source = columnEls[0] || null;
    const col1Content = [];
    if (col1Source) {
      const heading = col1Source.querySelector('h1, h2, h3, .h1-heading, [class*="heading"]');
      if (heading) col1Content.push(heading);
      const subheading = col1Source.querySelector('p.subheading, p[class*="subheading"], p');
      if (subheading) col1Content.push(subheading);
      const buttonLinks = Array.from(
        col1Source.querySelectorAll('.button-group a, a.button, a[class*="button"]')
      );
      const seenLinks = /* @__PURE__ */ new Set();
      buttonLinks.forEach((a) => {
        if (!seenLinks.has(a)) {
          seenLinks.add(a);
          col1Content.push(a);
        }
      });
    }
    const col2Source = columnEls[1] || null;
    const col2Content = [];
    if (col2Source) {
      const imgs = Array.from(
        col2Source.querySelectorAll("img.cover-image, img")
      );
      const seenImgs = /* @__PURE__ */ new Set();
      imgs.forEach((img) => {
        if (!seenImgs.has(img)) {
          seenImgs.add(img);
          col2Content.push(img);
        }
      });
    }
    const cells = [
      [col1Content, col2Content]
    ];
    const block = WebImporter.Blocks.createBlock(document, {
      name: "columns-hero",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-overlay.js
  function parse6(element, { document }) {
    const bgImage = element.querySelector(
      'img.cover-image, img.utility-overlay, img[class*="cover"], img[class*="background"]'
    );
    const contentRoot = element.querySelector(
      '.card-body, .utility-text-on-overlay, [class*="card-body"]'
    ) || element;
    const contentCell = [];
    const heading = contentRoot.querySelector(
      'h1, h2, h3, .h1-heading, [class*="heading"]:not(.button-group):not(.subheading)'
    );
    if (heading) contentCell.push(heading);
    const subheading = contentRoot.querySelector(
      'p.subheading, p[class*="subheading"], p'
    );
    if (subheading) contentCell.push(subheading);
    const ctaLinks = Array.from(
      contentRoot.querySelectorAll('.button-group a, a.button, a[class*="button"]')
    );
    const seen = /* @__PURE__ */ new Set();
    ctaLinks.forEach((a) => {
      if (!seen.has(a)) {
        seen.add(a);
        contentCell.push(a);
      }
    });
    const cells = [];
    if (bgImage) cells.push([bgImage]);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, {
      name: "hero-overlay",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-testimonials.js
  function parse7(element, { document }) {
    const tabButtons = Array.from(element.querySelectorAll(".tab-menu .tab-menu-link, button.tab-menu-link"));
    const tabPanes = Array.from(element.querySelectorAll(".tabs-content .tab-pane, .tab-pane"));
    const pairs = [];
    const usedPaneIndexes = /* @__PURE__ */ new Set();
    tabButtons.forEach((btn, idx) => {
      let pane = null;
      const btnId = btn.getAttribute("id") || "";
      const match = btnId.match(/tab-(\d+)/);
      if (match) {
        const targetId = `tabpanel-${match[1]}`;
        pane = tabPanes.find((p) => p.getAttribute("id") === targetId) || null;
      }
      if (!pane && tabPanes[idx]) {
        pane = tabPanes[idx];
      }
      if (pane) usedPaneIndexes.add(tabPanes.indexOf(pane));
      pairs.push({ btn, pane });
    });
    tabPanes.forEach((pane, idx) => {
      if (!usedPaneIndexes.has(idx)) {
        pairs.push({ btn: null, pane });
      }
    });
    const cells = [];
    pairs.forEach(({ btn, pane }) => {
      const labelParts = [];
      if (btn) {
        const avatarImg = btn.querySelector(".avatar img, img.cover-image, img");
        if (avatarImg) labelParts.push(avatarImg);
        const btnTextBlocks = Array.from(btn.querySelectorAll(":scope > div > div:not(.avatar)"));
        btnTextBlocks.forEach((blk) => labelParts.push(blk));
        if (btnTextBlocks.length === 0) {
          const fallbackTextBlocks = Array.from(btn.querySelectorAll("div")).filter(
            (d) => !d.classList.contains("avatar") && !d.querySelector("img") && d.textContent.trim().length > 0
          );
          fallbackTextBlocks.forEach((blk) => labelParts.push(blk));
        }
      }
      const contentParts = [];
      if (pane) {
        const paneImg = pane.querySelector("img.cover-image, img");
        if (paneImg) contentParts.push(paneImg);
        const nameRoleBlock = pane.querySelector(".paragraph-xl strong") ? pane.querySelector(".paragraph-xl strong").closest("div").parentElement : null;
        if (nameRoleBlock) {
          contentParts.push(nameRoleBlock);
        } else {
          const strongEl = pane.querySelector("strong");
          if (strongEl) contentParts.push(strongEl.parentElement || strongEl);
        }
        const quote = pane.querySelector("p.paragraph-xl, p");
        if (quote) contentParts.push(quote);
      }
      cells.push([labelParts, contentParts]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-testimonials", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/cleanup.js
  var TransformHook = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "a.skip-link",
        ".navbar",
        "footer.footer",
        "script",
        "style",
        "noscript",
        "iframe"
      ]);
      element.querySelectorAll('img[src^="data:image/svg+xml;base64"]').forEach((img) => {
        img.remove();
      });
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "a.skip-link",
        ".navbar",
        "footer.footer",
        "header.navbar",
        "script",
        "style",
        "link",
        "noscript",
        "iframe"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        [...el.attributes].filter((a) => a.name.startsWith("data-astro-cid-")).forEach((a) => el.removeAttribute(a.name));
        el.removeAttribute("onclick");
        el.removeAttribute("onload");
      });
    }
  }

  // tools/importer/transformers/sections.js
  var TransformHook2 = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.afterTransform) return;
    const template = payload && payload.template;
    const sections = template && Array.isArray(template.sections) ? template.sections : [];
    if (sections.length < 2) return;
    const doc = element.ownerDocument;
    const topLevelChildren = Array.from(element.children);
    function resolveSection(section, index) {
      if (!section || !section.selector) return null;
      try {
        const m = doc.querySelector(section.selector);
        if (m) return m;
      } catch (e) {
      }
      const relSelector = section.selector.replace(/^\s*main\s*>\s*/, ":scope > ");
      try {
        const m = element.querySelector(relSelector);
        if (m) return m;
      } catch (e) {
      }
      if (index >= 0 && index < topLevelChildren.length) {
        return topLevelChildren[index];
      }
      return null;
    }
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const sectionEl = resolveSection(section, i);
      if (!sectionEl) continue;
      if (section.style) {
        const metadataBlock = WebImporter.Blocks.createBlock(doc, {
          name: "Section Metadata",
          cells: {
            style: section.style
          }
        });
        if (sectionEl.parentNode) {
          sectionEl.parentNode.insertBefore(metadataBlock, sectionEl.nextSibling);
        }
      }
      if (i > 0) {
        const hr = doc.createElement("hr");
        if (sectionEl.parentNode) {
          sectionEl.parentNode.insertBefore(hr, sectionEl);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "accordion-faq": parse,
    "cards-articles": parse2,
    "cards-gallery": parse3,
    "columns-article": parse4,
    "columns-hero": parse5,
    "hero-overlay": parse6,
    "tabs-testimonials": parse7
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "WKND Trendsetters homepage with hero, featured content, and brand sections",
    urls: [
      "https://www.wknd-trendsetters.site/"
    ],
    blocks: [
      {
        name: "columns-hero",
        instances: ["main > header.section.secondary-section .grid-layout.tablet-1-column.grid-gap-xxl"]
      },
      {
        name: "columns-article",
        instances: ["main > section.section:not(.secondary-section):not(.inverse-section):nth-of-type(1) .grid-layout.tablet-1-column.grid-gap-lg"]
      },
      {
        name: "cards-gallery",
        instances: ["main > section.section.secondary-section:nth-of-type(2) .grid-layout.desktop-4-column.grid-gap-sm"]
      },
      {
        name: "tabs-testimonials",
        instances: [".tabs-wrapper"]
      },
      {
        name: "cards-articles",
        instances: ["main > section.section.secondary-section .grid-layout.desktop-4-column.grid-gap-md"]
      },
      {
        name: "accordion-faq",
        instances: [".faq-list"]
      },
      {
        name: "hero-overlay",
        instances: ["main > section.section.inverse-section .utility-position-relative"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero",
        selector: "main > header.section.secondary-section",
        style: "grey",
        blocks: ["columns-hero"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Article header",
        selector: "main > section.section:not(.secondary-section):not(.inverse-section):nth-of-type(1)",
        style: null,
        blocks: ["columns-article"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Style in every snapshot - image grid",
        selector: "main > section.section.secondary-section:nth-of-type(2)",
        style: "grey",
        blocks: ["cards-gallery"],
        defaultContent: [
          "main > section.section.secondary-section:nth-of-type(2) .utility-text-align-center > h2",
          "main > section.section.secondary-section:nth-of-type(2) .utility-text-align-center > p"
        ]
      },
      {
        id: "section-4",
        name: "Tabbed testimonials",
        selector: "main > section.section:not(.secondary-section):not(.inverse-section):nth-of-type(2)",
        style: null,
        blocks: ["tabs-testimonials"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Latest articles",
        selector: "main > section.section.secondary-section:nth-of-type(3)",
        style: "grey",
        blocks: ["cards-articles"],
        defaultContent: [
          "main > section.section.secondary-section:nth-of-type(3) .utility-text-align-center > h2",
          "main > section.section.secondary-section:nth-of-type(3) .utility-text-align-center > p"
        ]
      },
      {
        id: "section-6",
        name: "FAQ",
        selector: "main > section.section:not(.secondary-section):not(.inverse-section):nth-of-type(3)",
        style: null,
        blocks: ["accordion-faq"],
        defaultContent: [
          "main > section.section:not(.secondary-section):not(.inverse-section):nth-of-type(3) > .container > .grid-layout > div:first-child > h2",
          "main > section.section:not(.secondary-section):not(.inverse-section):nth-of-type(3) > .container > .grid-layout > div:first-child > p"
        ]
      },
      {
        id: "section-7",
        name: "Closing CTA hero",
        selector: "main > section.section.inverse-section",
        style: null,
        blocks: ["hero-overlay"],
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
  var import_homepage_default = {
    transform: (payload) => {
      const {
        document,
        url,
        html,
        params
      } = payload;
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
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
