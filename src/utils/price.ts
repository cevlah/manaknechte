import { BUDGET } from "../config";

export function getPriceStatus(price: number) {
  const threshold = BUDGET * 0.95;

  if (price < threshold) {
    return "low"; // grün
  }

  if (price <= BUDGET) {
    return "mid"; // gelb
  }

  return "high"; // rot
}