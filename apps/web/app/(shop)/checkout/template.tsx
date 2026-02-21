import type { ReactNode } from 'react';

export default function CheckoutTemplate({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return <>{children}</>;
}
