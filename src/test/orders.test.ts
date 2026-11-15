import { describe, expect, it } from "vitest";

import { DELIVERY_FEE } from "@/features/store/data/menu";
import { priceOrder } from "@/features/store/api/order-pricing";

describe("priceOrder", () => {
  it("calculates totals from menu prices instead of client-supplied prices", () => {
    const result = priceOrder({
      name: "A Customer",
      phone: "9876543210",
      address: "12 Market Road",
      paymentMethod: "cod",
      items: [{ itemId: "samosa", size: "1 piece", quantity: 2 }],
    });

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.order.subtotal).toBe(30);
    expect(result.order.deliveryFee).toBe(DELIVERY_FEE);
    expect(result.order.total).toBe(30 + DELIVERY_FEE);
  });

  it("rejects unknown menu options and altered item prices", () => {
    const unknownSize = priceOrder({
      name: "A Customer",
      phone: "9876543210",
      address: "12 Market Road",
      paymentMethod: "cod",
      items: [{ itemId: "samosa", size: "unlimited", quantity: 1 }],
    });
    const alteredPrice = priceOrder({
      name: "A Customer",
      phone: "9876543210",
      address: "12 Market Road",
      paymentMethod: "cod",
      items: [{ itemId: "samosa", size: "1 piece", quantity: 1, price: 1 }],
    });

    expect(unknownSize.success).toBe(false);
    expect(alteredPrice.success).toBe(false);
  });

  it("does not accept card payments before a payment provider is configured", () => {
    const result = priceOrder({
      name: "A Customer",
      phone: "9876543210",
      address: "12 Market Road",
      paymentMethod: "card",
      items: [{ itemId: "samosa", size: "1 piece", quantity: 1 }],
    });

    expect(result.success).toBe(false);
  });
});
