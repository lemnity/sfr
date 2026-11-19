// Builds presentation/deck.html from the site's assets and renders it to PDF (1920×1080 pages).
import fs from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright'

const R = '/Users/thesimakov/Documents/GitHub/smkv'
const OUT = path.join(R, 'presentation')
const rel = (p) => path.relative(OUT, path.join(R, p))

// Logo artwork (SIMAKOOV with ∞) straight from the site source.
const art = fs.readFileSync(path.join(R, 'src/components/logoArtwork.ts'), 'utf8')
const letters = [...art.matchAll(/^\s+'(M[^']+)',$/gm)].map((m) => m[1])
const inf = art.match(/LOGO_INFINITY =\s*'([^']+)'/)[1]
const logo = (h, text = '#f4f1ec') =>
  `<svg class="logo" style="height:${h}px" viewBox="0 0 400 55" xmlns="http://www.w3.org/2000/svg">${letters
    .map((d) => `<path d="${d}" fill="${text}"/>`)
    .join('')}<path d="${inf}" fill="#c4ee18"/></svg>`

const clients = [...fs.readFileSync(path.join(R, 'src/data/clients.ts'), 'utf8').matchAll(/name: '([^']+)', src: `\$\{BASE\}([^`]+)`(.*?)\}/g)].map(
  (m) => ({ name: m[1], src: rel('public/' + m[2]), keepColor: /filter/.test(m[3]) }),
)

const work = (n, full = true) => rel(`public/works/work-${String(n).padStart(2, '0')}${full ? '-full' : ''}.webp`)

let page = 0
const TOTAL = 12
const chrome = (label) => {
  page++
  return `<header class="top">${logo(22)}<span class="lbl">${String(page).padStart(2, '0')} / ${label}</span></header>
  <footer class="bot"><span>simakoov.ru</span><span>${String(page).padStart(2, '0')} / ${String(TOTAL).padStart(2, '0')}</span></footer>`
}

const slides = []

// 1. Cover
page++
slides.push(`<section class="slide cover">
  <div class="glow"></div>
  <img class="cover-portrait" src="${rel('public/assets/portrait-hero.png')}" alt="">
  <div class="cover-body">
    ${logo(46)}
    <p class="eyebrow" style="margin-top:120px">Разработчик · UI/UX дизайнер · Продюсер · Основатель</p>
    <h1 class="mega">Делаю<br>сложное<br><span class="lime">простым.</span></h1>
    <p class="lead" style="max-width:640px">Создаю цифровые продукты, бренды и пользовательские опыты, которые помогают людям и бизнесу расти.</p>
  </div>
  <footer class="bot"><span>Александр Симаков · Тюмень · работаю по всему миру</span><span>simakoov.ru</span></footer>
</section>`)

// 2. About
slides.push(`<section class="slide">
  ${chrome('Обо мне')}
  <div class="grid2" style="grid-template-columns: 1fr 1.05fr">
    <div>
      <h2 class="h2">Больше,<br>чем дизайн</h2>
      <p class="lead" style="margin-top:44px;max-width:640px">12+ лет опыта в дизайне, продуктовой разработке и визуальных коммуникациях. Объединяю стратегию, дизайн и технологии, чтобы создавать продукты с реальной ценностью.</p>
      <p class="quote">«Хороший дизайн делает сложное понятным, а&nbsp;возможное&nbsp;— ближе.»</p>
    </div>
    <div class="stats">
      <div class="stat"><b>12+</b><span>лет опыта</span></div>
      <div class="stat"><b>50+</b><span>проектов</span></div>
      <div class="stat"><b>3</b><span>страны</span></div>
      <div class="stat"><b class="lime">∞</b><span>идей в работе</span></div>
    </div>
  </div>
</section>`)

