# Oracle Research Report

**Date:** 2/13/2026, 6:50:47 PM
**Duration:** 80.1s
**Iterations:** 1

---

##

***the prompt I used was this one***:
are there blueprint out there (or github repo), that show how to build mini apps like we find in wechat? I love the design of some of their app, the ones I have in mind are Chagee, 阿嬷手作, Heytea, ... ...

## Research Query

Best repositories and documentation to build a mobile web app for a shop (e.g. bubble tea). Focus: mobile-first interface similar to WeChat mini apps or Telegram mini apps. Include: PWA, Taro, uni-app, WeChat mini program alternatives, mobile e-commerce / ordering UI frameworks, and best docs for mobile shop frontend.

---

## Research Report

## Building a Mobile Web App for a Shop: Best Repos, Frameworks & Documentation

The best approach for building a mobile-first shop app (e.g., bubble tea ordering) depends on your target market and distribution strategy. If you're targeting **Chinese super-app ecosystems**, frameworks like **Taro** and **uni-app** let you write once and deploy to WeChat/Alipay mini programs and H5. If you're targeting **global users via the mobile web**, a **PWA** built with a mobile UI kit (like Vant or NutUI) is your strongest option. For **Telegram-native distribution**, the **Telegram Mini Apps SDK** is purpose-built.

Below is a structured, prioritized list of open-source repositories and documentation.

---

### Cross-Platform Mini App Frameworks (Write Once, Deploy Everywhere)

