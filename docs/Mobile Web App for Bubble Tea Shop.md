# Research: Mobile Web App for Bubble Tea Shop

**Focus:** Mobile-first interface (WeChat mini app / Telegram style), Chinese tea-brand aesthetic (Chagee, 阿嬷手作, Heytea).

---

## 1. Best repos & documentation (tech stack)

### Cross-platform mini-app frameworks (one codebase → WeChat + H5 + more)

| Resource | URL | Why use it |
| ---------- | ----- | ------------ |
| **Taro** | [github.com/NervJS/taro](https://github.com/NervJS/taro) | React/Vue → WeChat, Alipay, ByteDance mini programs + **H5** (mobile web). ~35k stars. Best if you want mini-app + PWA from one codebase. |
| **uni-app** | [github.com/dcloudio/uni-app](https://github.com/dcloudio/uni-app) · [uniapp.dcloud.net.cn](https://uniapp.dcloud.net.cn/) | Vue → 10+ platforms (WeChat, Alipay, H5, iOS, Android). Huge e-commerce plugin/template market. |
| **Remax** | [github.com/remaxjs/remax](https://github.com/remaxjs/remax) | React-only mini program framework. Less active than Taro. |

### Mobile UI libraries (shop / e-commerce components)

| Resource | URL | Why use it |
| ---------- | ----- | ------------ |
| **Vant** | [github.com/youzan/vant](https://github.com/youzan/vant) · [vant-ui.github.io/vant](https://vant-ui.github.io/vant/) | **#1 mobile Vue UI** from Youzan. Has **SubmitBar**, **Sku**, **GoodsAction**, **Card**, **Coupon**, **AddressList** — ideal for shop/ordering. ~23k stars. |
| **NutUI** | [github.com/jdf2e/nutui](https://github.com/jdf2e/nutui) · [nutui.jd.com](https://nutui.jd.com/) | JD.com mobile UI; **Taro-compatible**. E-commerce components: Price, Address, Invoice, Category. |
| **Ant Design Mobile** | [github.com/ant-design/ant-design-mobile](https://github.com/ant-design/ant-design-mobile) · [mobile.ant.design](https://mobile.ant.design/) | Alibaba mobile components for React. Great gestures/animations; use for primitives (lists, forms, popups, tabs). |
| **Vant Weapp** | [github.com/youzan/vant-weapp](https://github.com/youzan/vant-weapp) | Native WeChat mini program version of Vant (same design system). |

### PWA (installable mobile web)

| Resource | URL | Why use it |
| ---------- | ----- | ------------ |
| **Vite PWA** | [github.com/vite-pwa/vite-plugin-pwa](https://github.com/vite-pwa/vite-plugin-pwa) · [vite-pwa-org.netlify.app](https://vite-pwa-org.netlify.app/) | Add PWA (service worker, manifest, offline, install prompt) to Vite (Vue/React/Svelte). |
| **Workbox** | [developer.chrome.com/docs/workbox](https://developer.chrome.com/docs/workbox/) | Google service worker toolkit: offline, background sync, push. |
| **web.dev PWA** | [web.dev/explore/progressive-web-apps](https://web.dev/explore/progressive-web-apps) | Official PWA docs (manifest, installability, performance). |

### Telegram mini apps

| Resource | URL | Why use it |
| ---------- | ----- | ------------ |
| **Telegram Mini Apps** | [core.telegram.org/bots/webapps](https://core.telegram.org/bots/webapps) | Official docs: WebApp API, theming, payments, MainButton, BackButton. |
| **@telegram-apps/sdk** | [github.com/Telegram-Mini-Apps/telegram-apps](https://github.com/Telegram-Mini-Apps/telegram-apps) · [docs.telegram-mini-apps.com](https://docs.telegram-mini-apps.com/) | React/Vue/Solid SDK: init, theme, viewport, Telegram features. |
| **React template** | [github.com/Telegram-Mini-Apps/reactjs-template](https://github.com/Telegram-Mini-Apps/reactjs-template) | Official React + Vite starter for Telegram Mini Apps. |

### Full shop references (layout & flow)

| Resource | URL | Why use it |
| ---------- | ----- | ------------ |
| **newbee-mall-vue3-app** | [github.com/newbee-ltd/newbee-mall-vue3-app](https://github.com/newbee-ltd/newbee-mall-vue3-app) | **Best reference:** Vue 3 + Vant 4 mobile mall — home, category, cart, order, address, user center. ~3k stars. |
| **vant-demo** | [github.com/youzan/vant-demo](https://github.com/youzan/vant-demo) | Official Vant demo: full mobile store (listing, cart, checkout). |
| **litemall** | [github.com/linlinjava/litemall](https://github.com/linlinjava/litemall) | Full system: WeChat mini program + Vue mobile + Spring Boot backend. ~19k stars. |
| **Mall4j** | [github.com/yami-shop/mall4j](https://github.com/yami-shop/mall4j) | Open-source e-commerce with mobile H5 + uni-app; Spring Boot. |

### Backend (headless commerce)

| Resource | URL | Why use it |
| ---------- | ----- | ------------ |
| **Medusa** | [github.com/medusajs/medusa](https://github.com/medusajs/medusa) · [docs.medusajs.com](https://docs.medusajs.com/) | Headless commerce (products, orders, inventory, payments). Node/TS. Use any mobile frontend. ~25k stars. |
| **Saleor** | [github.com/saleor/saleor](https://github.com/saleor/saleor) + [storefront](https://github.com/saleor/storefront) | Headless + GraphQL; storefront is Next.js mobile-first. |

---

## 2. Recommended stacks for your bubble tea shop

**Option A — Global / Telegram / PWA (recommended)**  
- **Frontend:** Vite + Vue 3 + **Vant 4** + `vite-plugin-pwa`  
- **Optional:** `@telegram-apps/sdk-vue` for Telegram Mini App  
- **Backend:** Medusa or your own API  
- **Deploy:** Vercel / Cloudflare Pages  

**Option B — WeChat + H5 (Chinese mini-app style)**  
- **Frontend:** **Taro 3** + NutUI (or **uni-app** + Vant Weapp)  
- **Targets:** WeChat Mini Program + H5  
- **Backend:** Spring Boot or Node.js  

**Option C — React-first PWA**  
- **Frontend:** Next.js + Ant Design Mobile + `next-pwa`  
- **Backend:** Saleor or Medusa  

---

## 3. Design: Chinese mini-app aesthetic (Chagee, 阿嬷手作, Heytea)

Brands like Chagee (霸王茶姬), 阿嬷手作, Heytea (喜茶) share a **clean, modern, high-quality** mini-app feel. To get close to that style:

### UX principles (WeChat mini program best practices)

- **Simplicity & efficiency** — Few taps to order; clear hierarchy; one main task per screen.  
- **Fast load** — Small initial bundle; lazy load images; cache wisely.  
- **Minimal input** — Auto-fill, smart defaults, scan/voice where it helps.  
- **Clear navigation** — Bottom tab (2–5 items), consistent back/home; don’t fight the host app (WeChat/Telegram).  
- **Touch-first** — Large tap targets (e.g. 44×44px); clear feedback (loading, success, error).  
- **Whitespace & hierarchy** — Plenty of space; clear typography and focal point per screen.  
- **Brand integration** — Use your colors/imagery in a way that still feels like a mini app (familiar patterns).  

**Reference:** [WeChat Mini Program UX Design Best Practices](https://digitalcreative.cn/blog/wechat-mini-program-ux-design-best-practices) (Digital Creative) — covers visual design, responsive layout, WeChat UI components, e-commerce/O2O use cases.

### Visual style (tea / F&B mini apps)

- **Imagery:** Large, appetizing product photos; hero banners; clean product cards.  
- **Colors:** Often warm, soft palettes (cream, soft green, muted red/brown); strong contrast for CTAs.  
- **Typography:** Clear hierarchy; readable system or brand fonts; avoid tiny body text.  
- **Components:** Card-based layout; sticky bottom bar for “Add to cart” / “Order”; stepper, SKU selector, coupon strips.  
- **Motion:** Light, purposeful (e.g. list reveal, cart update); avoid heavy animation.  

Using **Vant** (or **NutUI** with Taro) gives you this kind of component set out of the box and is aligned with how many Chinese F&B mini apps are built.

---

## 4. Indexed resources in Nia

- **Current:** No indexed repos/docs matched "mobile", "mini app", "wechat", "pwa", or "vant vue design" in your Nia list.  
- **Suggest indexing** for future search and context:
  - `https://github.com/youzan/vant`
  - `https://vant-ui.github.io/vant/` (or Vant docs root)
  - `https://github.com/NervJS/taro`
  - `https://github.com/newbee-ltd/newbee-mall-vue3-app`
  - `https://docs.telegram-mini-apps.com/` (if you use Telegram)

---

## 5. Quick wins

1. **Study** [newbee-mall-vue3-app](https://github.com/newbee-ltd/newbee-mall-vue3-app) for mobile shop layout and flow.  
2. **Use Vant 4** (Vue) or **NutUI + Taro** for e-commerce UI and Chinese mini-app feel.  
3. **Add PWA** with `vite-plugin-pwa` so the app is installable and works offline.  
4. **Apply** the WeChat mini program UX principles above even if you ship as PWA/Telegram first.  
5. **Optional:** Index Vant docs and Taro (and optionally newbee-mall) in Nia for fast reference while building.

---

*Research combined from: Nia oracle research, Nia tracer (GitHub), and WeChat Mini Program UX article. Design section aligned with Chagee / 阿嬷手作 / Heytea-style Chinese tea mini apps.*
