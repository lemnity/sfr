/**
 * All page copy lives here in two dictionaries with the same shape: `ru` and `en`.
 * Shared, non-translatable data (contacts, URLs, images, numbers) is defined once below
 * and reused by both dictionaries. Components read the current dictionary via `useLang().t`.
 */
import { BASE } from '../utils/base'

export type Lang = 'ru' | 'en' | 'tg'
export const LANGS: readonly Lang[] = ['ru', 'en', 'tg']

export const contacts = {
  email: 'safarovshow@yandex.ru',
  telegram: 'https://t.me/safarovdmitry',
}

const mailto = `mailto:${contacts.email}`

/** Rectangle in source-image pixels. */
export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

export interface ProjectImage {
  src: string
  /** Natural size of the file (for width/height attributes and crop math). */
  width: number
  height: number
  /** Visible part of the image. The concept images are cut from the reference, so they are cropped to drop baked-in text/borders. Use the full image rect for clean images. */
  crop: Rect
  /** Focal point (0–1) used when the crop has to be cut further to cover the slot. */
  focus: [number, number]
}

export interface Project {
  id: string
  number: string
  title: string
  description: string
  /** Rendered with a `#` prefix. */
  tags: string[]
  image: ProjectImage
  /** External site; omit while the project has no public link (the card shows no arrow). */
  url?: string
  /**
   * Original logo. A wordmark replaces the typed title; `mark: true` (a symbol without
   * lettering) is shown in its own colours next to the title instead.
   */
  logo?: { src: string; width: number; height: number; mark?: boolean }
  /** Still being polished (Lemnity games): shows an "in development" pill instead of "soon". */
  inDevelopment?: boolean
  /** A Lemnity game: shown as a card next to Lemnity in the first row of projects. */
  game?: boolean
}

export type FeedbackTopicId = 'website' | 'brand' | 'product' | 'other'
export interface FeedbackTopic {
  id: FeedbackTopicId
  label: string
}

export type Stat =
  | { kind: 'number'; value: number; suffix: string; label: string }
  | { kind: 'infinity'; label: string }

/** Language-independent project data (merged with translated title/description/tags). */
const projectBase = {
  tumtipb: {
    id: 'tumtipb',
    number: '02',
    title: 'Дом науки и техники',
    logo: { src: `${BASE}assets/dom-nauki-mark.webp`, width: 128, height: 160, mark: true },
    image: { src: `${BASE}assets/dom-nauki-site.webp`, width: 1200, height: 750, crop: { x: 0, y: 0, w: 1200, h: 750 }, focus: [0.72, 0.4] },
    url: 'https://web.tumtipb.ru/',
  },
  prostyle: {
    id: 'prostyle',
    number: '03',
    title: 'ProStyle',
    logo: { src: `${BASE}clients/prostyle.svg`, width: 340, height: 92 },
    image: { src: `${BASE}assets/prostyle-site.webp`, width: 1200, height: 750, crop: { x: 0, y: 0, w: 1200, h: 750 }, focus: [0.6, 0.45] },
    url: 'https://prostyle.agency/',
  },
  sphagnum: {
    id: 'sphagnum',
    number: '04',
    title: 'Sphagnum AE',
    image: { src: `${BASE}assets/sphagnum-concept.webp`, width: 1200, height: 750, crop: { x: 0, y: 0, w: 1200, h: 750 }, focus: [0.9, 0.45] },
    url: 'https://lemnity.github.io/sphgnm/',
  },
  turdus: {
    id: 'turdus',
    number: '05',
    title: 'TURDUS',
    image: { src: `${BASE}assets/turdus-site.webp`, width: 1200, height: 750, crop: { x: 0, y: 0, w: 1200, h: 750 }, focus: [0.3, 0.4] },
    url: 'https://lemnity.github.io/trds/',
  },
} satisfies Record<string, Omit<Project, 'description' | 'tags'>>

/** Language-independent hero data. */
const heroBase = {
  signature: 'Safaroff',
}

const footerLinks = [
  { label: 'TELEGRAM', href: contacts.telegram },
  // Opens the feedback form modal instead of following the mailto link.
  { label: 'EMAIL', href: mailto, feedback: true },
]

const drawerContacts = [
  { key: 'telegram', label: 'Telegram', href: contacts.telegram, external: true },
  // Opens the feedback form modal (see src/components/feedback).
  { key: 'email', label: contacts.email, href: mailto, external: false, feedback: true },
]

/* ------------------------------------------------------------------ RU */

