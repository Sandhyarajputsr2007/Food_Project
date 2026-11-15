import { randomUUID } from "node:crypto";
import { Router } from "express";
import mongoose from "mongoose";

import { priceOrder } from "../../src/features/store/api/order-pricing";
import { OrderModel } from "../models/order";

export const orderRouter = Router();

orderRouter.post("/", async (request, response) => {
  const priced = priceOrder(request.body);
  if (!priced.success) {
    response.status(400).json({ success: false, error: priced.message });
    return;
  }

  if (mongoose.connection.readyState !== 1) {
    response.status(503).json({
      success: false,
      error: "Order storage is not connected. Please try again later.",
    });
    return;
  }

  const orderId = `CN${randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase()}`;
  const paymentStatus = priced.order.paymentMethod === "cod" ? "cod" : "pending";

  try {
    await OrderModel.create({
      orderId,
      ...priced.order,
      paymentStatus,
    });
  } catch (error) {
    console.error("Failed to save customer order.", error);
    response.status(500).json({
      success: false,
      error: "We couldn't save your order. Please try again.",
    });
    return;
  }

  response.status(201).json({ success: true, orderId, paymentStatus });
});
