type QuantityControlProps = {
  qty: number;
  onMinus: () => void;
  onPlus: () => void;
};

export function QuantityControl({ qty, onMinus, onPlus }: QuantityControlProps) {
  return (
    <div className="flex items-center gap-2">
      <button onClick={onMinus} className="h-8 w-8 rounded-full border bg-background font-bold">
        −
      </button>
      <span className="w-5 text-center font-bold">{qty}</span>
      <button
        onClick={onPlus}
        className="h-8 w-8 rounded-full bg-primary font-bold text-primary-foreground"
      >
        +
      </button>
    </div>
  );
}
