import type { Item } from "../data/menu";
import type { CartChange, CartLine } from "../types";
import { QuantityControl } from "./quantity-control";

type ProductCardProps = {
  item: Item;
  cart: Record<string, CartLine>;
  change: CartChange;
};

const rs = (amount: number) => `₹${amount}`;

export function ProductCard({ item, cart, change }: ProductCardProps) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm">
      <h4 className="text-lg font-bold">{item.name}</h4>
      {item.desc && <p className="text-sm text-muted-foreground">{item.desc}</p>}
      <div className="mt-3 space-y-2">
        {item.sizes.map((size) => {
          const key = `${item.id}-${size.label}`;
          const qty = cart[key]?.qty ?? 0;
          return (
            <div
              key={key}
              className="flex items-center justify-between rounded-lg bg-secondary px-3 py-2"
            >
              <div>
                <p className="text-sm">{size.label}</p>
                <p className="font-bold text-primary">{rs(size.price)}</p>
              </div>
              {qty === 0 ? (
                <button
                  onClick={() =>
                    change(key, 1, {
                      itemId: item.id,
                      name: item.name,
                      size: size.label,
                      price: size.price,
                    })
                  }
                  className="rounded-full bg-primary px-4 py-1 text-sm font-semibold text-primary-foreground"
                >
                  + Add
                </button>
              ) : (
                <QuantityControl
                  qty={qty}
                  onMinus={() => change(key, -1)}
                  onPlus={() => change(key, 1)}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