// 3. Services
const services = [
  ['Разработка сайтов и веб-приложений', 'Сайты и сервисы, которые быстро загружаются и понятны с первого экрана. Дизайн и код в одних руках — без разрыва между макетом и результатом.', ['корпоративный сайт или сервис', 'адаптив для телефона и компьютера', 'личные кабинеты и формы']],
  ['UI/UX-дизайн интерфейсов', 'Интерфейсы, в которых пользователь не думает, куда нажать: от сценариев и структуры до макетов и прототипа.', ['сценарии и структура', 'кликабельный прототип', 'дизайн-система и UI-кит']],
  ['Лендинги и интернет-магазины', 'Страницы, которые ведут к одному действию, и магазины, где удобно выбирать и покупать.', ['лендинг или многостраничный сайт', 'каталог и корзина', 'формы заявок']],
  ['Брендинг и айдентика', 'Цельный бренд — от логотипа до сайта и мерча, собранный в понятные правила для команды.', ['логотип и знак', 'цвета, шрифты, стиль', 'носители, мерч и гайд']],
  ['Цифровой продукт и MVP', 'От гипотезы и прототипа до первой версии. Как продюсер знаю, что важно на старте, а что можно отложить.', ['состав первой версии', 'дизайн и разработка MVP', 'запуск и развитие']],
]
slides.push(`<section class="slide">
  ${chrome('Услуги')}
  <div class="head"><h2 class="h2">Чем я занимаюсь</h2><p class="muted">Сайты, интерфейсы, бренды и цифровые продукты — от идеи до запуска.</p></div>
  <div class="cards5">${services
    .map(
      ([t, d, list], i) => `<article class="card"><span class="num">${String(i + 1).padStart(2, '0')}</span><h3>${t}</h3><p>${d}</p><ul>${list
        .map((x) => `<li>${x}</li>`)
        .join('')}</ul></article>`,
    )
    .join('')}</div>
</section>`)

// 4. Process
const steps = [
  ['Знакомство и задача', 'Обсуждаем задачу, аудиторию и сроки. Честно говорю, что реально, а что лучше убрать.'],
  ['Структура и концепция', 'Собираю структуру, сценарии и первую концепцию. Согласуем направление до детальной работы.'],
  ['Дизайн и прототип', 'Макеты и кликабельный прототип — правки на раннем этапе, а не в конце.'],
  ['Разработка', 'Верстаю и программирую. Промежуточные версии показываю по ходу.'],
  ['Запуск и поддержка', 'Проверяю на разных устройствах, запускаю и остаюсь на связи для доработок.'],
]
slides.push(`<section class="slide">
  ${chrome('Процесс')}
  <div class="head"><h2 class="h2">Как я работаю</h2><p class="muted">Прозрачно, по этапам и с видимым результатом на каждом шаге.</p></div>
  <ol class="steps">${steps
    .map(([t, d], i) => `<li><span class="stepnum">${String(i + 1).padStart(2, '0')}</span><h3>${t}</h3><p>${d}</p></li>`)
    .join('')}</ol>
  <div class="why">
    <div><b>Лично веду проект</b><span>дизайн, разработка и организация процесса — с вами работаю я сам</span></div>
    <div><b>Удалённо по всему миру</b><span>Тюмень, разные города и страны; общаемся в удобном мессенджере</span></div>
    <div><b>Поддержка после запуска</b><span>исправляю, дорабатываю и развиваю проект дальше</span></div>
  </div>
</section>`)

// 5. Flagship
slides.push(`<section class="slide">
  ${chrome('Главный проект')}
  <div class="flag">
    <div class="flag-copy">
      <span class="pill">Главный проект</span>
      <img class="flag-logo" src="${rel('public/clients/lemnity.svg')}" alt="Lemnity">
      <p class="lead">Платформа для создания сайтов, чат-ботов и цифровых продуктов: сайт, виджеты, чат, бот с оплатами, заявки и аналитика — в одном окне.</p>
      <p class="tags">#SaaS &nbsp; #Конструктор &nbsp; #AI &nbsp; #Продукт</p>
      <p class="link">lemnity.ru</p>
    </div>
    <div class="shot shot-xl"><img src="img/lemnity.jpg" alt=""></div>
  </div>
</section>`)

