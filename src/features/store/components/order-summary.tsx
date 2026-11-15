import type { ReactNode } from "react";

type OrderSummaryProps = {
  subtotal: number;
  delivery: number;
  total: number;
  children: ReactNode;
};

const rs = (amount: number) => `₹${amount}`;

export function OrderSummary({ subtotal, delivery, total, children }: OrderSummaryProps) {
  return (
    <div className="space-y-1 border-t p-4 text-sm">
      <div className="flex justify-between">
        <span>Subtotal</span>
        <span>{rs(subtotal)}</span>
      </div>
      <div className="flex justify-between">
        <span>Delivery</span>
        <span>{delivery ? rs(delivery) : "Free"}</span>
      </div>
      <div className="flex justify-between pb-3 text-lg font-bold">
        <span>Total</span>
        <span>{rs(total)}</span>
      </div>
      {children}
    </div>
  );
}
