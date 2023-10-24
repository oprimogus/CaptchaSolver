import { CaptchaType } from "./CaptchaType";

export type RecaptchaDto = {
    type: CaptchaType,
    page: string
    siteKey: string
}