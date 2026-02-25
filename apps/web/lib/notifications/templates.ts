import type { Order } from '@vetea/shared';
import { formatMoney, toMoney } from '@vetea/shared';

const BRAND_GREEN = '#8B9F82';
const BRAND_BROWN = '#6B5344';
const BRAND_BG = '#F5F0E8';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatEstimatedPickup(date?: Date): string {
  if (!date) return '10–15 min';
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/Los_Angeles',
  });
}

function itemRowsHtml(order: Order): string {
  return order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #E8DDD0;color:${BRAND_BROWN};font-size:14px;">
          ${escapeHtml(item.name)}<br/>
          <span style="font-size:12px;color:#8C7B6B;">${escapeHtml(item.size)} · ${escapeHtml(item.sugar)} · ${escapeHtml(item.ice)}</span>
        </td>
        <td style="padding:8px 0;border-bottom:1px solid #E8DDD0;text-align:center;color:${BRAND_BROWN};font-size:14px;">
          ${item.quantity}
        </td>
        <td style="padding:8px 0;border-bottom:1px solid #E8DDD0;text-align:right;color:${BRAND_BROWN};font-size:14px;white-space:nowrap;">
          ${formatMoney(toMoney(item.unitPriceInCents * item.quantity))}
        </td>
      </tr>`,
    )
    .join('');
}

function priceSummaryHtml(order: Order): string {
  const subtotal = formatMoney(toMoney(order.subtotalInCents));
  const tax = formatMoney(toMoney(order.taxInCents));
  const tip = formatMoney(toMoney(order.tipInCents));
  const total = formatMoney(toMoney(order.totalPriceInCents));

  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
      <tr>
        <td style="padding:4px 0;font-size:14px;color:#8C7B6B;">Subtotal</td>
        <td style="padding:4px 0;font-size:14px;color:${BRAND_BROWN};text-align:right;">${subtotal}</td>
      </tr>
      <tr>
        <td style="padding:4px 0;font-size:14px;color:#8C7B6B;">Tax</td>
        <td style="padding:4px 0;font-size:14px;color:${BRAND_BROWN};text-align:right;">${tax}</td>
      </tr>
      <tr>
        <td style="padding:4px 0;font-size:14px;color:#8C7B6B;">Tip</td>
        <td style="padding:4px 0;font-size:14px;color:${BRAND_BROWN};text-align:right;">${tip}</td>
      </tr>
      <tr>
        <td style="padding:12px 0 0;font-size:16px;font-weight:700;color:${BRAND_BROWN};border-top:2px solid ${BRAND_GREEN};">Total</td>
        <td style="padding:12px 0 0;font-size:16px;font-weight:700;color:${BRAND_BROWN};text-align:right;border-top:2px solid ${BRAND_GREEN};">${total}</td>
      </tr>
    </table>`;
}

function layoutHtml(body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>VETEA</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND_BG};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND_BG};">
    <tr>
      <td align="center" style="padding:24px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:16px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color:${BRAND_GREEN};padding:24px;text-align:center;">
              <h1 style="margin:0;font-size:28px;font-weight:700;color:#ffffff;letter-spacing:2px;">VETEA</h1>
              <p style="margin:4px 0 0;font-size:12px;color:rgba(255,255,255,0.85);letter-spacing:1px;">BUBBLE TEA</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:24px;">
              ${body}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:16px 24px;text-align:center;border-top:1px solid #E8DDD0;">
              <p style="margin:0;font-size:12px;color:#8C7B6B;">&copy; ${new Date().getFullYear()} VETEA. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function orderConfirmationHtml(order: Order): string {
  const pickup = formatEstimatedPickup(order.estimatedReadyAt);

  const body = `
    <h2 style="margin:0 0 4px;font-size:20px;color:${BRAND_BROWN};">Thanks for your order!</h2>
    <p style="margin:0 0 20px;font-size:14px;color:#8C7B6B;">
      Order <strong style="color:${BRAND_BROWN};">${escapeHtml(order.orderNumber)}</strong> has been confirmed.
    </p>

    <!-- Pickup time -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND_BG};border-radius:12px;margin-bottom:20px;">
      <tr>
        <td style="padding:16px;text-align:center;">
          <p style="margin:0 0 4px;font-size:12px;color:#8C7B6B;text-transform:uppercase;letter-spacing:1px;">Estimated Pickup</p>
          <p style="margin:0;font-size:20px;font-weight:700;color:${BRAND_GREEN};">${pickup}</p>
        </td>
      </tr>
    </table>

    <!-- Items -->
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr style="border-bottom:2px solid ${BRAND_GREEN};">
        <th style="padding:8px 0;text-align:left;font-size:12px;color:#8C7B6B;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid ${BRAND_GREEN};">Item</th>
        <th style="padding:8px 0;text-align:center;font-size:12px;color:#8C7B6B;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid ${BRAND_GREEN};">Qty</th>
        <th style="padding:8px 0;text-align:right;font-size:12px;color:#8C7B6B;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid ${BRAND_GREEN};">Price</th>
      </tr>
      ${itemRowsHtml(order)}
    </table>

    ${priceSummaryHtml(order)}

    <p style="margin:24px 0 0;font-size:13px;color:#8C7B6B;text-align:center;">
      We&rsquo;ll have your drinks ready for pickup. See you soon!
    </p>`;

  return layoutHtml(body);
}

export function newOrderNotificationHtml(order: Order): string {
  const body = `
    <h2 style="margin:0 0 4px;font-size:20px;color:${BRAND_BROWN};">New Order Received</h2>
    <p style="margin:0 0 20px;font-size:14px;color:#8C7B6B;">
      Order <strong style="color:${BRAND_BROWN};">${escapeHtml(order.orderNumber)}</strong>
    </p>

    <!-- Items -->
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <th style="padding:8px 0;text-align:left;font-size:12px;color:#8C7B6B;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid ${BRAND_GREEN};">Item</th>
        <th style="padding:8px 0;text-align:center;font-size:12px;color:#8C7B6B;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid ${BRAND_GREEN};">Qty</th>
        <th style="padding:8px 0;text-align:right;font-size:12px;color:#8C7B6B;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid ${BRAND_GREEN};">Price</th>
      </tr>
      ${itemRowsHtml(order)}
    </table>

    ${priceSummaryHtml(order)}`;

  return layoutHtml(body);
}
