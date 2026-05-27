export type Car = {
  id: number;
  slug: string;
  seed: string;
  name: string;
  category: string;
  categorySlug: string;
  engine: string;
  seats: number;
  power: string;
  transmission: string;
  drive: string;
  priceFrom: string;
  priceNum: number;
  description: string;
  features: string[];
  extraSeeds: string[];
  // Загруженные фото (для admin-машин из БД); если пусто — используем seed
  images?: string[];
};

export const cars: Car[] = [
  {
    id: 1, slug: 'gt-coupe-serie-x', seed: 'sport-red-car',
    name: 'GT Coupé Série X', category: 'Новые поступления', categorySlug: 'new',
    engine: '3.0 л', seats: 4, power: '510 л.с.', transmission: 'АКПП', drive: 'Задний',
    priceFrom: 'от 27 000 ₽', priceNum: 27000,
    description: 'Мощный спортивный купе с атмосферным характером — для тех, кто ценит динамику и точность управления. Настроен на максимум.',
    features: ['Панорамный люк', 'Система доводчиков дверей', 'Адаптивная подвеска', 'Вентиляция сидений'],
    extraSeeds: ['sport-interior-1', 'sport-road-1', 'sport-detail-1'],
  },
  {
    id: 2, slug: 'executive-longbase-s', seed: 'silver-luxury',
    name: 'Executive Longbase S', category: 'Новые поступления', categorySlug: 'new',
    engine: '3.5 л', seats: 5, power: '435 л.с.', transmission: 'АКПП', drive: 'Полный',
    priceFrom: 'от 26 000 ₽', priceNum: 26000,
    description: 'Представительский седан с удлинённой базой. Задний ряд оснащён по высшему разряду — для деловых поездок и особых случаев.',
    features: ['Массаж задних кресел', 'Холодильник в подлокотнике', 'Шторки приватности', '4-зонный климат'],
    extraSeeds: ['luxury-interior-2', 'luxury-road-2', 'luxury-detail-2'],
  },
  {
    id: 3, slug: 'terrain-master-7', seed: 'black-suv-city',
    name: 'Terrain Master 7', category: 'Новые поступления', categorySlug: 'new',
    engine: '3.0 л', seats: 7, power: '380 л.с.', transmission: 'АКПП', drive: 'Полный',
    priceFrom: 'от 18 000 ₽', priceNum: 18000,
    description: 'Флагманский внедорожник на 7 мест. Одинаково уверен в городских пробках и на загородном шоссе.',
    features: ['3 ряда сидений', 'Пневмоподвеска', 'Камеры 360°', 'Трейлерный пакет'],
    extraSeeds: ['suv-interior-3', 'suv-road-3', 'suv-offroad-3'],
  },
  {
    id: 4, slug: 'prestige-sedan-500', seed: 'white-sedan-road',
    name: 'Prestige Sedan 500', category: 'Новые поступления', categorySlug: 'new',
    engine: '2.0 л', seats: 5, power: '245 л.с.', transmission: 'АКПП', drive: 'Полный',
    priceFrom: 'от 7 000 ₽', priceNum: 7000,
    description: 'Доступный вход в мир премиальной аренды. Оснащён по бизнес-уровню с полным приводом.',
    features: ['Кожаный салон', 'Навигация', 'Подогрев всех мест', 'Парктроник'],
    extraSeeds: ['sedan-interior-4', 'sedan-road-4', 'sedan-detail-4'],
  },
  {
    id: 5, slug: 'regalia-long-l8', seed: 'black-luxury-sedan',
    name: 'Regalia Long L8', category: 'Седаны', categorySlug: 'sedans',
    engine: '3.5 л', seats: 5, power: '435 л.с.', transmission: 'АКПП', drive: 'Полный',
    priceFrom: 'от 26 000 ₽', priceNum: 26000,
    description: 'Топовый длиннобазный седан класса S. Представительность без компромиссов.',
    features: ['Задний бизнес-пакет', 'Bowers & Wilkins аудио', 'Ночное видение', 'Проекция HUD'],
    extraSeeds: ['luxury-sedan-int-5', 'luxury-sedan-road-5', 'luxury-sedan-det-5'],
  },
  {
    id: 6, slug: 'business-class-500d', seed: 'grey-business-car',
    name: 'Business Class 500d', category: 'Седаны', categorySlug: 'sedans',
    engine: '2.0 л', seats: 5, power: '245 л.с.', transmission: 'АКПП', drive: 'Полный',
    priceFrom: 'от 7 000 ₽', priceNum: 7000,
    description: 'Оптимальный выбор для ежедневных деловых поездок. Экономичный и практичный.',
    features: ['Беспроводная зарядка', 'Дистанционный прогрев', 'Камера 360°', 'Ассистент полосы'],
    extraSeeds: ['business-int-6', 'business-road-6', 'business-det-6'],
  },
  {
    id: 7, slug: 'sport-line-730i', seed: 'dark-sedan-city',
    name: 'Sport Line 730i', category: 'Седаны', categorySlug: 'sedans',
    engine: '3.0 л', seats: 5, power: '320 л.с.', transmission: 'АКПП', drive: 'Задний',
    priceFrom: 'от 14 000 ₽', priceNum: 14000,
    description: 'Лёгкий и динамичный бизнес-седан в спортивном исполнении. Задний привод, характер.',
    features: ['Sport пакет', 'M-руль', 'Активный круиз', 'Адаптивные фары'],
    extraSeeds: ['sport-sedan-int-7', 'sport-sedan-road-7', 'sport-sedan-det-7'],
  },
  {
    id: 8, slug: 'titan-x7-xdrive', seed: 'big-black-suv',
    name: 'Titan X7 xDrive', category: 'Внедорожники', categorySlug: 'suv',
    engine: '3.0 л', seats: 7, power: '400 л.с.', transmission: 'АКПП', drive: 'Полный',
    priceFrom: 'от 18 000 ₽', priceNum: 18000,
    description: 'Крупный премиальный SUV с мощным дизелем и трёхрядным салоном. Для большой компании.',
    features: ['3 ряда кресел', 'Панорамная крыша', 'Харман Кардон аудио', 'Air suspension'],
    extraSeeds: ['titan-int-8', 'titan-road-8', 'titan-offroad-8'],
  },
  {
    id: 9, slug: 'alpine-crest-gle', seed: 'grey-suv-mountains',
    name: 'Alpine Crest GLE', category: 'Внедорожники', categorySlug: 'suv',
    engine: '3.0 л', seats: 5, power: '367 л.с.', transmission: 'АКПП', drive: 'Полный',
    priceFrom: 'от 14 500 ₽', priceNum: 14500,
    description: 'Сочетание роскоши и внедорожных способностей. Пневматическая подвеска и полный привод.',
    features: ['Пневмоподвеска', 'Диагональная функция', 'Burmester аудио', 'Подогрев руля'],
    extraSeeds: ['gle-int-9', 'gle-road-9', 'gle-off-9'],
  },
  {
    id: 10, slug: 'compact-sport-macan', seed: 'white-suv-premium',
    name: 'Compact Sport Macan', category: 'Внедорожники', categorySlug: 'suv',
    engine: '2.9 л', seats: 5, power: '380 л.с.', transmission: 'АКПП', drive: 'Полный',
    priceFrom: 'от 11 000 ₽', priceNum: 11000,
    description: 'Компактный спортивный SUV с характером настоящего спорткара. Цепкий и управляемый.',
    features: ['Sport Chrono пакет', 'PASM подвеска', 'PCM навигация', 'Спортивные сиденья'],
    extraSeeds: ['macan-int-10', 'macan-road-10', 'macan-det-10'],
  },
  {
    id: 11, slug: 'gt-racing-coupe', seed: 'red-sport-car',
    name: 'GT Racing Coupé', category: 'Спорткары', categorySlug: 'sport',
    engine: '3.0 л', seats: 2, power: '510 л.с.', transmission: 'АКПП', drive: 'Задний',
    priceFrom: 'от 27 000 ₽', priceNum: 27000,
    description: 'Трековый характер в дорожной оболочке. Адаптивная подвеска М, дифференциал, карбоновая крыша.',
    features: ['M Carbon крыша', 'Adaptive M Suspension', 'M Drivelogic', 'Harman Kardon'],
    extraSeeds: ['gt-int-11', 'gt-road-11', 'gt-track-11'],
  },
  {
    id: 12, slug: 'sport-roadster-718', seed: 'yellow-sport-coupe',
    name: 'Sport Roadster 718', category: 'Спорткары', categorySlug: 'sport',
    engine: '2.5 л', seats: 2, power: '350 л.с.', transmission: 'АКПП', drive: 'Задний',
    priceFrom: 'от 18 000 ₽', priceNum: 18000,
    description: 'Среднемоторный спорткар с идеальным балансом. Точный, сбалансированный, азартный.',
    features: ['Среднемоторная компоновка', 'Sport Chrono', 'PASM', 'Bucket seats'],
    extraSeeds: ['718-int-12', '718-road-12', '718-det-12'],
  },
  {
    id: 13, slug: 'americana-challenger', seed: 'blue-muscle-car',
    name: 'Americana Challenger', category: 'Спорткары', categorySlug: 'sport',
    engine: '5.7 л', seats: 4, power: '375 л.с.', transmission: 'АКПП', drive: 'Задний',
    priceFrom: 'от 18 000 ₽', priceNum: 18000,
    description: 'Американский масл-кар с V8 и задним приводом. Незабываемый звук и харизма.',
    features: ['V8 Hemi', 'Laramie пакет', 'Alpine аудио', 'Heated/ventilated seats'],
    extraSeeds: ['challenger-int-13', 'challenger-road-13', 'challenger-det-13'],
  },
  {
    id: 14, slug: 'business-van-v320', seed: 'luxury-van-grey',
    name: 'Business Van V320', category: 'Минивэны', categorySlug: 'minivan',
    engine: '2.0 л', seats: 8, power: '239 л.с.', transmission: 'АКПП', drive: 'Полный',
    priceFrom: 'от 14 000 ₽', priceNum: 14000,
    description: 'Роскошный бизнес-ван на 8 мест с VIP-трансформацией салона. Идеален для групповых трансферов.',
    features: ['VIP-салон', 'Столик и розетки', 'Раздельный климат', 'Шторы на стёклах'],
    extraSeeds: ['van-int-14', 'van-road-14', 'van-det-14'],
  },
  {
    id: 15, slug: 'electra-model-s3', seed: 'tesla-white-electric',
    name: 'Electra Model S3', category: 'Электрокары', categorySlug: 'electric',
    engine: 'Электро', seats: 5, power: '283 кВт', transmission: 'Автомат', drive: 'Полный',
    priceFrom: 'от 9 000 ₽', priceNum: 9000,
    description: 'Электрический седан с запасом хода 500+ км. Быстрая зарядка, автопилот, минималистичный интерьер.',
    features: ['Autopilot', '500+ км запас хода', 'Over-the-air обновления', '15" сенсорный экран'],
    extraSeeds: ['ev-int-15', 'ev-road-15', 'ev-det-15'],
  },
  {
    id: 16, slug: 'cabrio-open-sport', seed: 'convertible-blue',
    name: 'Cabrió Open Sport', category: 'Кабриолеты', categorySlug: 'cabrio',
    engine: '2.3 л', seats: 4, power: '310 л.с.', transmission: 'АКПП', drive: 'Задний',
    priceFrom: 'от 13 000 ₽', priceNum: 13000,
    description: 'Мягкий верх, задний привод и форсированный турбомотор — квинтэссенция кабриолетного удовольствия.',
    features: ['Мягкая складная крыша', 'Дефлектор ветра', 'Active exhaust', 'Sport пакет'],
    extraSeeds: ['cabrio-int-16', 'cabrio-road-16', 'cabrio-open-16'],
  },
];

export const categories = [
  { label: 'Все', slug: 'all' },
  { label: 'Новые поступления', slug: 'new' },
  { label: 'Седаны', slug: 'sedans' },
  { label: 'Внедорожники', slug: 'suv' },
  { label: 'Спорткары', slug: 'sport' },
  { label: 'Минивэны', slug: 'minivan' },
  { label: 'Электрокары', slug: 'electric' },
  { label: 'Кабриолеты', slug: 'cabrio' },
];

export function getCarBySlug(slug: string): Car | undefined {
  return cars.find((c) => c.slug === slug);
}

export function getCarsByCategory(slug: string): Car[] {
  if (slug === 'all') return cars;
  return cars.filter((c) => c.categorySlug === slug);
}

export function getSimilarCars(car: Car, limit = 3): Car[] {
  return cars
    .filter((c) => c.categorySlug === car.categorySlug && c.id !== car.id)
    .slice(0, limit);
}
