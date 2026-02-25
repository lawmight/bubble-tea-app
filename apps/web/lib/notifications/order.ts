import type { Order } from '@vetea/shared';
import { formatMoney, toMoney } from '@vetea/shared';

import { getEmailFrom, getResend } from '@/lib/notifications/email';
import { env } from '@/lib/env';
import { log } from '@/lib/logger';
import {
  newOrderNotificationHtml,
  orderConfirmationHtml,
} from '@/lib/notifications/templates';

function formatOrderItems(order: Order): string {
  return order.items
    .map(
      (item) =>
        `${item.quantity}x ${item.name} (${item.size}, ${item.sugar}, ${item.ice}) - ${formatMoney(toMoney(item.unitPriceInCents))}`,
    )
    .join('\n');
}

function plainTextSummary(order: Order): string {
  return `Order: ${order.orderNumber}\n\n${formatOrderItems(order)}\n\nTotal: ${formatMoney(toMoney(order.totalPriceInCents))}`;
}

export async function notifyCustomer(order: Order, toEmail: string): Promise<void> {
  try {
    const resend = getResend();
    await resend.emails.send(
      {
        from: getEmailFrom(),
        to: [toEmail],
        subject: `Order confirmed ${order.orderNumber}`,
        html: orderConfirmationHtml(order),
        text: `Thanks for your order!\n\n${plainTextSummary(order)}`,
      },
      { idempotencyKey: `order-confirmation/${order.idempotencyKey}` },
    );
  } catch (error) {
    log('error', 'Failed to send customer confirmation email', {
      error,
      orderNumber: order.orderNumber,
    });
  }
}

export async function notifyStaff(order: Order): Promise<void> {
  if (!env.STAFF_EMAIL) {
    return;
  }

  try {
    const resend = getResend();
    await resend.emails.send(
      {
        from: getEmailFrom(),
        to: [env.STAFF_EMAIL],
        subject: `New order ${order.orderNumber}`,
        html: newOrderNotificationHtml(order),
        text: plainTextSummary(order),
      },
      { idempotencyKey: `staff-new-order/${order.idempotencyKey}` },
    );
  } catch (error) {
    log('error', 'Failed to send staff email', {
      error,
      orderNumber: order.orderNumber,
    });
  }
}
