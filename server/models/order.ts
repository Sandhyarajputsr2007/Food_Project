import { model, Schema } from "mongoose";

const orderItemSchema = new Schema(
  {
    itemId: { type: String, required: true },
    name: { type: String, required: true },
    size: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1, max: 99 },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    orderId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    phone: { type: String, required: true, match: /^[0-9]{10}$/ },
    address: { type: String, required: true, trim: true, maxlength: 500 },
    paymentMethod: { type: String, required: true, enum: ["upi", "cod"] },
    paymentStatus: { type: String, required: true, enum: ["pending", "cod"] },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: [(items: unknown[]) => items.length > 0, "An order must contain an item."],
    },
    subtotal: { type: Number, required: true, min: 0 },
    deliveryFee: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
  },
  { timestamps: true, versionKey: false },
);

export const OrderModel = model("Order", orderSchema);
