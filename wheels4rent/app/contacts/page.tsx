import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ContactsPage from '@/components/sections/ContactsPage';

export const metadata: Metadata = {
  title: 'Контакты — Wheels4Rent',
  description: 'Адрес офиса, телефон, мессенджеры и режим работы сервиса аренды премиальных автомобилей Wheels4Rent в Москве.',
};

export default function Contacts() {
  return (
    <>
      <Header />
      <main className="min-h-[100dvh] pt-20 bg-zinc-950">
        <ContactsPage />
      </main>
      <Footer />
    </>
  );
}
