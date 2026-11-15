import { z } from "zod";

const orderResultSchema = z.discriminatedUnion("success", [
  z.object({
    success: z.literal(true),
    orderId: z.string(),
    paymentStatus: z.enum(["pending", "cod"]),
  }),
  z.object({
    success: z.literal(false),
    error: z.string(),
  }),
]);

export async function submitOrder({ data }: { data: unknown }) {
  const response = await fetch("/api/orders", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  });
  const payload: unknown = await response.json();
  const result = orderResultSchema.safeParse(payload);

  if (!result.success) {
    throw new Error("The order server returned an invalid response.");
  }

  return result.data;
}
