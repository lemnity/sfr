/**
 * Feedback form delivery settings.
 *
 * The form posts JSON to FormSubmit (https://formsubmit.co, no account or keys), which emails
 * the letter to safarovshow@yandex.ru and answers `{ success: "true" }`.
 * One-time activation: the very first submission is not forwarded — FormSubmit sends an
 * "Activate Form" letter to that inbox instead; click it (check Spam), then every request arrives.
 * After activation FormSubmit offers a random alias (https://formsubmit.co/ajax/<hash>) — put it
 * here instead of the address to keep the email out of the page code.
 */
export const feedbackEndpoint = 'https://formsubmit.co/ajax/safarovshow@yandex.ru'

/** Direct address shown as a fallback (mailto link) when sending fails. */
export const feedbackFallbackEmail = 'safarovshow@yandex.ru'

/** Abort the request after this many milliseconds. */
export const feedbackTimeoutMs = 25_000

/** Subject of the letter the owner receives (always Russian — it is read by the owner). */
export const feedbackSubject = (name: string) => `Заявка с сайта SAFAROFF — ${name}`