| Repo / Docs | URL | Why It's Relevant | Tech Stack |
| --- | --- | --- | --- |
| **Taro** | [https://github.com/NervJS/taro](https://github.com/NervJS/taro) | One of the most popular cross-platform frameworks for building mini programs. Compiles to **WeChat, Alipay, Baidu, ByteDance mini programs**, H5 (mobile web), and React Native. Ideal if you want a single codebase that outputs both a mini app and a mobile PWA. Excellent docs and large community (~35k+ GitHub stars). | React / Vue 3, TypeScript |
| **uni-app** | [https://github.com/dcloudio/uni-app](https://github.com/dcloudio/uni-app) — Docs: [https://uniapp.dcloud.net.cn/](https://uniapp.dcloud.net.cn/) | The **most widely adopted** cross-platform mini app framework in the Chinese ecosystem. Compiles to 10+ platforms including WeChat/Alipay/ByteDance mini programs, H5, iOS, and Android. Has a rich plugin marketplace (`uni-app marketplace`) with ready-made e-commerce templates. | Vue 2 / Vue 3, TypeScript |
| **Remax** | [https://github.com/nickolasfisher/remax](https://github.com/nickolasfisher/remax) (original: `remaxjs/remax`) | A React-based alternative for building mini programs with a more React-idiomatic API. Less actively maintained than Taro but still a valid option for React purists. | React, TypeScript |

---

### PWA (Progressive Web App) Core Resources

| Repo / Docs | URL | Why It's Relevant | Tech Stack |
| --- | --- | --- | --- |
| **Vite PWA Plugin** | [https://github.com/vite-pwa/vite-plugin-pwa](https://github.com/vite-pwa/vite-plugin-pwa) — Docs: [https://vite-pwa-org.netlify.app/](https://vite-pwa-org.netlify.app/) | The **easiest way to add PWA capabilities** (service worker, manifest, offline support, install prompt) to any Vite-based project. Works with Vue, React, Svelte, etc. Essential for making your shop "installable" on mobile home screens. | Vite, Workbox |
| **Workbox** | [https://github.com/GoogleChrome/workbox](https://github.com/GoogleChrome/workbox) — Docs: [https://developer.chrome.com/docs/workbox/](https://developer.chrome.com/docs/workbox/) | Google's **production-grade service worker toolkit**. Powers offline caching, background sync (critical for orders in spotty connectivity), and push notifications. Most PWA plugins use Workbox under the hood. | Vanilla JS / TypeScript |
| **web.dev PWA Guide** | [https://web.dev/explore/progressive-web-apps](https://web.dev/explore/progressive-web-apps) | Google's **official PWA documentation**. Covers manifest setup, service workers, installability criteria, and performance best practices. The canonical reference for PWA development. | Framework-agnostic |
| **Next.js PWA (`next-pwa`)** | [https://github.com/shadowwalker/next-pwa](https://github.com/shadowwalker/next-pwa) | If building with Next.js, this plugin auto-generates service workers with zero config. Good for SSR-based shop apps that need SEO (e.g., menu pages discoverable via Google). | Next.js, React |

---

### Mobile UI Component Libraries (Shop/E-commerce Focused)

| Repo / Docs | URL | Why It's Relevant | Tech Stack |
| --- | --- | --- | --- |
| **Vant** | [https://github.com/youzan/vant](https://github.com/youzan/vant) — Docs: [https://vant-ui.github.io/vant/](https://vant-ui.github.io/vant/) | **The #1 mobile Vue UI library**, created by Youzan (a major Chinese e-commerce platform). Includes **purpose-built commerce components**: `SubmitBar`, `Card` (product card), `Sku` (variant selector), `Coupon`, `AddressList`, `ContactCard`, `GoodsAction` (add-to-cart bar). **This is the single most relevant UI library for a shop app.** ~23k stars. | Vue 3 (Vant 4), Vue 2 (Vant 2) |
| **NutUI** | [https://github.com/jdf2e/nutui](https://github.com/jdf2e/nutui) — Docs: [https://nutui.jd.com/](https://nutui.jd.com/) | JD.com's mobile UI library. Has **Taro-compatible versions**, so you can use it in both H5 and mini programs. Includes e-commerce components like `Price`, `Address`, `Invoice`, `Category`. Best choice if using Taro. | Vue 3, Taro, React (NutUI-React) |
| **Ant Design Mobile** | [https://github.com/ant-design/ant-design-mobile](https://github.com/ant-design/ant-design-mobile) — Docs: [https://mobile.ant.design/](https://mobile.ant.design/) | Alibaba's mobile component library. High quality, great for React developers. Excellent gesture handling and animations. Doesn't have e-commerce-specific components but has all the primitives (lists, forms, popups, tabs) you need. | React, TypeScript |
| **Vant Weapp** | [https://github.com/youzan/vant-weapp](https://github.com/youzan/vant-weapp) | The **WeChat mini program native version** of Vant. If you're building directly for WeChat without a cross-compiler, this gives you the same Vant design system with native mini program components. | WeChat Mini Program (WXML/WXSS) |

---

### Telegram Mini Apps

| Repo / Docs | URL | Why It's Relevant | Tech Stack |
| --- | --- | --- | --- |
| **Telegram Mini Apps Docs** | [https://core.telegram.org/bots/webapps](https://core.telegram.org/bots/webapps) | **Official documentation** for Telegram Mini Apps (formerly Web Apps). Covers the `WebApp` JS object, theming, payment integration, `MainButton`, `BackButton`, haptic feedback, and cloud storage. Essential reading. | Framework-agnostic |
| **@telegram-apps/sdk** | [https://github.com/Telegram-Mini-Apps/telegram-apps](https://github.com/Telegram-Mini-Apps/telegram-apps) — Docs: [https://docs.telegram-mini-apps.com/](https://docs.telegram-mini-apps.com/) | The **community-maintained SDK and toolkit** for Telegram Mini Apps. Includes `@telegram-apps/sdk-react`, `@telegram-apps/sdk-vue`, and `@telegram-apps/sdk-solid`. Handles initialization, theme sync, viewport management, and Telegram-native features. | TypeScript, React/Vue/Solid |
| **Telegram Mini Apps React Template** | [https://github.com/Telegram-Mini-Apps/reactjs-template](https://github.com/Telegram-Mini-Apps/reactjs-template) | **Official starter template** for building Telegram Mini Apps with React. Pre-configured with TON Connect (for crypto payments), routing, and Telegram SDK integration. Great starting point for a shop. | React, TypeScript, Vite |
| **TMA.js (grammY)** | [https://github.com/grammyjs/grammY](https://github.com/grammyjs/grammY) — Docs: [https://grammy.dev/](https://grammy.dev/) | While primarily a **bot framework**, grammY is the best-documented way to handle the **backend bot logic** that launches your mini app, handles payments via Telegram Payments API, and sends order confirmations. | TypeScript, Deno/Node.js |

---

### E-Commerce / Ordering App Templates & Boilerplates

| Repo / Docs | URL | Why It's Relevant | Tech Stack |
| --- | --- | --- | --- |
| **Youzan Vant Demo Store** | [https://github.com/youzan/vant-demo](https://github.com/youzan/vant-demo) | Official demo project by the Vant team showing a **complete mobile store** with product listing, cart, and checkout. The fastest way to see how Vant commerce components work together. | Vue 3, Vant |
| **Mall4j (开源商城)** | [https://github.com/yami-shop/mall4j](https://github.com/yami-shop/mall4j) | A **full-stack open-source e-commerce system** with a mobile H5 frontend. Includes product management, shopping cart, order system, and payment. Good reference architecture. | Vue, uni-app, Spring Boot |
| **Newbee Mall (newbee-mall-vue3-app)** | [https://github.com/newbee-ltd/newbee-mall-vue3-app](https://github.com/newbee-ltd/newbee-mall-vue3-app) | A **complete mobile mall frontend** built with Vue 3 + Vant 4. Includes home page, category, cart, order, address management, and user center. **Excellent reference for layout and flow of a shop app.** ~3k stars. | Vue 3, Vant 4, Vue Router |
| **litemall** | [https://github.com/linlinjava/litemall](https://github.com/linlinjava/litemall) | A small but **complete mall system** with WeChat mini program frontend + admin dashboard + backend. Good reference for understanding full mini-program shop architecture. ~19k stars. | WeChat Mini Program, Vue, Spring Boot |

---

### Supplementary Tools & Resources

| Repo / Docs | URL | Why It's Relevant | Tech Stack |
| --- | --- | --- | --- |
| **Medusa.js** | [https://github.com/medusajs/medusa](https://github.com/medusajs/medusa) — Docs: [https://docs.medusajs.com/](https://docs.medusajs.com/) | **Open-source headless commerce engine.** If you need a robust backend for products, orders, inventory, discounts, and payments, Medusa is the best OSS option. Use any mobile frontend on top. ~25k stars. | Node.js, TypeScript, PostgreSQL |
| **Saleor** | [https://github.com/saleor/saleor](https://github.com/saleor/saleor) — Storefront: [https://github.com/saleor/storefront](https://github.com/saleor/storefront) | Another **headless commerce platform** with a GraphQL API. The `storefront` repo is a Next.js reference implementation. More mature than Medusa for complex catalogs. | Python (Django), GraphQL, Next.js |
| **VueUse** | [https://github.com/vueuse/vueuse](https://github.com/vueuse/vueuse) | Collection of Vue composition utilities. Relevant composables: `useGeolocation` (find nearest store), `useStorage` (persist cart), `useNetwork` (detect offline), `useInfiniteScroll` (menu browsing). | Vue 3, TypeScript |

---

### Recommended Architecture for a Bubble Tea Shop App

Based on the above, here is a **practical recommendation** depending on your distribution channel:

**Option A — Global / Telegram Distribution (Recommended for most):**

```
Frontend: Vite + Vue 3 + Vant 4 + vite-plugin-pwa
Telegram: @telegram-apps/sdk-vue
Backend:  Medusa.js (or custom Node.js API)
Deploy:   Vercel / Cloudflare Pages
```

**Option B — Chinese Super-App Ecosystem:**

```
Frontend: Taro 3 + NutUI (or uni-app + Vant Weapp)
Targets:  WeChat Mini Program + H5 + Alipay
Backend:  Spring Boot (or Node.js)
```

**Option C — React-First Global PWA:**

```
Frontend: Next.js + Ant Design Mobile + next-pwa
Backend:  Saleor (GraphQL) or Medusa.js
Deploy:   Vercel
```

---

### Key Takeaways

- **Start with Vant 4** if using Vue — its e-commerce components (`Sku`, `SubmitBar`, `GoodsAction`, `Card`) will save weeks of development for a shop UI.
- **Study `newbee-mall-vue3-app`** as a reference — it's the closest open-source example to a production mobile shop frontend.
- **Use Taro + NutUI** if you need WeChat mini program + mobile web from one codebase.
- **For Telegram Mini Apps**, use the official `@telegram-apps/sdk` with the React or Vue bindings, and pair with grammY for bot logic.
- **Always add PWA support** via `vite-plugin-pwa` — installability, offline caching, and push notifications dramatically improve retention for a shop app.
- **Medusa.js** is the best open-source backend if you don't want to build order/product/payment logic from scratch.
