import type { Order } from '@vetea/shared';
import { formatMoney, toMoney } from '@vetea/shared';

import { getResend } from '@/lib/notifications/email';
import { env } from '@/lib/env';
import { log } from '@/lib/logger';

function formatOrderItems(order: Order): string {
  return order.items
    .map(
      (item) =>
        `${item.quantity}x ${item.name} (${item.size}, ${item.sugar}, ${item.ice}) - ${formatMoney(toMoney(item.unitPriceInCents))}`,
    )
    .join('\n');
}

export async function notifyCustomer(order: Order, toEmail: string): Promise<void> {
  try {
    const resend = getResend();
    await resend.emails.send({
      from: 'VETEA <orders@vetea.local>',
      to: [toEmail],
      subject: `Order confirmed ${order.orderNumber}`,
      text: `Thanks for your order!\n\nOrder: ${order.orderNumber}\n\n${formatOrderItems(order)}\n\nTotal: ${formatMoney(toMoney(order.totalPriceInCents))}`,
    });
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
    await resend.emails.send({
      from: 'VETEA <orders@vetea.local>',
      to: [env.STAFF_EMAIL],
      subject: `New order ${order.orderNumber}`,
      text: `${order.orderNumber}\n\n${formatOrderItems(order)}\n\nTotal: ${formatMoney(toMoney(order.totalPriceInCents))}`,
    });
  } catch (error) {
    log('error', 'Failed to send staff email', {
      error,
      orderNumber: order.orderNumber,
    });
  }
}
