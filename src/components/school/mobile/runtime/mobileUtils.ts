export type StatusTone = "blue" | "green" | "orange" | "slate";

export const currency = (amountCents: number, currencyCode = "SEK") =>
  new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(amountCents / 100);

export const formatDateTime = (value?: string | null) =>
  value
    ? new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(value))
    : "Not scheduled";
