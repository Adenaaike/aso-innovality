"use client";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { site } from "@/lib/site";

export function WhatsAppButton() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <a href={`${site.whatsapp}?text=${encodeURIComponent("Hi ASO, I’d like to discuss a project.")}`}
      target="_blank" rel="noopener noreferrer" aria-label="Chat with ASO on WhatsApp"
      className="fixed right-5 bottom-20 z-40 grid size-14 place-items-center rounded-full bg-royal text-white shadow-[0_12px_30px_-8px_#1177FF] transition hover:scale-105 hover:bg-bright focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-royal">
      <MessageCircle size={24} />
    </a>
  );
}