const ru = {
  /** <title>, meta description and Open Graph (applied at runtime on language change). */
  meta: {
    title: 'SAFAROFF — digital-агентство: сайты, UI/UX, брендинг',
    description:
      'SAFAROFF — digital-агентство полного цикла: сайты, веб-приложения, интерфейсы, бренды и игры. 12+ лет опыта, 50+ проектов. Работаем с клиентами по всему миру.',
    ogDescription: 'Создаём цифровые продукты, бренды и пользовательские опыты, которые помогают людям и бизнесу расти.',
    ogLocale: 'ru_RU',
    ogImageAlt: 'SAFAROFF — digital-агентство',
  },
  langSwitch: {
    /** Accessible name of the language menu button (same in every language on purpose). */
    label: 'Язык / Language',
    names: { ru: 'Русский', en: 'English', tg: 'Тоҷикӣ' } as Record<Lang, string>,
  },
  nav: [
    { label: 'ПРОЕКТЫ', href: '#work' },
    { label: 'РАБОТЫ', href: '#gallery' },
    { label: 'УСЛУГИ', href: '#services' },
    { label: 'О НАС', href: '#about' },
    { label: 'КОНТАКТЫ', href: '#contact' },
  ],
  loader: {
    label: 'Загрузка сайта SAFAROFF',
  },
  header: {
    wordmark: 'SAFAROFF',
    tagline: ['СОЗДАВАТЬ', 'БОЛЬШЕ, ЧЕМ ОЖИДАЮТ'],
    homeLabel: 'SAFAROFF — наверх',
    drawer: {
      openLabel: 'Открыть меню',
      closeLabel: 'Закрыть меню',
      contactsLabel: 'Контакты',
      languageLabel: 'Язык',
      contacts: drawerContacts,
    },
  },
  hero: {
    ...heroBase,
    side: { top: ['ИДЕИ', 'ПРОДУКТЫ', 'ЛЮДИ'], est: 'С', year: '2008' },
    signatureLabel: 'DIGITAL-АГЕНТСТВО',
    places: ['ЕКАТЕРИНБУРГ', 'РОССИЯ', 'ВЕСЬ МИР'],
    eyebrow: 'АГЕНТСТВО ПОЛНОГО ЦИКЛА · ДИЗАЙН · РАЗРАБОТКА · ПРОДУКТЫ',
    /** Three heading lines; the last one is accented. */
    lines: ['Делаем', 'сложное', 'простым.'],
    text: 'Создаём цифровые продукты, бренды и пользовательские опыты, которые помогают людям и бизнесу расти.',
    cta: 'Смотреть работы',
    write: 'Написать нам',
    visualAlt: 'Объёмный 3D-динозавр SAFAROFF, поворачивается за курсором',
  },
  /** Big "who we are" text after the first screen (as on the studio site); [brackets] are accented. */
  manifesto:
    'SAFAROFF — [агентство полного цикла]. Мы соединяем дизайн и технологии, чтобы создавать сайты, игры и [цифровые продукты]. От идеи до [UX], [UI], [кода] и запуска. За нами — [12+ лет опыта] и [50+ проектов]. Дизайнеры, которые думают как инженеры. Инженеры, которые проектируют с чувством. Мы превращаем [сложное] в [простое], которое работает.',
  projects: {
    title: 'Избранные проекты',
    text: 'Продукты, бренды и цифровые решения, которые делают идеи реальностью.',
    openLabel: 'Открыть проект',
    flagshipLabel: 'Главный проект',
    /** Shown instead of the arrow on projects without a public link yet. */
    soonLabel: 'Скоро',
    inDevLabel: 'В доработке',
    caseLabel: 'Кейс',
    gameLabel: 'Игра',
    items: [
      {
        ...projectBase.tumtipb,
        description: 'Образовательная платформа для профессионалов',
        tags: ['Образование', 'Сайт', 'Гос. сектор'],
      },
      {
        ...projectBase.prostyle,
        description: 'Сувенирная продукция и корпоративные подарки',
        tags: ['Бренд', 'Интернет-магазин', 'Дизайн'],
      },
      {
        ...projectBase.sphagnum,
        description: 'Живые субстраты для зелёных крыш, вертикальных садов и интерьеров',
        tags: ['Сайт', 'Эко', 'B2B'],
      },
      {
        ...projectBase.turdus,
        title: 'Модный театр TURDUS',
        description: 'Иммерсивные спектакли в барах, ресторанах, квартире и на улицах Екатеринбурга',
        tags: ['Сайт', 'Афиша', 'Театр'],
      },
    ] as Project[],
  },
  gallery: {
    title: 'Галерея работ',
    text: 'Брендинг, интерфейсы, сайты и мерч — подборка работ разных лет.',
    /** Accessible name for a tile: `${openLabel}: ${alt}`. */
    openLabel: 'Открыть работу',
    dialogLabel: 'Просмотр работы',
    closeLabel: 'Закрыть просмотр',
    prevLabel: 'Предыдущая работа',
    nextLabel: 'Следующая работа',
  },
  clients: {
    title: 'Нам доверяют',
    text: 'Компании и команды, с которыми мы запускали бренды, сайты и продукты.',
    listLabel: 'Клиенты',
  },
  services: {
    title: 'Чем мы занимаемся',
    text: 'Сайты, интерфейсы, бренды, цифровые продукты и игры — от идеи до запуска.',
    deliverablesLabel: 'Что входит',
    game: {
      aria: 'Мини-игра «Лопай соты»: нажимайте на группы сот одного цвета',
      hint: '👆 Нажмите на соты',
      praise: ['Супер!', 'Вау!', 'Отлично!', 'Комбо!'] as readonly string[],
    },
    items: [
      {
        title: 'Разработка сайтов и веб-приложений',
        text: 'Делаем сайты и веб-приложения, которые быстро загружаются и понятны с первого экрана. Дизайн и код ведёт одна команда, поэтому между макетом и готовым сайтом ничего не теряется. Подходит компаниям, сервисам и образовательным платформам — например, «Дому науки и техники».',
        deliverables: ['корпоративный сайт или сервис', 'адаптивная вёрстка для телефона и компьютера', 'личные кабинеты и формы'],
      },
      {
        title: 'UI/UX-дизайн интерфейсов',
        text: 'Проектируем интерфейсы, в которых человек не думает, куда нажать. Начинаем со сценариев и структуры, потом рисуем макеты и прототип. Результат отдаём в виде, с которым удобно работать разработчикам.',
        deliverables: ['структура и пользовательские сценарии', 'прототип', 'макеты экранов', 'дизайн-система и UI-кит', 'передача макетов в разработку'],
      },
      {
        title: 'Лендинги и интернет-магазины',
        text: 'Делаем страницы, которые ведут посетителя к одному действию, и магазины, где удобно выбирать и покупать. Работаем над структурой текста, визуалом и скоростью. Пример из практики: каталог ProStyle на ~60 000 корпоративных подарков с остатками со складов.',
        deliverables: ['лендинг или многостраничный сайт', 'интернет-магазин с каталогом и корзиной', 'форма заявки', 'адаптивная версия'],
      },
      {
        title: 'Брендинг и айдентика',
        text: 'Помогаем бренду выглядеть цельно: от логотипа до сайта и мерча. Сначала формулируем, чем вы отличаетесь, потом превращаем это в визуальный язык и собираем правила, которыми удобно пользоваться команде.',
        deliverables: ['логотип и знак', 'цвета, шрифты, стиль', 'фирменные носители и мерч', 'гайд по использованию', 'оформление сайта в стиле бренда'],
      },
      {
        title: 'Цифровой продукт и MVP',
        text: 'Помогаем превратить идею в работающий продукт: от гипотезы и прототипа до первой версии. Знаем, что на старте важно, а что можно отложить.',
        deliverables: ['уточнение идеи и состава первой версии', 'кликабельный прототип', 'дизайн и разработка MVP', 'план развития продукта', 'запуск и первые доработки'],
      },
      {
        title: 'Разработка игр',
        text: 'Делаем казуальные и мини-игры для браузера, Telegram и промо-акций, а также коммерческие игры под задачи бизнеса. Придумываем игровой цикл, рисуем графику и доводим до релиза. Попробуйте: игра в карточке живая.',
        deliverables: ['казуальные игры для браузера и телефона', 'мини-игры для Telegram, сайтов и акций', 'коммерческие игры с монетизацией', 'геймдизайн, графика и анимация', 'релиз и поддержка'],
        game: true,
      },
    ],
    process: {
      title: 'Как мы работаем',
      steps: [
        { title: 'Знакомство и задача', text: 'Вы рассказываете о задаче, аудитории и сроках. Мы задаём вопросы и честно говорим, что реально, а что лучше убрать.' },
        { title: 'Структура и концепция', text: 'Собираем структуру, сценарии и первую концепцию. Согласуем направление до того, как появится детальная работа.' },
        { title: 'Дизайн и прототип', text: 'Рисуем макеты и кликабельный прототип. Вы видите, как продукт будет работать, и вносите правки на раннем этапе.' },
        { title: 'Разработка', text: 'Верстаем и программируем. Промежуточные версии показываем по ходу, а не в конце.' },
        { title: 'Запуск и поддержка', text: 'Проверяем на разных устройствах, запускаем и остаёмся на связи для доработок.' },
      ],
    },
  },
  faq: {
    title: 'Частые вопросы',
    items: [
      { q: 'Сколько времени занимает проект?', a: 'Зависит от объёма: лендинг делается быстрее, чем сервис с личным кабинетом. После короткого знакомства с задачей мы называем реалистичный срок и этапы, а не общую цифру «на глаз».' },
      { q: 'Сколько это стоит?', a: 'Стоимость зависит от задачи, объёма и сроков, поэтому фиксированных цен на сайте нет. Напишите, что нужно сделать, и мы оценим проект и расскажем, из чего складывается цена.' },
      { q: 'На каких технологиях вы работаете?', a: 'Выбираем инструмент под задачу, а не наоборот. Этот сайт, например, сделан на React и TypeScript. Если нужен готовый конструктор или другая платформа, подберём подходящее решение.' },
      { q: 'Вы работаете удалённо?', a: 'Да. Мы базируемся в Екатеринбурге и работаем с клиентами из разных городов и стран. Общаемся в удобном вам мессенджере или по видео.' },
      { q: 'Кто будет работать над проектом?', a: 'Команда SAFAROFF: дизайн, разработка и ведение проекта в одних руках. У вас всегда есть один контакт, который в курсе всех деталей.' },
      { q: 'Поддерживаете ли вы сайт после запуска?', a: 'Да. После запуска мы остаёмся на связи: исправляем недочёты, дорабатываем и развиваем проект. Формат поддержки обсуждаем заранее.' },
    ],
  },
  about: {
    title: ['Больше, чем', 'дизайн'],
    text: '12+ лет опыта в дизайне, продуктовой разработке и визуальных коммуникациях. Объединяем стратегию, дизайн и технологии, чтобы создавать продукты с реальной ценностью.',
    more: 'Узнать больше',
    stats: [
      { kind: 'number', value: 12, suffix: '+', label: 'ЛЕТ ОПЫТА' },
      { kind: 'number', value: 50, suffix: '+', label: 'ПРОЕКТОВ' },
      { kind: 'number', value: 3, suffix: '', label: 'СТРАНЫ' },
      { kind: 'infinity', label: 'ИДЕЙ В РАБОТЕ' },
    ] as Stat[],
    /** Accessible name of the ∞ stat icon. */
    infinityLabel: 'бесконечность',
    quote: ['Хороший дизайн делает', 'сложное понятным,', 'а возможное — ближе.'],
    cta: ['ДАВАЙТЕ', 'СОЗДАДИМ', 'ЧТО-ТО ВМЕСТЕ'],
    ctaLabel: 'Давайте создадим что-то вместе — открыть форму обратной связи',
  },
  /** Floating call-to-action shown while scrolling. */
  /** Contact section at the end of the page: email, Telegram and the inline form. */
  contactSection: {
    title: ['Обсудим', 'ваш проект'],
    text: 'Напишите на почту или в Telegram — или оставьте заявку в форме. Ответим в течение дня.',
    emailLabel: 'Почта',
    telegramLabel: 'Telegram',
    locationLabel: 'Где мы',
    location: 'Екатеринбург · работаем по всему миру',
    formTitle: 'Заявка на проект',
    formSubtitle: 'Пара слов о задаче — и мы вернёмся с идеями, сроками и следующим шагом.',
    again: 'Отправить ещё одну заявку',
  },
  floatingCta: {
    label: 'Заказать проект',
  },
  feedback: {
    dialogLabel: 'Форма обратной связи',
    title: 'Обсудим проект',
    subtitle: 'Пара слов о задаче — и мы вернёмся с идеями, сроками и следующим шагом.',
    closeLabel: 'Закрыть форму',
    topicsLabel: 'Что нужно',
    topics: [
      { id: 'website', label: 'Сайт' },
      { id: 'brand', label: 'Бренд/айдентика' },
      { id: 'product', label: 'Продукт/UI' },
      { id: 'other', label: 'Другое' },
    ] as FeedbackTopic[],
    fields: {
      name: 'Имя',
      contact: 'Email или Telegram',
      contactHelper: 'Например, name@mail.ru или @username',
      message: 'Сообщение',
      messageHelper: 'Что делаем, для кого и к какому сроку',
      honeypot: 'Не заполняйте это поле',
    },
    errors: {
      summary: 'Проверьте поля:',
      nameRequired: 'Укажите имя',
      contactRequired: 'Укажите email или Telegram',
      contactInvalid: 'Нужен email (name@mail.ru), Telegram-ник (@username) или ссылка t.me',
      messageRequired: 'Напишите пару слов о задаче',
      messageShort: 'Слишком коротко — хотя бы 10 символов',
      personalDataRequired: 'Без согласия на обработку данных мы не сможем ответить',
    },
    consents: {
      label: 'Согласия',
      personalData: {
        before: 'Даю согласие на обработку персональных данных и принимаю ',
        link: 'Политику конфиденциальности',
        after: '',
      },
      newsletter: 'Хочу получать рассылку SAFAROFF: кейсы, новости и полезные материалы — не чаще раза в месяц',
      nda: 'Перед обсуждением деталей нужно подписать NDA',
      call: 'Можно позвонить или написать в мессенджер для уточнения деталей',
    },
    submit: 'Отправить',
    sending: 'Отправляем…',
    success: {
      title: 'Спасибо!',
      text: 'Сообщение отправлено. Ответим в течение дня.',
      close: 'Закрыть',
    },
    failure: {
      title: 'Не получилось отправить',
      server: 'Сервис отправки ответил ошибкой.',
      timeout: 'Сервер не ответил вовремя.',
      network: 'Похоже, пропало соединение.',
      retry: 'Попробовать снова',
      fallback: 'Или напишите нам на почту:',
    },
    /** Labels used in the body of the fallback mailto letter. */
    mailBody: { name: 'Имя', contact: 'Контакт', topic: 'Тема', message: 'Сообщение' },
  },
  footer: {
    wordmark: 'SAFAROFF',
    copyright: '© 2026',
    center: 'ДИЗАЙН. ПРОДУКТЫ. ИДЕИ.',
    links: footerLinks,
  },
}