// 6–7. Projects (two per slide)
const proj = [
  ['Дом науки и техники', 'Образовательная платформа для профессионалов: семинары, курсы и вебинары.', '#Образование #Сайт #Гос.&nbsp;сектор', 'web.tumtipb.ru', 'img/dom-nauki.jpg'],
  ['ProStyle', 'Корпоративные подарки и сувенирная продукция с логотипом, Тюмень. Интернет-магазин с каталогом.', '#Бренд #Интернет-магазин #Дизайн', 'prostyle.agency', 'img/prostyle.jpg'],
  ['Sphagnum AE', 'Живые субстраты для зелёных крыш, вертикальных садов и интерьеров. B2B-сайт для рынка ОАЭ.', '#Сайт #Эко #B2B', 'lemnity.github.io/sphgnm', 'img/sphagnum.jpg'],
  ['Модный театр TURDUS', 'Иммерсивные спектакли в барах, ресторанах, квартире и на улицах Екатеринбурга. Афиша и продажа билетов.', '#Сайт #Афиша #Театр', 'lemnity.github.io/trds', 'img/turdus.jpg'],
]
for (const pair of [proj.slice(0, 2), proj.slice(2, 4)]) {
  slides.push(`<section class="slide">
  ${chrome('Проекты')}
  <div class="head"><h2 class="h2">Избранные проекты</h2><p class="muted">Продукты, бренды и цифровые решения, которые делают идеи реальностью.</p></div>
  <div class="pair">${pair
    .map(
      ([t, d, tags, url, img]) => `<article class="pcard"><div class="shot"><img src="${img}" alt=""></div>
      <div class="pmeta"><div><h3>${t}</h3><p>${d}</p><p class="tags">${tags}</p></div><span class="${url === 'скоро' ? 'soon' : 'link'}">${url === 'скоро' ? '● скоро' : url}</span></div></article>`,
    )
    .join('')}</div>
</section>`)
}

// 8–9. Gallery
const galleries = [
  ['Брендинг и мерч', 'Айдентика, полиграфия и мерч — то, что держат в руках.', [
    [1, 'a'], [4, 'b'], [5, 'c'], [2, 'd'], [12, 'e'], [9, 'f'], [15, 'g'], [19, 'h'],
  ]],
  ['Интерфейсы и сайты', 'Сервисы, приложения и сайты — то, чем пользуются каждый день.', [
    [10, 'a'], [35, 'b'], [25, 'c'], [28, 'd'], [40, 'e'], [46, 'f'], [20, 'g'], [3, 'h'],
  ]],
]
for (const [title, sub, items] of galleries) {
  slides.push(`<section class="slide">
  ${chrome('Галерея работ')}
  <div class="head"><h2 class="h2">${title}</h2><p class="muted">${sub}</p></div>
  <div class="bento">${items.map(([n, area]) => `<div class="tile" style="grid-area:${area}"><img src="${work(n, area === 'a' || area === 'h')}" alt=""></div>`).join('')}</div>
</section>`)
}

// 10. Clients
slides.push(`<section class="slide">
  ${chrome('Клиенты')}
  <div class="head"><h2 class="h2">Мне доверяют</h2><p class="muted">Компании и команды, с которыми мы запускали бренды, сайты и продукты.</p></div>
  <div class="logos">${clients
    .map((c) => `<div class="logo-cell"><img src="${c.src}" alt="${c.name}" style="${c.keepColor ? 'filter:grayscale(1)' : ''}"></div>`)
    .join('')}</div>
</section>`)

// 11. Gallery mosaic teaser of everything
slides.push(`<section class="slide">
  ${chrome('Портфолио')}
  <div class="head"><h2 class="h2">46 работ в портфолио</h2><p class="muted">Полная галерея — на сайте simakoov.ru в разделе «Работы».</p></div>
  <div class="mosaic">${[6, 34, 23, 27, 11, 16, 21, 13, 24, 31, 37, 42].map((n) => `<div class="tile"><img src="${work(n, false)}" alt=""></div>`).join('')}</div>
</section>`)

// 12. Contacts
page++
slides.push(`<section class="slide contact">
  <div class="glow"></div>
  <img class="cover-portrait" src="${rel('public/assets/portrait-hero.png')}" alt="">
  <div class="cover-body">
    ${logo(46)}
    <h2 class="mega" style="margin-top:90px;font-size:124px;white-space:nowrap">Давайте<br>создадим что&#8209;то<br><span class="lime">вместе.</span></h2>
    <div class="contacts">
      <div><span>Почта</span><b>thesimakov@gmail.com</b></div>
      <div><span>Telegram</span><b>t.me/simakoov</b></div>
      <div><span>Сайт</span><b>simakoov.ru</b></div>
    </div>
  </div>
  <footer class="bot"><span>Александр Симаков · SIMAKOOV</span><span>${String(page).padStart(2, '0')} / ${String(TOTAL).padStart(2, '0')}</span></footer>
</section>`)

if (page !== TOTAL) throw new Error(`page count ${page} != ${TOTAL}`)

