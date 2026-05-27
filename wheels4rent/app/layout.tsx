import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wheels4Rent — Аренда премиальных автомобилей в Москве",
  description:
    "Сервис аренды премиальных автомобилей в Москве. Бесплатная доставка в пределах МКАД от 5 суток аренды. Прогрессивная система скидок.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={outfit.variable}>
      <body className={`${outfit.className} antialiased`}>
        <div className="noise-overlay" aria-hidden="true" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
