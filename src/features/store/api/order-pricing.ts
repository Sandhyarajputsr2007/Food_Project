import { z } from "zod";

import { DELIVERY_FEE, FREE_DELIVERY_ABOVE, MENU } from "../data/menu";

const orderSubmissionSchema = z
  .object({
    name: z.string().trim().min(1).max(100),
    phone: z.string().regex(/^[0-9]{10}$/),
    address: z.string().trim().min(5).max(500),
    paymentMethod: z.enum(["upi", "cod"]),
    items: z
      .array(
        z
          .object({
            itemId: z.string().min(1),
            size: z.string().min(1),
            quantity: z.number().int().min(1).max(99),
          })
          .strict(),
      )
      .min(1)
      .max(100),
  })
  .strict();

export type PricedOrder = {
  name: string;
  phone: string;
  address: string;
  paymentMethod: "upi" | "cod";
  items: {
    itemId: string;
    name: string;
    size: string;
    price: number;
    quantity: number;
  }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
};

export function priceOrder(
  input: unknown,
): { success: true; order: PricedOrder } | { success: false; message: string } {
  const parsed = orderSubmissionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Please check your contact details and order items." };
  }

  const items: PricedOrder["items"] = [];
  for (const selection of parsed.data.items) {
    const item = MENU.flatMap((category) => category.items).find(
      (menuItem) => menuItem.id === selection.itemId,
    );
    const size = item?.sizes.find((menuSize) => menuSize.label === selection.size);
    if (!item || !size) {
      return {
        success: false,
        message: "One or more selected menu items are no longer available.",
      };
    }

    items.push({
      itemId: item.id,
      name: item.name,
      size: size.label,
      price: size.price,
      quantity: selection.quantity,
    });
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal === 0 || subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;

  return {
    success: true,
    order: {
      name: parsed.data.name,
      phone: parsed.data.phone,
      address: parsed.data.address,
      paymentMethod: parsed.data.paymentMethod,
      items,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
    },
  };
}