const font = (w, f) => `@font-face{font-family:Gilroy;font-weight:${w};src:url(${rel('public/fonts/gilroy-' + f + '.woff2')}) format('woff2')}`
const css = `
${font(400, 'regular')}${font(500, 'medium')}${font(600, 'semibold')}${font(700, 'bold')}${font(900, 'heavy')}
@page{size:1920px 1080px;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#030303}
body{font-family:Gilroy,system-ui,sans-serif;color:#f4f1ec;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.slide{position:relative;width:1920px;height:1080px;padding:150px 120px 120px;overflow:hidden;page-break-after:always;break-after:page;background:#030303}
.top{position:absolute;top:56px;left:120px;right:120px;display:flex;justify-content:space-between;align-items:center}
.lbl,.bot{font-size:14px;letter-spacing:.22em;text-transform:uppercase;color:#8b8b87}
.bot{position:absolute;left:120px;right:120px;bottom:52px;display:flex;justify-content:space-between;border-top:1px solid rgba(255,255,255,.09);padding-top:22px}
.lime{color:#c4ee18}
.muted{color:#8b8b87;font-size:22px;line-height:1.5;max-width:520px}
.eyebrow{font-size:15px;letter-spacing:.26em;text-transform:uppercase;color:#c4ee18;font-weight:500}
.mega{font-weight:400;font-size:150px;line-height:.95;letter-spacing:-.045em;margin-top:28px}
.h2{font-weight:400;font-size:92px;line-height:1;letter-spacing:-.04em}
.lead{font-size:28px;line-height:1.5;color:rgba(244,241,236,.78);margin-top:40px}
.head{display:flex;justify-content:space-between;align-items:flex-end;gap:60px;margin-bottom:56px}
.grid2{display:grid;gap:100px;align-items:center;height:100%}
/* cover + contact */
.cover,.contact{padding:110px 120px}
.cover-body{position:relative;z-index:2;max-width:1080px}
.cover-portrait{position:absolute;right:120px;bottom:0;height:960px;z-index:1;
  -webkit-mask-image:linear-gradient(to right,transparent 0%,#000 22%,#000 78%,transparent 100%),linear-gradient(to top,transparent 0%,#000 30%);
  -webkit-mask-composite:source-in;mask-composite:intersect}
.glow{position:absolute;right:120px;top:120px;width:760px;height:760px;border-radius:50%;background:radial-gradient(circle,rgba(196,238,24,.16),transparent 65%);z-index:0}
/* about */
.stats{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid rgba(255,255,255,.09);border-left:1px solid rgba(255,255,255,.09)}
.stat{padding:56px 48px;border-right:1px solid rgba(255,255,255,.09);border-bottom:1px solid rgba(255,255,255,.09)}
.stat b{display:block;font-size:120px;font-weight:400;line-height:1;letter-spacing:-.04em}
.stat span{display:block;margin-top:18px;font-size:16px;letter-spacing:.22em;text-transform:uppercase;color:#8b8b87}
.quote{margin-top:64px;font-size:40px;line-height:1.25;font-weight:600;letter-spacing:-.02em;padding-left:28px;border-left:3px solid #c4ee18;max-width:680px}
/* services */
.cards5{display:grid;grid-template-columns:repeat(5,1fr);gap:20px}
.card{background:#0d0d0d;border:1px solid rgba(255,255,255,.09);border-radius:10px;padding:34px 30px;height:640px;display:flex;flex-direction:column}
.num{font-size:16px;letter-spacing:.2em;color:#c4ee18}
.card h3{font-size:30px;font-weight:500;line-height:1.15;margin-top:26px;letter-spacing:-.01em}
.card p{font-size:18px;line-height:1.55;color:#8b8b87;margin-top:20px}
.card ul{list-style:none;margin-top:auto}
.card li{font-size:17px;line-height:1.4;padding:12px 0;border-top:1px solid rgba(255,255,255,.09)}
.card li::before{content:'— ';color:#c4ee18}
/* process */
.steps{list-style:none;display:grid;grid-template-columns:repeat(5,1fr);gap:20px}
.steps li{background:#0d0d0d;border:1px solid rgba(255,255,255,.09);border-radius:10px;padding:32px 28px;min-height:330px}
.stepnum{font-size:56px;font-weight:400;color:#c4ee18;letter-spacing:-.03em}
.steps h3{font-size:26px;font-weight:500;margin-top:30px;line-height:1.2}
.steps p{font-size:18px;line-height:1.55;color:#8b8b87;margin-top:16px}
.why{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:40px}
.why div{border-top:2px solid #c4ee18;padding-top:22px}
.why b{display:block;font-size:26px;font-weight:600}
.why span{display:block;margin-top:10px;font-size:18px;line-height:1.5;color:#8b8b87}
/* flagship */
.flag{display:grid;grid-template-columns:.8fr 1.4fr;gap:80px;align-items:center;height:100%}
.pill{display:inline-block;background:#c4ee18;color:#030303;font-weight:600;font-size:14px;letter-spacing:.22em;text-transform:uppercase;padding:9px 18px;border-radius:999px}
.flag-logo{display:block;height:110px;margin-top:44px}
.tags{font-size:18px;color:#8b8b87;margin-top:26px;letter-spacing:.02em}
.link{font-size:20px;color:#c4ee18;margin-top:30px;letter-spacing:.04em}
.shot{border-radius:14px;overflow:hidden;border:1px solid rgba(255,255,255,.12);background:#0d0d0d}
.shot img{display:block;width:100%;height:100%;object-fit:cover;object-position:top}
.shot-xl{aspect-ratio:16/10;box-shadow:0 60px 120px -50px rgba(196,238,24,.35)}
/* projects */
.pair{display:grid;grid-template-columns:1fr 1fr;gap:40px}
.pcard .shot{aspect-ratio:16/9}
.pmeta{display:flex;justify-content:space-between;gap:30px;margin-top:22px}
.pmeta h3{font-size:36px;font-weight:400;letter-spacing:-.02em}
.pmeta p{font-size:19px;line-height:1.45;color:rgba(244,241,236,.72);margin-top:8px;max-width:620px}
.pmeta .tags{font-size:16px;color:#8b8b87}
.pmeta .link,.soon{white-space:nowrap;font-size:16px;letter-spacing:.06em;margin-top:14px}
.soon{color:#c4ee18;border:1px solid rgba(196,238,24,.45);border-radius:999px;padding:8px 16px;height:max-content;text-transform:uppercase;letter-spacing:.2em;font-size:13px}
/* gallery */
.bento{display:grid;gap:16px;height:640px;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(3,1fr);
  grid-template-areas:"a a b c" "a a d e" "f g h h"}
.tile{border-radius:10px;overflow:hidden;background:#0d0d0d;border:1px solid rgba(255,255,255,.08)}
.tile img{width:100%;height:100%;object-fit:cover;object-position:top;display:block}
.mosaic{display:grid;grid-template-columns:repeat(6,1fr);grid-template-rows:repeat(2,310px);gap:16px}
/* clients */
.logos{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid rgba(255,255,255,.09);border-left:1px solid rgba(255,255,255,.09)}
.logo-cell{height:200px;display:grid;place-items:center;border-right:1px solid rgba(255,255,255,.09);border-bottom:1px solid rgba(255,255,255,.09)}
.logo-cell img{max-width:62%;max-height:70px;filter:brightness(0) invert(1);opacity:.85}
/* contacts */
.contacts{display:grid;grid-template-columns:repeat(3,auto);gap:70px;margin-top:60px;justify-content:start}
.contacts span{display:block;font-size:15px;letter-spacing:.24em;text-transform:uppercase;color:#8b8b87}
.contacts b{display:block;font-size:34px;font-weight:500;margin-top:14px}
.logo{display:block;width:auto}
`