export type Content = typeof ru

/* ------------------------------------------------------------------ EN */

const en: Content = {
  meta: {
    title: 'SAFAROFF — digital agency: websites, UI/UX, branding',
    description:
      'SAFAROFF is a full-cycle digital agency: websites, web apps, interfaces, brands and games. 12+ years of experience, 50+ projects. Working with clients worldwide.',
    ogDescription: 'We build digital products, brands and user experiences that help people and businesses grow.',
    ogLocale: 'en_US',
    ogImageAlt: 'SAFAROFF — digital agency',
  },
  langSwitch: {
    label: 'Язык / Language',
    names: { ru: 'Русский', en: 'English', tg: 'Тоҷикӣ' },
  },
  nav: [
    { label: 'PROJECTS', href: '#work' },
    { label: 'WORK', href: '#gallery' },
    { label: 'SERVICES', href: '#services' },
    { label: 'ABOUT', href: '#about' },
    { label: 'CONTACT', href: '#contact' },
  ],
  loader: {
    label: 'Loading SAFAROFF',
  },
  header: {
    wordmark: 'SAFAROFF',
    tagline: ['CREATING', 'BEYOND EXPECTATIONS'],
    homeLabel: 'SAFAROFF — back to top',
    drawer: {
      openLabel: 'Open menu',
      closeLabel: 'Close menu',
      contactsLabel: 'Contact',
      languageLabel: 'Language',
      contacts: drawerContacts,
    },
  },
  hero: {
    ...heroBase,
    side: { top: ['IDEAS', 'PRODUCTS', 'PEOPLE'], est: 'EST.', year: '2008' },
    signatureLabel: 'DIGITAL AGENCY',
    places: ['YEKATERINBURG', 'RUSSIA', 'WORLDWIDE'],
    eyebrow: 'FULL-CYCLE AGENCY · DESIGN · DEVELOPMENT · PRODUCTS',
    lines: ['Complex,', 'made', 'simple.'],
    text: 'We build digital products, brands and user experiences that help people and businesses grow.',
    cta: 'View our work',
    write: 'Get in touch',
    visualAlt: 'SAFAROFF 3D dinosaur that turns to follow the cursor',
  },
  manifesto:
    'SAFAROFF is a [full-cycle agency]. We bring design and technology together to create websites, games and [digital products]. From idea to [UX], [UI], [code] and launch. Behind us are [12+ years of experience] and [50+ projects]. Designers who think like engineers. Engineers who design with feeling. We turn [complexity] into [simplicity] that works.',
  projects: {
    title: 'Featured projects',
    text: 'Products, brands and digital solutions that turn ideas into reality.',
    openLabel: 'Open project',
    flagshipLabel: 'Flagship',
    soonLabel: 'Coming soon',
    inDevLabel: 'In development',
    caseLabel: 'Case',
    gameLabel: 'Game',
    items: [
      {
        ...projectBase.tumtipb,
        title: 'House of Science and Technology',
        description: 'An education platform for professionals',
        tags: ['Education', 'Website', 'Public sector'],
      },
      {
        ...projectBase.prostyle,
        description: 'Branded merchandise and corporate gifts',
        tags: ['Brand', 'E-commerce', 'Design'],
      },
      {
        ...projectBase.sphagnum,
        description: 'Living substrates for green roofs, vertical gardens and interiors',
        tags: ['Website', 'Eco', 'B2B'],
      },
      {
        ...projectBase.turdus,
        title: 'TURDUS fashion theatre',
        description: 'Immersive performances in bars, restaurants, an apartment and the streets of Yekaterinburg',
        tags: ['Website', 'Playbill', 'Theatre'],
      },
    ],
  },
  gallery: {
    title: 'Gallery',
    text: 'Branding, interfaces, websites and merch — a selection of work from over the years.',
    openLabel: 'Open work',
    dialogLabel: 'Viewing work',
    closeLabel: 'Close viewer',
    prevLabel: 'Previous work',
    nextLabel: 'Next work',
  },
  clients: {
    title: 'Trusted by',
    text: 'Companies and teams we have launched brands, websites and products with.',
    listLabel: 'Clients',
  },
  services: {
    title: 'What we do',
    text: 'Websites, interfaces, brands, digital products and games — from idea to launch.',
    deliverablesLabel: 'What is included',
    game: {
      aria: 'Mini-game “Pop the hexes”: tap groups of same-coloured hexes',
      hint: '👆 Tap the hexes',
      praise: ['Super!', 'Wow!', 'Great!', 'Combo!'] as readonly string[],
    },
    items: [
      {
        title: 'Websites and web apps',
        text: 'We build websites and web apps that load fast and make sense from the first screen. One team runs both design and code, so nothing gets lost between the mockup and the finished site. A fit for companies, services and educational platforms — like the House of Science and Technology.',
        deliverables: ['a company site or service', 'responsive layout for phone and desktop', 'accounts and forms'],
      },
      {
        title: 'UI/UX design',
        text: 'We design interfaces where the user never has to wonder where to click. We start with scenarios and structure, then move to mockups and a prototype. You get a result that is ready for development.',
        deliverables: ['structure and user flows', 'a prototype', 'screen mockups', 'a design system and UI kit', 'handoff to development'],
      },
      {
        title: 'Landing pages and online stores',
        text: 'We make pages that lead a visitor to one action, and stores that are easy to browse and buy from. We work on content structure, visuals and speed. From our work: the ProStyle catalogue of ~60,000 corporate gifts with live warehouse stock.',
        deliverables: ['a landing page or multi-page site', 'an online store with catalog and cart', 'a request form', 'a responsive version'],
      },
      {
        title: 'Branding and identity',
        text: 'We help a brand look coherent, from the logo to the website and merch. First we pin down what makes you different, then turn that into a visual language. Everything is collected into rules your team can actually use.',
        deliverables: ['a logo and mark', 'colors, type and style', 'branded materials and merch', 'a usage guide', "a website in the brand's style"],
      },
      {
        title: 'Digital product and MVP',
        text: 'We help turn an idea into a working product, from hypothesis and prototype to a first version. We know what matters at the start and what can wait.',
        deliverables: ['clarifying the idea and the scope of version one', 'a clickable prototype', 'MVP design and development', 'a product roadmap', 'launch and first improvements'],
      },
      {
        title: 'Game development',
        text: 'We make casual and mini games for the browser, Telegram and promo campaigns, as well as commercial games built around business goals. We design the game loop, draw the graphics and take it all the way to release. Try it: the game in this card is live.',
        deliverables: ['casual games for browser and mobile', 'mini games for Telegram, websites and campaigns', 'commercial games with monetisation', 'game design, graphics and animation', 'release and support'],
        game: true,
      },
    ],
    process: {
      title: 'How we work',
      steps: [
        { title: 'Brief', text: 'You tell us about the task, the audience and the deadline. We ask questions and say honestly what is realistic and what is better left out.' },
        { title: 'Concept', text: 'We put together the structure, flows and a first concept. We agree on a direction before detailed work begins.' },
        { title: 'Design', text: 'We draw the mockups and a clickable prototype. You see how the product will work and can make changes early.' },
        { title: 'Build', text: 'We code the layout and logic. We show intermediate versions along the way, not only at the end.' },
        { title: 'Launch and support', text: 'We test on different devices, launch and stay in touch for improvements.' },
      ],
    },
  },
  faq: {
    title: 'FAQ',
    items: [
      { q: 'How long does a project take?', a: 'It depends on scope: a landing page takes less time than a service with user accounts. After a short brief we give a realistic timeline and stages, not a ballpark guess.' },
      { q: 'How much does it cost?', a: 'The cost depends on the task, scope and deadline, so there are no fixed prices on the site. Tell us what you need, and we will estimate the project and explain what the price is made of.' },
      { q: 'What technologies do you use?', a: 'We choose tools to fit the task, not the other way round. This site, for example, is built with React and TypeScript. If you need a ready-made builder or another platform, we will find the right fit.' },
      { q: 'Do you work remotely?', a: 'Yes. We are based in Yekaterinburg and work with clients from different cities and countries. We can talk in your preferred messenger or by video.' },
      { q: 'Who will work on the project?', a: 'The SAFAROFF team: design, development and project management under one roof. You always have one contact who knows every detail.' },
      { q: 'Do you support the site after launch?', a: 'Yes. After launch we stay in touch: we fix issues, and improve and grow the project. We agree on the format of support in advance.' },
    ],
  },
  about: {
    title: ['More than', 'design'],
    text: '12+ years in design, product development and visual communication. We bring strategy, design and technology together to build products that deliver real value.',
    more: 'Learn more',
    stats: [
      { kind: 'number', value: 12, suffix: '+', label: 'YEARS IN DESIGN' },
      { kind: 'number', value: 50, suffix: '+', label: 'PROJECTS' },
      { kind: 'number', value: 3, suffix: '', label: 'COUNTRIES' },
      { kind: 'infinity', label: 'IDEAS IN MOTION' },
    ],
    infinityLabel: 'infinity',
    quote: ['Good design makes', 'the complex clear', 'and the possible closer.'],
    cta: ["LET'S CREATE", 'SOMETHING', 'TOGETHER'],
    ctaLabel: "Let's create something together — open the contact form",
  },
  contactSection: {
    title: ["Let's talk", 'about your project'],
    text: 'Email us, message us on Telegram, or leave a request in the form. We reply within a day.',
    emailLabel: 'Email',
    telegramLabel: 'Telegram',
    locationLabel: 'Where we are',
    location: 'Yekaterinburg · working worldwide',
    formTitle: 'Project request',
    formSubtitle: "A few words about the task — and we'll come back with ideas, timing and the next step.",
    again: 'Send another request',
  },
  floatingCta: {
    label: 'Order a project',
  },
  feedback: {
    dialogLabel: 'Contact form',
    title: "Let's talk",
    subtitle: "A few words about the task — and we'll come back with ideas, timing and the next step.",
    closeLabel: 'Close form',
    topicsLabel: 'What you need',
    topics: [
      { id: 'website', label: 'Website' },
      { id: 'brand', label: 'Brand identity' },
      { id: 'product', label: 'Product/UI' },
      { id: 'other', label: 'Other' },
    ],
    fields: {
      name: 'Name',
      contact: 'Email or Telegram',
      contactHelper: 'E.g. name@mail.com or @username',
      message: 'Message',
      messageHelper: 'What we are building, for whom and by when',
      honeypot: 'Leave this field empty',
    },
    errors: {
      summary: 'Please check:',
      nameRequired: 'Enter your name',
      contactRequired: 'Enter an email or Telegram',
      contactInvalid: 'Use an email (name@mail.com), a Telegram handle (@username) or a t.me link',
      messageRequired: 'Write a few words about the task',
      messageShort: 'Too short — at least 10 characters',
      personalDataRequired: 'We need your consent to process your data to reply',
    },
    consents: {
      label: 'Consents',
      personalData: {
        before: 'I consent to the processing of my personal data and accept the ',
        link: 'Privacy Policy',
        after: '',
      },
      newsletter: 'Send me the SAFAROFF newsletter: cases, news and useful materials — at most once a month',
      nda: 'An NDA must be signed before discussing details',
      call: 'You may call me or message me in a messenger to clarify details',
    },
    submit: 'Send',
    sending: 'Sending…',
    success: {
      title: 'Thank you!',
      text: "Your message is on its way. We'll reply within a day.",
      close: 'Close',
    },
    failure: {
      title: "Couldn't send",
      server: 'The delivery service returned an error.',
      timeout: 'The server took too long to respond.',
      network: 'Looks like the connection dropped.',
      retry: 'Try again',
      fallback: 'Or email us directly:',
    },
    mailBody: { name: 'Name', contact: 'Contact', topic: 'Topic', message: 'Message' },
  },
  footer: {
    wordmark: 'SAFAROFF',
    copyright: '© 2026',
    center: 'DESIGN. PRODUCTS. IDEAS.',
    links: footerLinks,
  },
}

