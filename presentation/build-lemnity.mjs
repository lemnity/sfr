// Lemnity edition of the sales deck: same structure as build.mjs, studio voice ("мы"),
// Lemnity brand (blue #1F55D5, light pages). Renders presentation/Lemnity-presentation.pdf.
// Needs playwright installed where you run it: node build-lemnity.mjs <preview-dir>
import fs from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright'

const R = '/Users/thesimakov/Documents/GitHub/smkv'
const OUT = path.join(R, 'presentation')
const rel = (p) => path.relative(OUT, path.join(R, p))
const LOGO = rel('public/clients/lemnity.svg') // white artwork; darkened with a filter on light pages

const clients = [...fs.readFileSync(path.join(R, 'src/data/clients.ts'), 'utf8').matchAll(/name: '([^']+)', src: `\$\{BASE\}([^`]+)`(.*?)\}/g)]
  .map((m) => ({ name: m[1], src: rel('public/' + m[2]), keepColor: /filter/.test(m[3]) }))
  .filter((c) => c.name !== 'Lemnity')

const work = (n, full = true) => rel(`public/works/work-${String(n).padStart(2, '0')}${full ? '-full' : ''}.webp`)
const logo = (h, light = false) => `<img class="logo ${light ? 'on-blue' : ''}" src="${LOGO}" style="height:${h}px" alt="Lemnity">`

let page = 0
const TOTAL = 12
const chrome = (label) => {
  page++
  return `<header class="top">${logo(24)}<span class="lbl">${String(page).padStart(2, '0')} / ${label}</span></header>
  <footer class="bot"><span>lemnity.ru</span><span>${String(page).padStart(2, '0')} / ${String(TOTAL).padStart(2, '0')}</span></footer>`
}
const slides = []

// 1. Cover (brand blue)
page++
slides.push(`<section class="slide blue cover">
  <div class="cover-body">
    ${logo(64, true)}
    <p class="eyebrow on-blue-eyebrow" style="margin-top:130px">Студия цифровых продуктов · Сайты · UI/UX · Бренды</p>
    <h1 class="mega">Делаем<br>сложное<br><span class="soft">простым.</span></h1>
    <p class="lead on-blue-lead" style="max-width:640px">Создаём сайты, интерфейсы, бренды и цифровые продукты, которые помогают людям и бизнесу расти.</p>
  </div>
  <div class="cover-shot"><img src="img/lemnity.jpg" alt=""></div>
  <footer class="bot on-blue-bot"><span>Lemnity · Тюмень · работаем по всему миру</span><span>lemnity.ru</span></footer>
</section>`)

// 2. About
slides.push(`<section class="slide">
  ${chrome('О нас')}
  <div class="grid2" style="grid-template-columns: 1fr 1.05fr">
    <div>
      <h2 class="h2">Студия<br>и платформа</h2>
      <p class="lead" style="margin-top:44px;max-width:660px">Lemnity — студия цифровых продуктов и собственная платформа для создания сайтов, чат-ботов и цифровых продуктов. 12+ лет опыта в дизайне, продуктовой разработке и визуальных коммуникациях.</p>
      <p class="quote">«Хороший дизайн делает сложное понятным, а&nbsp;возможное&nbsp;— ближе.»</p>
    </div>
    <div class="stats">
      <div class="stat"><b>12+</b><span>лет опыта</span></div>
      <div class="stat"><b>50+</b><span>проектов</span></div>
      <div class="stat"><b>3</b><span>страны</span></div>
      <div class="stat"><b class="accent">∞</b><span>идей в работе</span></div>
    </div>
  </div>
</section>`)