const html = `<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>SIMAKOOV — презентация</title><style>${css}</style></head><body>${slides.join('\n')}</body></html>`
fs.writeFileSync(path.join(OUT, 'deck.html'), html)

const browser = await chromium.launch()
const pg = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
await pg.goto('file://' + path.join(OUT, 'deck.html'), { waitUntil: 'load' })
await pg.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r })))) })
const broken = await pg.evaluate(() => [...document.images].filter((i) => !i.naturalWidth).map((i) => i.getAttribute('src')))
const overflow = await pg.evaluate(() => [...document.querySelectorAll('.slide')].map((s, i) => [i + 1, s.scrollHeight > s.clientHeight + 2 || s.scrollWidth > s.clientWidth + 2]).filter((x) => x[1]).map((x) => x[0]))
console.log('slides', slides.length, 'broken', broken, 'overflow', overflow)
await pg.pdf({ path: path.join(OUT, 'SIMAKOOV-presentation.pdf'), width: '1920px', height: '1080px', printBackground: true, preferCSSPageSize: true })
// previews
for (let i = 0; i < slides.length; i++) {
  await pg.evaluate((i) => window.scrollTo(0, i * 1080), i)
  await pg.screenshot({ path: path.join(process.argv[2], `p${String(i + 1).padStart(2, '0')}.png`) })
}
await browser.close()