/* ------------------------------------------------------------------ TG (Tajik) */

const tg: Content = {
  meta: {
    title: 'SAFAROFF — агентии рақамӣ: сайтҳо, UI/UX, брендинг',
    description:
      'SAFAROFF — агентии рақамии давраи пурра: сайтҳо, барномаҳои веб, интерфейсҳо, брендҳо ва бозиҳо. Зиёда аз 12 сол таҷриба, 50+ лоиҳа. Бо мизоҷон аз тамоми ҷаҳон кор мекунем.',
    ogDescription: 'Мо маҳсулоти рақамӣ, брендҳо ва таҷрибаи корбарӣ месозем, ки ба одамон ва тиҷорат барои рушд кӯмак мекунанд.',
    ogLocale: 'tg_TJ',
    ogImageAlt: 'SAFAROFF — агентии рақамӣ',
  },
  langSwitch: {
    label: 'Язык / Language',
    names: { ru: 'Русский', en: 'English', tg: 'Тоҷикӣ' },
  },
  nav: [
    { label: 'ЛОИҲАҲО', href: '#work' },
    { label: 'КОРҲО', href: '#gallery' },
    { label: 'ХИЗМАТҲО', href: '#services' },
    { label: 'ДАР БОРАИ МО', href: '#about' },
    { label: 'ТАМОС', href: '#contact' },
  ],
  loader: {
    label: 'Боркунии сайти SAFAROFF',
  },
  header: {
    wordmark: 'SAFAROFF',
    tagline: ['ЭҶОД КАРДАН', 'БЕШ АЗ ИНТИЗОРӢ'],
    homeLabel: 'SAFAROFF — ба боло',
    drawer: {
      openLabel: 'Кушодани меню',
      closeLabel: 'Пӯшидани меню',
      contactsLabel: 'Тамос',
      languageLabel: 'Забон',
      contacts: drawerContacts,
    },
  },
  hero: {
    ...heroBase,
    side: { top: ['ҒОЯҲО', 'МАҲСУЛОТ', 'ОДАМОН'], est: 'АЗ', year: '2008' },
    signatureLabel: 'АГЕНТИИ РАҚАМӢ',
    places: ['ЕКАТЕРИНБУРГ', 'РОССИЯ', 'ТАМОМИ ҶАҲОН'],
    eyebrow: 'АГЕНТИИ ДАВРАИ ПУРРА · ДИЗАЙН · ТАҲИЯ · МАҲСУЛОТ',
    lines: ['Душворро', 'осон', 'мекунем.'],
    text: 'Мо маҳсулоти рақамӣ, брендҳо ва таҷрибаи корбарӣ месозем, ки ба одамон ва тиҷорат барои рушд кӯмак мекунанд.',
    cta: 'Дидани корҳо',
    write: 'Ба мо нависед',
    visualAlt: 'Динозаври сеченакаи SAFAROFF, ки ба самти курсор рӯ мегардонад',
  },
  manifesto:
    'SAFAROFF — [агентии давраи пурра]. Мо дизайн ва технологияро муттаҳид мекунем, то сайтҳо, бозиҳо ва [маҳсулоти рақамӣ] созем. Аз ғоя то [UX], [UI], [код] ва оғоз. Пушти мо — [12+ сол таҷриба] ва [50+ лоиҳа]. Дизайнерҳое, ки мисли муҳандисон фикр мекунанд. Муҳандисоне, ки бо ҳиссиёт тарҳрезӣ мекунанд. Мо [мураккаб]-ро ба [содда]-е табдил медиҳем, ки кор мекунад.',
  projects: {
    title: 'Лоиҳаҳои мунтахаб',
    text: 'Маҳсулот, брендҳо ва ҳалли рақамӣ, ки ғояҳоро ба воқеият табдил медиҳанд.',
    openLabel: 'Кушодани лоиҳа',
    flagshipLabel: 'Лоиҳаи асосӣ',
    soonLabel: 'Ба наздикӣ',
    inDevLabel: 'Дар коркард',
    caseLabel: 'Кейс',
    gameLabel: 'Бозӣ',
    items: [
      {
        ...projectBase.tumtipb,
        title: 'Хонаи илм ва техника',
        description: 'Платформаи таълимӣ барои мутахассисон',
        tags: ['Маориф', 'Сайт', 'Бахши давлатӣ'],
      },
      {
        ...projectBase.prostyle,
        description: 'Маҳсулоти тӯҳфавӣ ва тӯҳфаҳои корпоративӣ',
        tags: ['Бренд', 'Мағозаи онлайн', 'Дизайн'],
      },
      {
        ...projectBase.sphagnum,
        description: 'Субстратҳои зинда барои боміҳои сабз, боғҳои амудӣ ва интерйерҳо',
        tags: ['Сайт', 'Эко', 'B2B'],
      },
      {
        ...projectBase.turdus,
        title: 'Театри мӯди TURDUS',
        description: 'Намоишҳои иммерсивӣ дар барҳо, тарабхонаҳо, хона ва кӯчаҳои Екатеринбург',
        tags: ['Сайт', 'Афиша', 'Театр'],
      },
    ],
  },
  gallery: {
    title: 'Галереяи корҳо',
    text: 'Брендинг, интерфейсҳо, сайтҳо ва мерч — интихоби корҳои солҳои гуногун.',
    openLabel: 'Кушодани кор',
    dialogLabel: 'Тамошои кор',
    closeLabel: 'Пӯшидани тамошо',
    prevLabel: 'Кори қаблӣ',
    nextLabel: 'Кори навбатӣ',
  },
  clients: {
    title: 'Ба мо бовар мекунанд',
    text: 'Ширкатҳо ва дастаҳое, ки бо онҳо брендҳо, сайтҳо ва маҳсулот оғоз кардем.',
    listLabel: 'Мизоҷон',
  },
  services: {
    title: 'Мо бо чӣ машғулем',
    text: 'Сайтҳо, интерфейсҳо, брендҳо, маҳсулоти рақамӣ ва бозиҳо — аз ғоя то оғоз.',
    deliverablesLabel: 'Чӣ дохил мешавад',
    game: {
      aria: 'Бозии хурд «Шонаҳоро тарконед»: ба гурӯҳҳои шонаҳои якранг пахш кунед',
      hint: '👆 Ба шонаҳо пахш кунед',
      praise: ['Олӣ!', 'Вой!', 'Хеле хуб!', 'Комбо!'] as readonly string[],
    },
    items: [
      {
        title: 'Таҳияи сайтҳо ва барномаҳои веб',
        text: 'Мо сайтҳо ва барномаҳои веб месозем, ки зуд бор мешаванд ва аз экрани аввал фаҳмоанд. Дизайн ва кодро як даста пеш мебарад, бинобар ин байни макет ва сайти тайёр чизе гум намешавад. Барои ширкатҳо, хидматрасонҳо ва платформаҳои таълимӣ мувофиқ аст — масалан, «Хонаи илм ва техника».',
        deliverables: ['сайти корпоративӣ ё хидматрасонӣ', 'тарҳбандии мутобиқ барои телефон ва компютер', 'кабинетҳои шахсӣ ва формаҳо'],
      },
      {
        title: 'Дизайни UI/UX-и интерфейсҳо',
        text: 'Мо интерфейсҳое тарҳрезӣ мекунем, ки дар онҳо одам фикр намекунад, ба куҷо пахш кунад. Аз сенарияҳо ва сохтор оғоз мекунем, баъд макетҳо ва прототип мекашем. Натиҷаро дар шакле месупорем, ки барои таҳиягарон қулай аст.',
        deliverables: ['сохтор ва сенарияҳои корбарӣ', 'прототип', 'макетҳои экранҳо', 'дизайн-система ва UI-кит', 'супоридани макетҳо ба таҳия'],
      },
      {
        title: 'Лендингҳо ва мағозаҳои онлайн',
        text: 'Мо саҳифаҳое месозем, ки меҳмонро ба як амал мебаранд, ва мағозаҳое, ки дар онҳо интихоб ва харид қулай аст. Бар сохтори матн, визуал ва суръат кор мекунем. Мисол аз таҷриба: каталоги ProStyle бо ~60 000 тӯҳфаи корпоративӣ ва боқимондаҳо аз анборҳо.',
        deliverables: ['лендинг ё сайти бисёрсаҳифа', 'мағозаи онлайн бо каталог ва сабад', 'формаи дархост', 'версияи мутобиқ'],
      },
      {
        title: 'Брендинг ва айдентика',
        text: 'Мо ба бренд кӯмак мекунем, ки яклухт намояд: аз логотип то сайт ва мерч. Аввал муайян мекунем, ки шумо бо чӣ фарқ мекунед, баъд инро ба забони визуалӣ табдил медиҳем ва қоидаҳое ҷамъ мекунем, ки барои даста истифодааш қулай аст.',
        deliverables: ['логотип ва аломат', 'рангҳо, шрифтҳо, услуб', 'маводи фирмавӣ ва мерч', 'дастур оид ба истифода', 'ороиши сайт бо услуби бренд'],
      },
      {
        title: 'Маҳсулоти рақамӣ ва MVP',
        text: 'Мо кӯмак мекунем, ки ғоя ба маҳсулоти корӣ табдил ёбад: аз фарзия ва прототип то версияи аввал. Медонем, ки дар оғоз чӣ муҳим аст ва чиро метавон ба баъд гузошт.',
        deliverables: ['дақиқ кардани ғоя ва таркиби версияи аввал', 'прототипи интерактивӣ', 'дизайн ва таҳияи MVP', 'нақшаи рушди маҳсулот', 'оғоз ва такмилҳои аввал'],
      },
      {
        title: 'Таҳияи бозиҳо',
        text: 'Мо бозиҳои казуалӣ ва хурд барои браузер, Telegram ва аксияҳои промо, инчунин бозиҳои тиҷоратӣ барои вазифаҳои бизнес месозем. Сикли бозиро фикр мекунем, графика мекашем ва то нашр мерасонем. Санҷед: бозӣ дар корт зинда аст.',
        deliverables: ['бозиҳои казуалӣ барои браузер ва телефон', 'бозиҳои хурд барои Telegram, сайтҳо ва аксияҳо', 'бозиҳои тиҷоратӣ бо монетизатсия', 'геймдизайн, графика ва аниматсия', 'нашр ва дастгирӣ'],
        game: true,
      },
    ],
    process: {
      title: 'Мо чӣ тавр кор мекунем',
      steps: [
        { title: 'Шиносоӣ ва вазифа', text: 'Шумо дар бораи вазифа, аудитория ва мӯҳлатҳо нақл мекунед. Мо савол медиҳем ва ростқавлона мегӯем, ки чӣ воқеӣ аст ва чиро беҳтар аст хориҷ кунем.' },
        { title: 'Сохтор ва консепсия', text: 'Сохтор, сенарияҳо ва консепсияи аввалро ҷамъ мекунем. Самтро пеш аз оғози кори муфассал мувофиқа мекунем.' },
        { title: 'Дизайн ва прототип', text: 'Макетҳо ва прототипи интерактивӣ мекашем. Шумо мебинед, ки маҳсулот чӣ тавр кор мекунад, ва дар марҳилаи барвақт ислоҳ ворид мекунед.' },
        { title: 'Таҳия', text: 'Тарҳбандӣ ва барномасозӣ мекунем. Версияҳои фосилавиро дар ҷараён нишон медиҳем, на дар охир.' },
        { title: 'Оғоз ва дастгирӣ', text: 'Дар дастгоҳҳои гуногун месанҷем, оғоз мекунем ва барои такмилҳо дар тамос мемонем.' },
      ],
    },
  },
  faq: {
    title: 'Саволҳои зиёд додашаванда',
    items: [
      { q: 'Лоиҳа чӣ қадар вақт мегирад?', a: 'Аз ҳаҷм вобаста аст: лендинг нисбат ба хидматрасонӣ бо кабинети шахсӣ тезтар сохта мешавад. Пас аз шиносоии кӯтоҳ бо вазифа мо мӯҳлат ва марҳилаҳои воқеиро мегӯем, на рақами тахминӣ.' },
      { q: 'Арзишаш чанд аст?', a: 'Арзиш аз вазифа, ҳаҷм ва мӯҳлатҳо вобаста аст, бинобар ин дар сайт нархҳои собит нестанд. Нависед, ки чӣ бояд кард, ва мо лоиҳаро арзёбӣ карда, мегӯем, ки нарх аз чӣ иборат аст.' },
      { q: 'Шумо бо кадом технологияҳо кор мекунед?', a: 'Мо асбобро аз рӯи вазифа интихоб мекунем, на баръакс. Масалан, ин сайт бо React ва TypeScript сохта шудааст. Агар конструктори тайёр ё платформаи дигар лозим бошад, ҳалли мувофиқ меёбем.' },
      { q: 'Шумо фосилавӣ кор мекунед?', a: 'Ҳа. Мо дар Екатеринбург ҷойгирем ва бо мизоҷон аз шаҳрҳо ва кишварҳои гуногун кор мекунем. Дар мессенҷери барои шумо қулай ё тавассути видео гуфтугӯ мекунем.' },
      { q: 'Кӣ бар лоиҳа кор мекунад?', a: 'Дастаи SAFAROFF: дизайн, таҳия ва пешбурди лоиҳа дар як даст. Шумо ҳамеша як шахси тамос доред, ки аз ҳамаи ҷузъиёт огоҳ аст.' },
      { q: 'Оё шумо сайтро пас аз оғоз дастгирӣ мекунед?', a: 'Ҳа. Пас аз оғоз мо дар тамос мемонем: камбудиҳоро ислоҳ мекунем, лоиҳаро такмил ва рушд медиҳем. Формати дастгириро пешакӣ муҳокима мекунем.' },
    ],
  },
  about: {
    title: ['Беш аз', 'дизайн'],
    text: 'Зиёда аз 12 сол таҷриба дар дизайн, таҳияи маҳсулот ва коммуникатсияҳои визуалӣ. Мо стратегия, дизайн ва технологияро муттаҳид мекунем, то маҳсулоте созем, ки арзиши воқеӣ дорад.',
    more: 'Бештар донистан',
    stats: [
      { kind: 'number', value: 12, suffix: '+', label: 'СОЛ ТАҶРИБА' },
      { kind: 'number', value: 50, suffix: '+', label: 'ЛОИҲА' },
      { kind: 'number', value: 3, suffix: '', label: 'КИШВАР' },
      { kind: 'infinity', label: 'ҒОЯҲО ДАР КОР' },
    ],
    infinityLabel: 'беохир',
    quote: ['Дизайни хуб', 'мураккабро фаҳмо', 'ва имконпазирро наздиктар мекунад.'],
    cta: ['БИЁЕД', 'ЧИЗЕ', 'ЯКҶОЯ ЭҶОД КУНЕМ'],
    ctaLabel: 'Биёед чизе якҷоя эҷод кунем — кушодани формаи тамос',
  },
  contactSection: {
    title: ['Лоиҳаи шуморо', 'муҳокима кунем'],
    text: 'Ба почта ё Telegram нависед — ё дар форма дархост гузоред. Дар давоми як рӯз ҷавоб медиҳем.',
    emailLabel: 'Почта',
    telegramLabel: 'Telegram',
    locationLabel: 'Мо дар куҷоем',
    location: 'Екатеринбург · дар тамоми ҷаҳон кор мекунем',
    formTitle: 'Дархост барои лоиҳа',
    formSubtitle: 'Чанд сухан дар бораи вазифа — ва мо бо ғояҳо, мӯҳлатҳо ва қадами навбатӣ бармегардем.',
    again: 'Боз як дархост фиристодан',
  },
  floatingCta: {
    label: 'Фармоиши лоиҳа',
  },
  feedback: {
    dialogLabel: 'Формаи тамос',
    title: 'Лоиҳаро муҳокима кунем',
    subtitle: 'Чанд сухан дар бораи вазифа — ва мо бо ғояҳо, мӯҳлатҳо ва қадами навбатӣ бармегардем.',
    closeLabel: 'Пӯшидани форма',
    topicsLabel: 'Чӣ лозим аст',
    topics: [
      { id: 'website', label: 'Сайт' },
      { id: 'brand', label: 'Бренд/айдентика' },
      { id: 'product', label: 'Маҳсулот/UI' },
      { id: 'other', label: 'Дигар' },
    ],
    fields: {
      name: 'Ном',
      contact: 'Email ё Telegram',
      contactHelper: 'Масалан, name@mail.ru ё @username',
      message: 'Паём',
      messageHelper: 'Чӣ месозем, барои кӣ ва то кадом мӯҳлат',
      honeypot: 'Ин майдонро пур накунед',
    },
    errors: {
      summary: 'Майдонҳоро санҷед:',
      nameRequired: 'Номро нишон диҳед',
      contactRequired: 'Email ё Telegram-ро нишон диҳед',
      contactInvalid: 'Email (name@mail.ru), ники Telegram (@username) ё истиноди t.me лозим аст',
      messageRequired: 'Дар бораи вазифа чанд сухан нависед',
      messageShort: 'Хеле кӯтоҳ — ақаллан 10 аломат',
      personalDataRequired: 'Бе розигӣ ба коркарди маълумот мо ҷавоб дода наметавонем',
    },
    consents: {
      label: 'Розигиҳо',
      personalData: {
        before: 'Ба коркарди маълумоти шахсии худ розӣ ҳастам ва ',
        link: 'Сиёсати махфиятро',
        after: ' қабул мекунам',
      },
      newsletter: 'Мехоҳам хабарномаи SAFAROFF-ро гирам: кейсҳо, навигариҳо ва маводи муфид — на бештар аз як бор дар як моҳ',
      nda: 'Пеш аз муҳокимаи тафсилот бояд NDA имзо шавад',
      call: 'Барои аниқ кардани тафсилот метавонед занг занед ё дар мессенҷер нависед',
    },
    submit: 'Фиристодан',
    sending: 'Фиристода истодаем…',
    success: {
      title: 'Ташаккур!',
      text: 'Паём фиристода шуд. Дар давоми як рӯз ҷавоб медиҳем.',
      close: 'Пӯшидан',
    },
    failure: {
      title: 'Фиристодан муяссар нашуд',
      server: 'Хадамоти фиристодан бо хато ҷавоб дод.',
      timeout: 'Сервер сари вақт ҷавоб надод.',
      network: 'Чунин менамояд, ки пайвастшавӣ қатъ шуд.',
      retry: 'Боз кӯшиш кунед',
      fallback: 'Ё ба почтаи мо нависед:',
    },
    mailBody: { name: 'Ном', contact: 'Тамос', topic: 'Мавзӯъ', message: 'Паём' },
  },
  footer: {
    wordmark: 'SAFAROFF',
    copyright: '© 2026',
    center: 'ДИЗАЙН. МАҲСУЛОТ. ҒОЯҲО.',
    links: footerLinks,
  },
}

export const content: Record<Lang, Content> = { ru, en, tg }
