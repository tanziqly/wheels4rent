import type { Metadata } from 'next';
// import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CarPageClient from '@/components/car/CarPageClient';
import { cars, getCarBySlug, getSimilarCars } from '@/lib/data';

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  return cars.map((car) => ({ slug: car.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const car = getCarBySlug(params.slug);
  if (!car) return {};
  return {
    title: `${car.name} — аренда в Москве ${car.priceFrom}/сут | Wheels4Rent`,
    description: `Арендуйте ${car.name} в Москве. ${car.engine}, ${car.power}, ${car.drive} привод. Доставка по МКАД. ${car.priceFrom} в сутки.`,
  };
}

export default function CarPage({ params }: Props) {
  const car = getCarBySlug(params.slug) ?? null;
  const similar = car ? getSimilarCars(car) : [];

  return (
    <>
      <Header />
      <main className="min-h-[100dvh] pt-20 bg-zinc-950">
        <CarPageClient slug={params.slug} car={car} similar={similar} />
      </main>
      <Footer />
    </>
  );
}