// 3. Services
const services = [
  ['Разработка сайтов и веб-приложений', 'Сайты и сервисы, которые быстро загружаются и понятны с первого экрана. Дизайн и код в одних руках — без разрыва между макетом и результатом.', ['корпоративный сайт или сервис', 'адаптив для телефона и компьютера', 'личные кабинеты и формы']],
  ['UI/UX-дизайн интерфейсов', 'Интерфейсы, в которых пользователь не думает, куда нажать: от сценариев и структуры до макетов и прототипа.', ['сценарии и структура', 'кликабельный прототип', 'дизайн-система и UI-кит']],
  ['Лендинги и интернет-магазины', 'Страницы, которые ведут к одному действию, и магазины, где удобно выбирать и покупать.', ['лендинг или многостраничный сайт', 'каталог и корзина', 'формы заявок']],
  ['Брендинг и айдентика', 'Цельный бренд — от логотипа до сайта и мерча, собранный в понятные правила для команды.', ['логотип и знак', 'цвета, шрифты, стиль', 'носители, мерч и гайд']],
  ['Цифровой продукт и MVP', 'От гипотезы и прототипа до первой версии. Знаем, что важно на старте, а что можно отложить — сами строим свою платформу.', ['состав первой версии', 'дизайн и разработка MVP', 'запуск и развитие']],
]
slides.push(`<section class="slide">
  ${chrome('Услуги')}
  <div class="head"><h2 class="h2">Что мы делаем</h2><p class="muted">Сайты, интерфейсы, бренды и цифровые продукты — от идеи до запуска.</p></div>
  <div class="cards5">${services
    .map(([t, d, list], i) => `<article class="card"><span class="num">${String(i + 1).padStart(2, '0')}</span><h3>${t}</h3><p>${d}</p><ul>${list.map((x) => `<li>${x}</li>`).join('')}</ul></article>`)
    .join('')}</div>
</section>`)

// 4. Process
const steps = [
  ['Знакомство и задача', 'Обсуждаем задачу, аудиторию и сроки. Честно говорим, что реально, а что лучше убрать.'],
  ['Структура и концепция', 'Собираем структуру, сценарии и первую концепцию. Согласуем направление до детальной работы.'],
  ['Дизайн и прототип', 'Макеты и кликабельный прототип — правки на раннем этапе, а не в конце.'],
  ['Разработка', 'Верстаем и программируем. Промежуточные версии показываем по ходу.'],
  ['Запуск и поддержка', 'Проверяем на разных устройствах, запускаем и остаёмся на связи для доработок.'],
]
slides.push(`<section class="slide">
  ${chrome('Процесс')}
  <div class="head"><h2 class="h2">Как мы работаем</h2><p class="muted">Прозрачно, по этапам и с видимым результатом на каждом шаге.</p></div>
  <ol class="steps">${steps.map(([t, d], i) => `<li><span class="stepnum">${String(i + 1).padStart(2, '0')}</span><h3>${t}</h3><p>${d}</p></li>`).join('')}</ol>
  <div class="why">
    <div><b>Один ответственный</b><span>дизайн, разработка и организация процесса — без испорченного телефона</span></div>
    <div><b>Удалённо по всему миру</b><span>Тюмень, разные города и страны; общаемся в удобном мессенджере</span></div>
    <div><b>Поддержка после запуска</b><span>исправляем, дорабатываем и развиваем проект дальше</span></div>
  </div>
</section>`)

// 5. Own product
slides.push(`<section class="slide soft-bg">
  ${chrome('Наш продукт')}
  <div class="flag">
    <div>
      <span class="pill">Наш продукт</span>
      <img class="flag-logo" src="${LOGO}" alt="Lemnity">
      <p class="lead">Платформа для создания сайтов, чат-ботов и цифровых продуктов: сайт, виджеты, чат, бот с оплатами, заявки и аналитика — в одном окне.</p>
      <p class="tags">#SaaS &nbsp; #Конструктор &nbsp; #AI &nbsp; #Продукт</p>
      <p class="link">lemnity.ru</p>
    </div>
    <div class="shot shot-xl"><img src="img/lemnity.jpg" alt=""></div>
  </div>
</section>`)

