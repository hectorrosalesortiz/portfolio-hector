import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatWhatsappLink(phone: string) {
  return `https://wa.me/${phone.replace(/\D/g, "")}`;
}
