# Next.js 15 App Router Best Practices Research Report

## Executive Summary

This report compiles the most current best practices for implementing image optimization, lazy loading, error handling, accessibility, and currency formatting in Next.js 15 App Router applications, specifically tailored for e-commerce use cases.

## Table of Contents

1. [Image Optimization & Lazy Loading](#image-optimization--lazy-loading)
2. [Server Actions & API Routes Error Handling](#server-actions--api-routes-error-handling)
3. [E-commerce PWA Accessibility Requirements](#ecommerce-pwa-accessibility-requirements)
4. [Currency Formatting in TypeScript/Next.js](#currency-formatting-in-typescriptnextjs)
5. [Implementation Checklist](#implementation-checklist)

---

## Image Optimization & Lazy Loading

### Core Principles

**Next.js 15 Image Component (`next/image`)**
- Automatically provides format negotiation (WebP/AVIF), responsive sizing, lazy loading, and layout shift prevention
- **Default behavior**: `loading="lazy"` for all images unless `priority={true}` is set

### Best Practices for E-commerce Product Images

#### 1. Strategic Priority Usage
```tsx
// ✅ Only mark above-the-fold images as priority
<Image
  src={product.imageUrl}
  alt={product.name}
  width={600}
  height={600}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  quality={80}
  placeholder="blur"
  blurDataURL={product.blurHash}
  loading="lazy" // Default, can be omitted
/>

// ✅ Only first visible row gets priority
const ProductGrid = ({ products }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {products.map((product, index) => (
      <Image
        key={product.id}
        src={product.imageUrl}
        alt={product.name}
        priority={index < 4} // First 4 items (one row on desktop)
      />
    ))}
  </div>
)
```

#### 2. Critical `sizes` Prop Configuration
| Layout | Mobile | Tablet | Desktop | `sizes` Value |
|--------|--------|--------|---------|---------------|
| Product grid (2-col mobile, 4-col desktop) | 50vw | 33vw | 25vw | `(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw` |
| PDP hero | 100vw | 100vw | 50vw | `(max-width: 768px) 100vw, 50vw` |
| Cart thumbnails | 96px | 96px | 128px | `128px` |

#### 3. Configuration in `next.config.js`
```js
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'], // AVIF provides 30-50% better compression
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.your-cdn.com',
      },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
};
```

#### 4. PDP Gallery Pattern
```tsx
// Product Detail Page - Hero Image (Priority)
<Image
  src={product.images[0].url}
  alt={`${product.name} - Main View`}
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
  priority={true}
  quality={85}
  placeholder="blur"
  blurDataURL={product.images[0].blurDataURL}
/>

// Thumbnails (Lazy loaded)
{product.images.slice(1).map((image, i) => (
  <Image
    key={i}
    src={image.url}
    alt={`${product.name} - View ${i + 2}`}
    fill
    sizes="(max-width: 768px) 25vw, 12vw"
    quality={70} // Lower quality for small thumbnails
    placeholder="blur"
    blurDataURL={image.blurDataURL}
  />
))}
```

### Performance Optimization Patterns

1. **Static Imports**: Use for known images to get automatic dimensions and blur placeholders
2. **Server Components**: Fetch image metadata server-side to avoid client-side data fetching
3. **Custom CDN Loaders**: Offload image processing to specialized CDNs (Cloudinary, Imgix)
4. **Intersection Observer**: Use for infinite scroll with `rootMargin: '200px'` for preloading

### Testing Checklist
- [ ] LCP image has `priority`
- [ ] No oversized images on mobile
- [ ] `sizes` prop matches actual rendered size
- [ ] CLS is below 0.1
- [ ] AVIF/WebP is served
- [ ] Blur placeholders render
- [ ] No `<Image>` without `alt` text

---

## Server Actions & API Routes Error Handling

### Core Principle: Return Errors as Values

**Server Actions:**
- Never throw errors that escape the action (triggers `error.tsx` boundary)
- Always use `try/catch` and return serializable result objects
- Use `useActionState` hook for client-side error handling

```tsx
// ✅ Server Action Pattern
'use server'

type ActionResult = {
  success: boolean
  message: string
  data?: unknown
}

export async function createItem(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const title = formData.get('title') as string
    
    if (!title) {
      return { success: false, message: 'Title is required.' }
    }
    
    await db.items.create({ data: { title } })
    return { success: true, message: 'Item created.' }
  } catch (error) {
    console.error('createItem failed:', error)
    return { success: false, message: 'Something went wrong.' }
  }
}

// ✅ Client Component
'use client'
import { useActionState } from 'react'

const initialState = { success: false, message: '' }

export default function NewItemPage() {
  const [state, formAction, isPending] = useActionState(createItem, initialState)
  
  return (
    <form action={formAction}>
      <input name="title" required />
      <button disabled={isPending}>
        {isPending ? 'Saving…' : 'Create'}
      </button>
      {state.message && (
        <p role="alert" style={{ color: state.success ? 'green' : 'red' }}>
          {state.message}
        </p>
      )}
    </form>
  )
}
```

### API Routes Pattern

**Route Handlers:**
- Always use `try/catch` to return proper HTTP responses
- Map errors to appropriate status codes
- Remember: `params` is now async in Next.js 15

```tsx
// ✅ Route Handler Pattern
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }
    
    const item = await db.items.create({ data: { title: body.title } })
    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('POST /api/items failed:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// ✅ GET with async params
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const item = await db.items.findUnique({ where: { id } })
    
    if (!item) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    
    return NextResponse.json(item)
  } catch (error) {
    console.error(`GET /api/items/${(await params).id} failed:`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

### Error Boundary Safety Net

```tsx
// app/error.tsx - Last line of defense
'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

### Decision Matrix

| Scenario | Pattern | Why |
|----------|---------|-----|
| Form submission | Server Action + `useActionState` | Preserves form state, inline error display |
| External API consumed by third parties | Route Handler + try/catch | Full HTTP semantics |
| Webhook endpoint | Route Handler + try/catch | Must return proper status to caller |
| Unexpected errors | `error.tsx` boundary | Catches anything that slips through |

---

## E-commerce PWA Accessibility Requirements

### Target: WCAG 2.1 Level AA

**Legal Standing:** Referenced by ADA, European Accessibility Act, EN 301 549
**E-commerce Viability:** Minimum viable target for compliance and conversion optimization

### Critical WCAG 2.1 AA Requirements for E-commerce

#### Perceivable
- **1.1.1 Non-text Content**: Meaningful `alt` text for all product images
- **1.3.1 Info and Relationships**: Semantic HTML for forms, tables, navigation
- **1.3.4 Orientation**: No forced orientation (portrait/landscape lock)
- **1.3.5 Identify Input Purpose**: Use `autocomplete` attributes for checkout
- **1.4.3 Contrast (Minimum)**: 4.5:1 ratio for text, 3:1 for UI components
- **1.4.4 Resize Text**: Content usable at 200% zoom without loss
- **1.4.10 Reflow**: Single column at 320px width, no horizontal scrolling
- **1.4.11 Non-text Contrast**: 3:1 contrast for UI elements and icons
- **1.4.13 Content on Hover or Focus**: Tooltips must be dismissible, hoverable, persistent

#### Operable
- **2.1.1 Keyboard**: Everything must work with keyboard alone
- **2.1.4 Character Key Shortcuts**: Single-character shortcuts must be remappable
- **2.4.3 Focus Order**: Logical tab order
- **2.4.5 Multiple Ways**: At least two ways to find any page (search + nav, sitemap + breadcrumbs)
- **2.4.7 Focus Visible**: Visible focus indicators on all interactive elements
- **2.5.1 Pointer Gestures**: Multipoint/path gestures must have single-pointer alternatives
- **2.5.3 Label in Name**: Visible button label must match accessible name

#### Understandable
- **3.1.1 Language of Page**: Set `lang` attribute
- **3.2.2 On Input**: Changing form controls must not cause unexpected context changes
- **3.3.1 Error Identification**: Form errors must be identified in text
- **3.3.2 Labels or Instructions**: Every form field needs visible, programmatic label
- **3.3.3 Error Suggestion**: Provide suggestions for correction when known
- **3.3.4 Error Prevention (Legal, Financial, Data)**: **Critical for e-commerce**
  - Review, confirm, and reverse capability for transactions
  - Must have order review step before final purchase

#### Robust
- **4.1.1 Parsing**: Valid, well-formed HTML
- **4.1.2 Name, Role, Value**: Custom components must expose correct ARIA semantics
- **4.1.3 Status Messages**: Dynamic content updates must be announced via ARIA live regions

### E-commerce Specific Patterns

#### Product Listing Page
- Product images: descriptive `alt` text
- Filter controls: keyboard operable, state changes announced
- Lazy-loaded products: no keyboard traps
- Sorting: announce results via `aria-live`

#### Product Detail Page
- Image carousel: keyboard controls, descriptive alt text
- Size/color selectors: proper form semantics or `role="radiogroup"`
- "Add to Cart": semantic `<button>`
- Cart confirmation: `role="status"` without focus shift

#### Shopping Cart
- Items in `<table>` or equivalent semantic structure
- Quantity changes: keyboard operable, announce totals
- Remove buttons: `aria-label="Remove Navy Sweater from cart"`

#### Checkout Flow
- All fields have visible `<label>` elements
- `autocomplete` attributes on applicable fields
- Inline validation with `aria-describedby`
- Order review step before submission
- Progress indicator with `aria-current="step"`

### PWA-Specific Considerations

| Pattern | Risk | WCAG Mapping |
|---------|------|--------------|
| Service worker offline page | Must be accessible | 1.1.1, 1.3.1, 2.1.1 |
| App install banner | Must be dismissible via keyboard | 2.1.1, 2.1.2 |
| Push notification opt-in | Modal must not trap focus | 2.1.1, 3.2.1, 3.2.2 |
| Client-side routing | Must announce content changes | 4.1.3, 2.4.3 |
| Skeleton screens | Loading states must be communicated | 4.1.3, 1.3.1 |

### Testing Strategy

**Automated (30-40% of issues):**
- `axe-core` integration in CI/CD
- Lighthouse Accessibility audit
- `pa11y` for automated page scanning

**Manual (60-70% of issues):**
- Keyboard-only navigation through entire checkout
- Screen reader testing (VoiceOver, NVDA, TalkBack)
- Zoom to 200% with reflow verification
- High contrast mode compatibility
- Reduced motion support

---

## Currency Formatting in TypeScript/Next.js

### Core Principle: Use `Intl.NumberFormat`

**Why Intl.NumberFormat:**
- Locale-aware formatting
- No external dependencies
- Standardized across platforms
- Handles thousands separators, decimal marks, currency placement

```typescript
// ✅ Core Pattern
const formatted = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
}).format(1234.56)
// → "$1,234.56"
```

### Type-Safe Currency Utility

```typescript
// lib/currency.ts
export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD'

export interface FormatCurrencyOptions {
  amount: number
  currency: SupportedCurrency
  locale?: string
  trailingZeros?: boolean
  compact?: boolean
}

export function formatCurrency({
  amount,
  currency,
  locale = 'en-US',
  trailingZeros = true,
  compact = false,
}: FormatCurrencyOptions): string {
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency,
    ...(compact && {
      notation: 'compact',
      compactDisplay: 'short',
    }),
    ...(!trailingZeros &&
      Number.isInteger(amount) && {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
  }

  return new Intl.NumberFormat(locale, options).format(amount)
}
```

### Performance: Cache Formatter Instances

```typescript
const formatterCache = new Map<string, Intl.NumberFormat>()

function getFormatter(locale: string, currency: string, options?: Intl.NumberFormatOptions): Intl.NumberFormat {
  const key = `${locale}-${currency}-${JSON.stringify(options ?? {})}`

  if (!formatterCache.has(key)) {
    formatterCache.set(key, new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      ...options,
    }))
  }

  return formatterCache.get(key)!
}
```

### Money Type: Integers over Floats

**Critical: Store currency as integers in smallest unit (cents)**

```typescript
export interface Money {
  amountInCents: number  // 1999 = $19.99
  currency: SupportedCurrency
}

const ZERO_DECIMAL_CURRENCIES: SupportedCurrency[] = ['JPY']

export function formatMoney(money: Money, locale = 'en-US'): string {
  const divisor = ZERO_DECIMAL_CURRENCIES.includes(money.currency) ? 1 : 100
  return getFormatter(locale, money.currency).format(money.amountInCents / divisor)
}
```

### Next.js Integration

#### Server Component Pattern
```tsx
// app/products/[id]/page.tsx
import { formatMoney, Money } from '@/lib/currency'
import { headers } from 'next/headers'

function getLocale(): string {
  const headersList = headers()
  return headersList.get('accept-language')?.split(',')[0] ?? 'en-US'
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id)
  const locale = getLocale()

  const price: Money = {
    amountInCents: product.priceInCents,
    currency: product.currency,
  }

  return (
    <div>
      <h1>{product.name}</h1>
      <p className="text-2xl font-bold">{formatMoney(price, locale)}</p>
    </div>
  )
}
```

#### Client Component with Context
```tsx
// context/CurrencyContext.tsx
'use client'

import { createContext, useContext, ReactNode } from 'react'
import { SupportedCurrency, formatMoney, Money } from '@/lib/currency'

interface CurrencyContextValue {
  currency: SupportedCurrency
  locale: string
  format: (amountInCents: number) => string
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null)

export function CurrencyProvider({
  children,
  currency,
  locale,
}: { children: ReactNode; currency: SupportedCurrency; locale: string }) {
  const format = (amountInCents: number) =>
    formatMoney({ amountInCents, currency }, locale)

  return (
    <CurrencyContext.Provider value={{ currency, locale, format }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider')
  return ctx
}
```

### Currency Conversion (Separate from Formatting)

```typescript
export function convertCurrency(
  amount: Money,
  targetCurrency: SupportedCurrency,
  rates: ExchangeRates
): Money {
  if (amount.currency === targetCurrency) return amount

  const rate = rates[amount.currency]?.[targetCurrency]
  if (!rate) throw new Error(`No rate for ${amount.currency} → ${targetCurrency}`)

  return {
    amountInCents: Math.round(amount.amountInCents * rate),
    currency: targetCurrency,
  }
}
```

### Testing

```typescript
describe('formatMoney', () => {
  it('formats USD correctly', () => {
    expect(formatMoney({ amountInCents: 1999, currency: 'USD' }, 'en-US'))
      .toBe('$19.99')
  })

  it('handles zero-decimal currencies (JPY)', () => {
    expect(formatMoney({ amountInCents: 1500, currency: 'JPY' }, 'ja-JP'))
      .toBe('￥1,500')
  })

  it('formats EUR with German locale', () => {
    const result = formatMoney({ amountInCents: 4550, currency: 'EUR' }, 'de-DE')
    expect(result).toContain('45,50')
    expect(result).toContain('€')
  })
})
```

---

## Implementation Checklist

### Image Optimization
- [ ] Configure `next.config.js` with AVIF/WebP formats
- [ ] Implement correct `sizes` prop for all product images
- [ ] Use `priority` only for above-the-fold hero images
- [ ] Generate and store blur placeholders in database
- [ ] Set up custom CDN loader for production scale
- [ ] Test Core Web Vitals improvements

### Error Handling
- [ ] Wrap all Server Actions in try/catch returning typed results
- [ ] Use `useActionState` for client-side error display
- [ ] Implement proper HTTP status codes in Route Handlers
- [ ] Remember async `params` in Route Handlers
- [ ] Create `error.tsx` boundaries at appropriate levels
- [ ] Log server-side errors, return safe messages to client

### Accessibility
- [ ] Target WCAG 2.1 Level AA compliance
- [ ] Implement semantic HTML throughout
- [ ] Add proper `autocomplete` attributes to checkout forms
- [ ] Ensure all interactive elements are keyboard accessible
- [ ] Implement ARIA live regions for dynamic content
- [ ] Test with screen readers and keyboard navigation
- [ ] Verify color contrast ratios (4.5:1 text, 3:1 UI)

### Currency Formatting
- [ ] Implement `Intl.NumberFormat` wrapper with caching
- [ ] Use integer cents storage for all monetary values
- [ ] Create `Money` type for type safety
- [ ] Integrate with Next.js i18n for locale detection
- [ ] Implement currency context for client components
- [ ] Add comprehensive test coverage

### Cross-Cutting Concerns
- [ ] Performance monitoring (Core Web Vitals)
- [ ] Accessibility automated testing in CI/CD
- [ ] Error logging and monitoring
- [ ] Currency rate management and caching
- [ ] Progressive enhancement for offline scenarios

---

## Quick Reference Commands

### Image Configuration
```bash
# Add to next.config.js
images: {
  formats: ['image/avif', 'image/webp'],
  remotePatterns: [{ protocol: 'https', hostname: '**.your-cdn.com' }],
  minimumCacheTTL: 60 * 60 * 24 * 30,
}
```

### Server Action Template
```tsx
'use server'
export async function actionName(prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    // validation and logic
    return { success: true, message: 'Success' }
  } catch (error) {
    console.error('actionName failed:', error)
    return { success: false, message: 'Something went wrong' }
  }
}
```

### Currency Utility
```typescript
// lib/currency.ts - Copy this file
// Provides: formatCurrency, formatMoney, Money type, caching
```

### Accessibility Quick Wins
```html
<!-- Form labels -->
<label for="email">Email address</label>
<input type="email" id="email" autocomplete="email" />

<!-- Status messages -->
<div role="status" aria-live="polite" aria-atomic="true">Item added to cart</div>

<!-- Focus indicators -->
*:focus-visible { outline: 3px solid #1a73e8; outline-offset: 2px; }
```

This comprehensive guide provides the foundation for building a performant, accessible, and user-friendly e-commerce application with Next.js 15 App Router.