// 6–7. Client projects
const proj = [
  ['Дом науки и техники', 'Образовательная платформа для профессионалов: семинары, курсы и вебинары.', '#Образование #Сайт #Гос.&nbsp;сектор', 'web.tumtipb.ru', 'img/dom-nauki.jpg'],
  ['ProStyle', 'Корпоративные подарки и сувенирная продукция с логотипом, Тюмень. Интернет-магазин с каталогом.', '#Бренд #Интернет-магазин #Дизайн', 'prostyle.agency', 'img/prostyle.jpg'],
  ['Sphagnum AE', 'Живые субстраты для зелёных крыш, вертикальных садов и интерьеров. B2B-сайт для рынка ОАЭ.', '#Сайт #Эко #B2B', 'lemnity.github.io/sphgnm', 'img/sphagnum.jpg'],
  ['Модный театр TURDUS', 'Иммерсивные спектакли в барах, ресторанах, квартире и на улицах Екатеринбурга. Афиша и продажа билетов.', '#Сайт #Афиша #Театр', 'lemnity.github.io/trds', 'img/turdus.jpg'],
]
for (const pair of [proj.slice(0, 2), proj.slice(2, 4)]) {
  slides.push(`<section class="slide">
  ${chrome('Проекты')}
  <div class="head"><h2 class="h2">Проекты студии</h2><p class="muted">Продукты, бренды и цифровые решения, которые делают идеи реальностью.</p></div>
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
  ['Брендинг и мерч', 'Айдентика, полиграфия и мерч — то, что держат в руках.', [[1, 'a'], [4, 'b'], [5, 'c'], [2, 'd'], [12, 'e'], [9, 'f'], [15, 'g'], [19, 'h']]],
  ['Интерфейсы и сайты', 'Сервисы, приложения и сайты — то, чем пользуются каждый день.', [[10, 'a'], [35, 'b'], [25, 'c'], [28, 'd'], [40, 'e'], [46, 'f'], [20, 'g'], [3, 'h']]],
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
  <div class="head"><h2 class="h2">Нам доверяют</h2><p class="muted">Компании и команды, с которыми мы запускали бренды, сайты и продукты.</p></div>
  <div class="logos">${clients
    .map((c) => `<div class="logo-cell"><img src="${c.src}" alt="${c.name}" class="${c.keepColor ? 'keep' : ''}"></div>`)
    .join('')}<div class="logo-cell more">и другие</div></div>
</section>`)

// 11. Portfolio mosaic
slides.push(`<section class="slide">
  ${chrome('Портфолио')}
  <div class="head"><h2 class="h2">46 работ в портфолио</h2><p class="muted">Полная галерея работ — на simakoov.ru в разделе «Работы».</p></div>
  <div class="mosaic">${[6, 34, 23, 27, 11, 16, 21, 13, 24, 31, 37, 42].map((n) => `<div class="tile"><img src="${work(n, false)}" alt=""></div>`).join('')}</div>
</section>`)

// 12. Contacts (brand blue)
page++
slides.push(`<section class="slide blue cover">
  <div class="cover-body">
    ${logo(64, true)}
    <h2 class="mega" style="margin-top:110px;font-size:124px;white-space:nowrap">Давайте<br>создадим что&#8209;то<br><span class="soft">вместе.</span></h2>
    <div class="contacts">
      <div><span>Почта</span><b>thesimakov@gmail.com</b></div>
      <div><span>Telegram</span><b>t.me/simakoov</b></div>
      <div><span>Сайт</span><b>lemnity.ru</b></div>
    </div>
  </div>
  <footer class="bot on-blue-bot"><span>Lemnity · студия цифровых продуктов</span><span>${String(page).padStart(2, '0')} / ${String(TOTAL).padStart(2, '0')}</span></footer>
</section>`)

if (page !== TOTAL) throw new Error(`page count ${page} != ${TOTAL}`)

const font = (w, f) => `@font-face{font-family:Gilroy;font-weight:${w};src:url(${rel('public/fonts/gilroy-' + f + '.woff2')}) format('woff2')}`
const css = `
${font(400, 'regular')}${font(500, 'medium')}${font(600, 'semibold')}${font(700, 'bold')}${font(900, 'heavy')}
:root{--bg:#fafbff;--soft:#eef3fd;--card:#ffffff;--text:#14161b;--muted:#6b7280;--line:rgba(16,24,40,.1);--blue:#1f55d5;--blue-soft:#c9d6ff}
@page{size:1920px 1080px;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:var(--bg)}
body{font-family:Gilroy,system-ui,sans-serif;color:var(--text);-webkit-print-color-adjust:exact;print-color-adjust:exact}
.slide{position:relative;width:1920px;height:1080px;padding:150px 120px 120px;overflow:hidden;page-break-after:always;break-after:page;background:var(--bg)}
.soft-bg{background:var(--soft)}
.top{position:absolute;top:54px;left:120px;right:120px;display:flex;justify-content:space-between;align-items:center}
.logo{display:block;width:auto;filter:brightness(0)}
.logo.on-blue{filter:none}
.lbl,.bot{font-size:14px;letter-spacing:.22em;text-transform:uppercase;color:var(--muted)}
.bot{position:absolute;left:120px;right:120px;bottom:52px;display:flex;justify-content:space-between;border-top:1px solid var(--line);padding-top:22px}
.accent{color:var(--blue)}
.muted{color:var(--muted);font-size:22px;line-height:1.5;max-width:520px}
.eyebrow{font-size:15px;letter-spacing:.26em;text-transform:uppercase;font-weight:500}
.mega{font-weight:400;font-size:150px;line-height:.95;letter-spacing:-.045em;margin-top:28px}
.h2{font-weight:400;font-size:92px;line-height:1;letter-spacing:-.04em}
.lead{font-size:28px;line-height:1.5;color:#3b3f48;margin-top:40px}
.head{display:flex;justify-content:space-between;align-items:flex-end;gap:60px;margin-bottom:56px}
.grid2{display:grid;gap:100px;align-items:center;height:100%}
/* blue cover + contacts */
.blue{background:var(--blue);color:#fff}
.blue .cover-body{position:relative;z-index:2;max-width:980px}
.cover{padding:110px 120px}
.soft{color:var(--blue-soft)}
.on-blue-eyebrow{color:var(--blue-soft)}
.on-blue-lead{color:rgba(255,255,255,.82)}
.on-blue-bot{color:rgba(255,255,255,.7);border-top-color:rgba(255,255,255,.22)}
.cover-shot{position:absolute;right:-140px;top:190px;width:1100px;aspect-ratio:16/10;border-radius:18px;overflow:hidden;
  transform:perspective(2200px) rotateY(-14deg) rotateX(4deg);box-shadow:0 80px 160px -40px rgba(0,0,0,.45);border:1px solid rgba(255,255,255,.25)}
.cover-shot img{width:100%;height:100%;object-fit:cover;object-position:top;display:block}
/* about */
.stats{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.stat{padding:52px 46px;background:var(--card);border:1px solid var(--line);border-radius:16px}
.stat b{display:block;font-size:116px;font-weight:400;line-height:1;letter-spacing:-.04em}
.stat span{display:block;margin-top:18px;font-size:16px;letter-spacing:.22em;text-transform:uppercase;color:var(--muted)}
.quote{margin-top:64px;font-size:40px;line-height:1.25;font-weight:600;letter-spacing:-.02em;padding-left:28px;border-left:3px solid var(--blue);max-width:680px}
/* services */
.cards5{display:grid;grid-template-columns:repeat(5,1fr);gap:20px}
.card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:34px 30px;height:640px;display:flex;flex-direction:column;box-shadow:0 20px 40px -30px rgba(31,85,213,.25)}
.num{font-size:16px;letter-spacing:.2em;color:var(--blue);font-weight:600}
.card h3{font-size:30px;font-weight:500;line-height:1.15;margin-top:26px;letter-spacing:-.01em}
.card p{font-size:18px;line-height:1.55;color:var(--muted);margin-top:20px}
.card ul{list-style:none;margin-top:auto}
.card li{font-size:17px;line-height:1.4;padding:12px 0;border-top:1px solid var(--line)}
.card li::before{content:'— ';color:var(--blue)}
/* process */
.steps{list-style:none;display:grid;grid-template-columns:repeat(5,1fr);gap:20px}
.steps li{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:32px 28px;min-height:330px}
.stepnum{font-size:56px;font-weight:400;color:var(--blue);letter-spacing:-.03em}
.steps h3{font-size:26px;font-weight:500;margin-top:30px;line-height:1.2}
.steps p{font-size:18px;line-height:1.55;color:var(--muted);margin-top:16px}
.why{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:40px}
.why div{border-top:2px solid var(--blue);padding-top:22px}
.why b{display:block;font-size:26px;font-weight:600}
.why span{display:block;margin-top:10px;font-size:18px;line-height:1.5;color:var(--muted)}
/* own product */
.flag{display:grid;grid-template-columns:.8fr 1.4fr;gap:80px;align-items:center;height:100%}
.pill{display:inline-block;background:var(--blue);color:#fff;font-weight:600;font-size:14px;letter-spacing:.22em;text-transform:uppercase;padding:9px 18px;border-radius:999px}
.flag-logo{display:block;height:110px;margin-top:44px;filter:brightness(0)}
.tags{font-size:18px;color:var(--muted);margin-top:26px;letter-spacing:.02em}
.link{font-size:20px;color:var(--blue);margin-top:30px;letter-spacing:.04em;font-weight:500}
.shot{border-radius:16px;overflow:hidden;border:1px solid var(--line);background:#fff}
.shot img{display:block;width:100%;height:100%;object-fit:cover;object-position:top}
.shot-xl{aspect-ratio:16/10;box-shadow:0 60px 120px -50px rgba(31,85,213,.45)}
/* projects */
.pair{display:grid;grid-template-columns:1fr 1fr;gap:40px}
.pcard .shot{aspect-ratio:16/9;box-shadow:0 30px 60px -40px rgba(16,24,40,.35)}
.pmeta{display:flex;justify-content:space-between;gap:30px;margin-top:22px}
.pmeta h3{font-size:36px;font-weight:500;letter-spacing:-.02em}
.pmeta p{font-size:19px;line-height:1.45;color:#3b3f48;margin-top:8px;max-width:620px}
.pmeta .tags{font-size:16px;color:var(--muted)}
.pmeta .link,.soon{white-space:nowrap;font-size:16px;letter-spacing:.06em;margin-top:14px}
.soon{color:var(--blue);border:1px solid rgba(31,85,213,.4);border-radius:999px;padding:8px 16px;height:max-content;text-transform:uppercase;letter-spacing:.2em;font-size:13px}
/* gallery */
.bento{display:grid;gap:16px;height:640px;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(3,1fr);grid-template-areas:"a a b c" "a a d e" "f g h h"}
.tile{border-radius:14px;overflow:hidden;background:#fff;border:1px solid var(--line)}
.tile img{width:100%;height:100%;object-fit:cover;object-position:top;display:block}
.mosaic{display:grid;grid-template-columns:repeat(6,1fr);grid-template-rows:repeat(2,310px);gap:16px}
/* clients */
.logos{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.logo-cell{height:190px;display:grid;place-items:center;background:var(--card);border:1px solid var(--line);border-radius:16px}
.logo-cell img{max-width:62%;max-height:70px;filter:brightness(0);opacity:.78}
.logo-cell img.keep{filter:grayscale(1) contrast(1.2)}
.logo-cell.more{font-size:20px;letter-spacing:.2em;text-transform:uppercase;color:var(--muted)}
/* contacts */
.contacts{display:grid;grid-template-columns:repeat(3,auto);gap:70px;margin-top:60px;justify-content:start}
.contacts span{display:block;font-size:15px;letter-spacing:.24em;text-transform:uppercase;color:var(--blue-soft)}
.contacts b{display:block;font-size:34px;font-weight:500;margin-top:14px}
`

const html = `<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>Lemnity — презентация</title><style>${css}</style></head><body>${slides.join('\n')}</body></html>`
fs.writeFileSync(path.join(OUT, 'deck-lemnity.html'), html)

const browser = await chromium.launch()
const pg = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
await pg.goto('file://' + path.join(OUT, 'deck-lemnity.html'), { waitUntil: 'load' })
await pg.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r })))) })
const broken = await pg.evaluate(() => [...document.images].filter((i) => !i.naturalWidth).map((i) => i.getAttribute('src')))
const overflow = await pg.evaluate(() => [...document.querySelectorAll('.slide')].map((s, i) => [i + 1, s.scrollHeight > s.clientHeight + 2 || s.scrollWidth > s.clientWidth + 2]).filter((x) => x[1]).map((x) => x[0]))
console.log('slides', slides.length, 'broken', broken, 'overflow', overflow)
await pg.pdf({ path: path.join(OUT, 'Lemnity-presentation.pdf'), width: '1920px', height: '1080px', printBackground: true, preferCSSPageSize: true })
const prev = process.argv[2]
if (prev) {
  for (let i = 0; i < slides.length; i++) {
    await pg.evaluate((i) => window.scrollTo(0, i * 1080), i)
    await pg.screenshot({ path: path.join(prev, `l${String(i + 1).padStart(2, '0')}.png`) })
  }
}
await browser.close()
