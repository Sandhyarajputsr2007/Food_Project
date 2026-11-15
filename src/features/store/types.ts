export type CartLine = {
  key: string;
  itemId: string;
  name: string;
  size: string;
  price: number;
  qty: number;
};

export type CartChange = (key: string, delta: number, line?: Omit<CartLine, "qty" | "key">) => void;
