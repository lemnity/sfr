import type { Lang } from './content'
import { contacts } from './content'

/**
 * Privacy policy shown in a dialog from the feedback form (consent checkbox).
 * TEMPLATE: before relying on it legally, add the operator's legal details (full name / company,
 * INN/OGRN, postal address) — see `operator` below — and have a lawyer check it.
 */
export interface PrivacyCopy {
  title: string
  updated: string
  closeLabel: string
  sections: { heading: string; paragraphs: string[] }[]
}

const email = contacts.email
const operator = 'SAFAROFF'

const ru: PrivacyCopy = {
  title: 'Политика конфиденциальности',
  updated: 'Редакция от 20 ноября 2026 г.',
  closeLabel: 'Закрыть политику',
  sections: [
    {
      heading: '1. Общие положения',
      paragraphs: [
        `Настоящая политика описывает, как digital-агентство ${operator} (далее — «мы», оператор) обрабатывает персональные данные посетителей сайта safaroff.agency в соответствии с Федеральным законом № 152-ФЗ «О персональных данных».`,
        'Отправляя форму на сайте и отмечая соответствующий чекбокс, вы даёте согласие на обработку своих персональных данных на условиях этой политики.',
      ],
    },
    {
      heading: '2. Какие данные мы обрабатываем',
      paragraphs: [
        'Имя; email или ник/ссылку Telegram; текст сообщения и выбранные темы; язык и адрес страницы, с которой отправлена форма; отметки о согласиях (рассылка, NDA, связь по телефону/в мессенджере).',
      ],
    },
    {
      heading: '3. Цели обработки',
      paragraphs: [
        'Ответ на ваше обращение, обсуждение и подготовка коммерческого предложения, заключение и исполнение договора.',
        'Отправка рассылки — только если вы отдельно отметили согласие на неё.',
      ],
    },
    {
      heading: '4. Как мы обрабатываем данные',
      paragraphs: [
        'Данные из формы передаются на нашу почту через сервис отправки форм FormSubmit и хранятся в почтовом ящике оператора. Мы не продаём данные и не передаём их третьим лицам, кроме случаев, предусмотренных законом.',
        'Данные хранятся до достижения целей обработки или до отзыва согласия, но не дольше 3 лет с момента последнего обращения.',
      ],
    },
    {
      heading: '5. Ваши права',
      paragraphs: [
        `Вы можете запросить сведения о своих данных, потребовать их уточнения или удаления, отозвать согласие на обработку или отписаться от рассылки — напишите на ${email}. Мы ответим в течение 10 рабочих дней.`,
      ],
    },
    {
      heading: '6. Контакты оператора',
      paragraphs: [`${operator}, email: ${email}.`],
    },
  ],
}

const en: PrivacyCopy = {
  title: 'Privacy Policy',
  updated: 'Version of 20 November 2026',
  closeLabel: 'Close the policy',
  sections: [
    {
      heading: '1. General',
      paragraphs: [
        `This policy explains how the digital agency ${operator} ("we", the controller) processes the personal data of visitors to safaroff.agency.`,
        'By submitting the form and ticking the corresponding checkbox, you consent to the processing of your personal data under this policy.',
      ],
    },
    {
      heading: '2. Data we process',
      paragraphs: [
        'Name; email or Telegram handle/link; message text and selected topics; language and the page the form was sent from; your consent choices (newsletter, NDA, phone/messenger contact).',
      ],
    },
    {
      heading: '3. Purposes',
      paragraphs: [
        'Replying to your request, discussing and preparing a proposal, concluding and performing a contract.',
        'Sending the newsletter — only if you separately opted in.',
      ],
    },
    {
      heading: '4. How we process data',
      paragraphs: [
        'Form data is delivered to our mailbox via the FormSubmit form service and stored there. We do not sell your data or share it with third parties except where required by law.',
        'Data is kept until the purposes are achieved or consent is withdrawn, and no longer than 3 years after your last request.',
      ],
    },
    {
      heading: '5. Your rights',
      paragraphs: [
        `You can request access to your data, ask us to correct or delete it, withdraw consent or unsubscribe from the newsletter — write to ${email}. We reply within 10 business days.`,
      ],
    },
    {
      heading: '6. Contact',
      paragraphs: [`${operator}, email: ${email}.`],
    },
  ],
}

const tg: PrivacyCopy = {
  title: 'Сиёсати махфият',
  updated: 'Таҳрир аз 20 ноябри соли 2026',
  closeLabel: 'Пӯшидани сиёсат',
  sections: [
    {
      heading: '1. Муқаррароти умумӣ',
      paragraphs: [
        `Ин сиёсат шарҳ медиҳад, ки агентии рақамии ${operator} («мо», оператор) маълумоти шахсии меҳмонони сайти safaroff.agency-ро чӣ тавр коркард мекунад.`,
        'Бо фиристодани шакл ва қайд кардани чекбокси дахлдор шумо ба коркарди маълумоти шахсии худ тибқи ин сиёсат розигӣ медиҳед.',
      ],
    },
    {
      heading: '2. Кадом маълумотро коркард мекунем',
      paragraphs: [
        'Ном; email ё ник/истиноди Telegram; матни паём ва мавзӯъҳои интихобшуда; забон ва саҳифае, ки аз он шакл фиристода шудааст; розигиҳои шумо (хабарнома, NDA, тамос тавассути телефон/мессенҷер).',
      ],
    },
    {
      heading: '3. Мақсадҳои коркард',
      paragraphs: [
        'Ҷавоб ба муроҷиати шумо, муҳокима ва омода кардани пешниҳод, бастан ва иҷрои шартнома.',
        'Фиристодани хабарнома — танҳо агар шумо ба он алоҳида розигӣ дода бошед.',
      ],
    },
    {
      heading: '4. Чӣ тавр коркард мекунем',
      paragraphs: [
        'Маълумоти шакл тавассути хизматрасонии FormSubmit ба почтаи мо мерасад ва дар он ҷо нигоҳ дошта мешавад. Мо маълумотро намефурӯшем ва ба шахсони сеюм намедиҳем, ба истиснои ҳолатҳои пешбининамудаи қонун.',
        'Маълумот то ноил шудан ба мақсадҳо ё бозхонди розигӣ нигоҳ дошта мешавад, вале на бештар аз 3 сол пас аз муроҷиати охирин.',
      ],
    },
    {
      heading: '5. Ҳуқуқҳои шумо',
      paragraphs: [
        `Шумо метавонед дар бораи маълумоти худ маълумот талаб кунед, ислоҳ ё нест кардани онро талаб намоед, розигиро бозхонед ё аз хабарнома даст кашед — ба ${email} нависед. Мо дар давоми 10 рӯзи корӣ ҷавоб медиҳем.`,
      ],
    },
    {
      heading: '6. Тамос бо оператор',
      paragraphs: [`${operator}, email: ${email}.`],
    },
  ],
}

export const privacy: Record<Lang, PrivacyCopy> = { ru, en, tg }
