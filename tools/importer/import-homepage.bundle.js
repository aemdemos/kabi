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

  // tools/importer/parsers/hero-landing.js
  function parse(element, { document }) {
    const images = element.querySelectorAll(".grid-layout.grid-gap-xs img, .grid-layout.tablet-1-column.grid-gap-xs img");
    const firstImage = images.length > 0 ? images[0] : null;
    const heading = element.querySelector("h1");
    const description = element.querySelector(".subheading, p.subheading");
    const buttons = Array.from(element.querySelectorAll(".button-group a"));
    const cells = [];
    if (firstImage) {
      const imgFrag = document.createDocumentFragment();
      imgFrag.appendChild(document.createComment(" field:image "));
      const pic = firstImage.closest("picture") || firstImage;
      imgFrag.appendChild(pic.cloneNode(true));
      cells.push([imgFrag]);
    } else {
      cells.push([""]);
    }
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(" field:text "));
    if (heading) textFrag.appendChild(heading.cloneNode(true));
    if (description) textFrag.appendChild(description.cloneNode(true));
    buttons.forEach((btn) => {
      const p = document.createElement("p");
      const a = btn.cloneNode(true);
      p.appendChild(a);
      textFrag.appendChild(p);
    });
    cells.push([textFrag]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-landing", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-editorial.js
  function parse2(element, { document }) {
    const image = element.querySelector(".cover-image, img");
    const col1 = document.createDocumentFragment();
    if (image) {
      const pic = image.closest("picture") || image;
      col1.appendChild(pic.cloneNode(true));
    }
    const col2 = document.createDocumentFragment();
    const breadcrumbLinks = element.querySelectorAll(".breadcrumbs a, .breadcrumb a");
    if (breadcrumbLinks.length > 0) {
      const breadP = document.createElement("p");
      breadcrumbLinks.forEach((link, idx) => {
        if (idx > 0) breadP.appendChild(document.createTextNode(" > "));
        breadP.appendChild(link.cloneNode(true));
      });
      col2.appendChild(breadP);
    }
    const heading = element.querySelector("h2");
    if (heading) col2.appendChild(heading.cloneNode(true));
    const authorName = element.querySelector(".utility-text-black, .paragraph-sm.utility-text-black");
    if (authorName) {
      const authorP = document.createElement("p");
      authorP.textContent = "By " + authorName.textContent.trim();
      col2.appendChild(authorP);
    }
    const dateEl = element.querySelector(".utility-margin-top-0-5rem .utility-text-secondary, .flex-gap-xxs.utility-margin-top-0-5rem");
    if (dateEl) {
      const dateP = document.createElement("p");
      const dateTexts = dateEl.querySelectorAll(".utility-text-secondary");
      const parts = [];
      dateTexts.forEach((t) => {
        const text = t.textContent.trim();
        if (text !== "\u2022") parts.push(text);
      });
      dateP.textContent = parts.join(" \xB7 ");
      col2.appendChild(dateP);
    }
    const cells = [[col1, col2]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-editorial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-gallery.js
  function parse3(element, { document }) {
    const items = element.querySelectorAll(".utility-aspect-1x1");
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector("img");
      const imgFrag = document.createDocumentFragment();
      imgFrag.appendChild(document.createComment(" field:image "));
      if (img) {
        const pic = img.closest("picture") || img;
        imgFrag.appendChild(pic.cloneNode(true));
      }
      const textFrag = document.createDocumentFragment();
      cells.push([imgFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-testimonial.js
  function parse4(element, { document }) {
    const panels = element.querySelectorAll(".tab-pane");
    const tabButtons = element.querySelectorAll(".tab-menu-link");
    const cells = [];
    panels.forEach((panel, i) => {
      const labelFrag = document.createDocumentFragment();
      if (tabButtons[i]) {
        const strong = tabButtons[i].querySelector("strong");
        const role = tabButtons[i].querySelector(".paragraph-sm:not(:first-child), .paragraph-sm.utility-margin-bottom-0:last-child");
        const labelText = [];
        if (strong) labelText.push(strong.textContent.trim());
        if (role) labelText.push(role.textContent.trim());
        const p = document.createElement("p");
        p.textContent = labelText.join(" - ");
        labelFrag.appendChild(p);
      }
      const contentFrag = document.createDocumentFragment();
      const img = panel.querySelector("img");
      if (img) {
        contentFrag.appendChild(document.createComment(" field:content_image "));
        const pic = img.closest("picture") || img;
        contentFrag.appendChild(pic.cloneNode(true));
      }
      const name = panel.querySelector("strong");
      if (name) {
        contentFrag.appendChild(document.createComment(" field:content_heading "));
        const h3 = document.createElement("h3");
        h3.textContent = name.textContent.trim();
        contentFrag.appendChild(h3);
      }
      const roleEl = panel.querySelector(".paragraph-xl.utility-margin-bottom-0 + div, strong + div");
      const quote = panel.querySelector("p.paragraph-xl");
      contentFrag.appendChild(document.createComment(" field:content_richtext "));
      if (roleEl) {
        const roleP = document.createElement("p");
        roleP.textContent = roleEl.textContent.trim();
        contentFrag.appendChild(roleP);
      }
      if (quote) {
        contentFrag.appendChild(quote.cloneNode(true));
      }
      cells.push([labelFrag, contentFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse5(element, { document }) {
    const items = element.querySelectorAll(".article-card, a.article-card");
    const cells = [];
    items.forEach((item) => {
      const imgFrag = document.createDocumentFragment();
      imgFrag.appendChild(document.createComment(" field:image "));
      const img = item.querySelector(".article-card-image img, img");
      if (img) {
        const pic = img.closest("picture") || img;
        imgFrag.appendChild(pic.cloneNode(true));
      }
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      const tag = item.querySelector(".tag");
      const date = item.querySelector(".article-card-meta .paragraph-sm, .article-card-meta .utility-text-secondary");
      const heading = item.querySelector("h3");
      if (tag) {
        const tagP = document.createElement("p");
        tagP.textContent = tag.textContent.trim();
        textFrag.appendChild(tagP);
      }
      if (date) {
        const dateP = document.createElement("p");
        dateP.textContent = date.textContent.trim();
        textFrag.appendChild(dateP);
      }
      if (heading) {
        textFrag.appendChild(heading.cloneNode(true));
      }
      const href = item.getAttribute("href");
      if (href) {
        const linkP = document.createElement("p");
        const a = document.createElement("a");
        a.href = href;
        a.textContent = heading ? heading.textContent.trim() : "Read more";
        linkP.appendChild(a);
        textFrag.appendChild(linkP);
      }
      cells.push([imgFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse6(element, { document }) {
    const items = element.querySelectorAll("details.faq-item, details");
    const cells = [];
    items.forEach((item) => {
      const summaryFrag = document.createDocumentFragment();
      summaryFrag.appendChild(document.createComment(" field:summary "));
      const summary = item.querySelector("summary span, summary");
      if (summary) {
        const questionText = summary.querySelector("span") || summary;
        const p = document.createElement("p");
        p.textContent = questionText.textContent.trim();
        summaryFrag.appendChild(p);
      }
      const bodyFrag = document.createDocumentFragment();
      bodyFrag.appendChild(document.createComment(" field:text "));
      const answer = item.querySelector(".faq-answer");
      if (answer) {
        Array.from(answer.children).forEach((child) => {
          bodyFrag.appendChild(child.cloneNode(true));
        });
      }
      cells.push([summaryFrag, bodyFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-banner.js
  function parse7(element, { document }) {
    const bgImage = element.querySelector(".cover-image, img.cover-image");
    const heading = element.querySelector("h2, h1, .h1-heading");
    const description = element.querySelector(".subheading, p.subheading");
    const ctaLinks = Array.from(element.querySelectorAll(".button-group a, a.button"));
    const cells = [];
    if (bgImage) {
      const imgFrag = document.createDocumentFragment();
      imgFrag.appendChild(document.createComment(" field:image "));
      const pic = bgImage.closest("picture") || bgImage;
      imgFrag.appendChild(pic.cloneNode(true));
      cells.push([imgFrag]);
    } else {
      cells.push([""]);
    }
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(" field:text "));
    if (heading) textFrag.appendChild(heading.cloneNode(true));
    if (description) textFrag.appendChild(description.cloneNode(true));
    ctaLinks.forEach((btn) => {
      const p = document.createElement("p");
      const a = btn.cloneNode(true);
      p.appendChild(a);
      textFrag.appendChild(p);
    });
    cells.push([textFrag]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, ["a.skip-link"]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        ".navbar",
        "footer.footer",
        "noscript",
        "iframe",
        "link"
      ]);
      element.querySelectorAll("[data-astro-cid-37fxchfa]").forEach((el) => {
        el.removeAttribute("data-astro-cid-37fxchfa");
      });
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const template = payload && payload.template;
      if (!template || !template.sections || template.sections.length < 2) return;
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const document = element.ownerDocument;
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.append(sectionMetaBlock);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-landing": parse,
    "columns-editorial": parse2,
    "cards-gallery": parse3,
    "tabs-testimonial": parse4,
    "cards-article": parse5,
    "accordion-faq": parse6,
    "hero-banner": parse7
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Homepage template with hero, featured article, photo gallery, testimonials, latest articles, FAQ accordion, and CTA banner",
    urls: [
      "https://www.wknd-trendsetters.site/"
    ],
    blocks: [
      {
        name: "hero-landing",
        instances: ["header.section.secondary-section"]
      },
      {
        name: "columns-editorial",
        instances: ["main > section:nth-of-type(1) > .container > .grid-layout"]
      },
      {
        name: "cards-gallery",
        instances: ["main > section:nth-of-type(2) .grid-layout.desktop-4-column"]
      },
      {
        name: "tabs-testimonial",
        instances: ["main > section:nth-of-type(3) .tabs-wrapper"]
      },
      {
        name: "cards-article",
        instances: ["main > section:nth-of-type(4) .grid-layout.desktop-4-column"]
      },
      {
        name: "accordion-faq",
        instances: ["main > section:nth-of-type(5) .faq-list"]
      },
      {
        name: "hero-banner",
        instances: ["section.section.inverse-section"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero",
        selector: "header.section.secondary-section",
        style: null,
        blocks: ["hero-landing"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Featured Article",
        selector: "main > section:nth-of-type(1)",
        style: null,
        blocks: ["columns-editorial"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Photo Gallery",
        selector: "main > section:nth-of-type(2)",
        style: "light",
        blocks: ["cards-gallery"],
        defaultContent: [
          "main > section:nth-of-type(2) .utility-text-align-center h2",
          "main > section:nth-of-type(2) .utility-text-align-center p"
        ]
      },
      {
        id: "section-4",
        name: "Testimonials",
        selector: "main > section:nth-of-type(3)",
        style: null,
        blocks: ["tabs-testimonial"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Latest Articles",
        selector: "main > section:nth-of-type(4)",
        style: "light",
        blocks: ["cards-article"],
        defaultContent: [
          "main > section:nth-of-type(4) .utility-text-align-center h2",
          "main > section:nth-of-type(4) .utility-text-align-center p"
        ]
      },
      {
        id: "section-6",
        name: "FAQ",
        selector: "main > section:nth-of-type(5)",
        style: null,
        blocks: ["accordion-faq"],
        defaultContent: [
          "main > section:nth-of-type(5) h2",
          "main > section:nth-of-type(5) .subheading"
        ]
      },
      {
        id: "section-7",
        name: "CTA Banner",
        selector: "section.section.inverse-section",
        style: null,
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
  var import_homepage_default = {
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
