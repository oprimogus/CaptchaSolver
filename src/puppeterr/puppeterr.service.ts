import { Injectable } from '@nestjs/common';
import {RecaptchaDto} from "./dto/recaptchaDto";
import puppeteer from "puppeteer";
import {Buffer} from "buffer";
import * as sharp from 'sharp';
import {createWorker} from "tesseract.js";
import {ImageCaptchaDto} from "./dto/imageCaptchaDto";
import {NormaliseOptions, ResizeOptions} from "sharp";
@Injectable()
export class PuppeterrService {

    private async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // async getCaptchaToSolve(captcha: RecaptchaDto) {
    //     const browser = await puppeteer.launch({ headless: false });
    //     const page = await browser.newPage();
    //     console.log('AQUI')
    //
    //     // Navegue até a página que contém o reCAPTCHA
    //     await page.goto(captcha.page);
    //     await this.sleep(3000)
    //
    //     // Espere pelo iframe do reCAPTCHA carregar
    //     const frames = page.frames();
    //     const recaptchaFrame = frames.find(f => f.url().includes('https://www.google.com/recaptcha/api2/anchor'));
    //
    //     if (!recaptchaFrame) {
    //         console.error('reCAPTCHA iframe not found.');
    //         await browser.close();
    //         return;
    //     }
    //
    //     // Aqui, você pode interagir com o iframe do reCAPTCHA, se necessário.
    //     // Por exemplo, você pode "clicar" no reCAPTCHA para iniciar o desafio:
    //
    //     const recaptchaCheckbox = await recaptchaFrame.$('.recaptcha-checkbox-border');
    //     if (recaptchaCheckbox) {
    //         await this.sleep(3000)
    //         console.log('CHEGUEI AQUI')
    //         await recaptchaCheckbox.click();
    //         await this.sleep(3000)
    //     } else {
    //         console.error('reCAPTCHA checkbox not found.');
    //     }
    //
    //     // const imageElements = await page.$$('.recaptcha-image');
    //     const element = await page.$$('.rc-imageselect-table-33');
    //
    //     if (element) {
    //         console.log('Elemento com a classe "rc-imageselect-table-33" encontrado!');
    //         const images = await page.$$eval('.rc-imageselect-table-33 tr > td > img', imgs => imgs.map(img => img.src))
    //         console.log(images.length)
    //         // Se você quiser fazer algo com esse elemento, você pode fazê-lo aqui.
    //         for (let i = 0; i < images.length; i++) {
    //             await images[i].screenshot({ path: `image${i}.png` });
    //         }
    //     } else {
    //         console.log('Elemento com a classe "rc-imageselect-table-33" não encontrado. Buscando outro elemento...');
    //
    //         // Substitua 'SELETOR_OUTRO_ELEMENTO' pelo seletor CSS do outro elemento que você quer buscar.
    //         const anotherElement = await page.$('rc-imageselect-table-44');
    //
    //         if (anotherElement) {
    //             console.log('Outro elemento encontrado!');
    //             // Se você quiser fazer algo com esse outro elemento, você pode fazê-lo aqui.
    //         } else {
    //             console.log('Outro elemento também não encontrado.');
    //         }
    //     }
    //
    //     // console.log(imageElements.length)
    //     // const challengeType = imageElements.length === 9 ? '3x3' : 'largerMatrix';
    //     //
    //     // if (challengeType === '3x3') {
    //     //     for (let i = 0; i < imageElements.length; i++) {
    //     //         await imageElements[i].screenshot({ path: `image${i}.png` });
    //     //     }
    //     // } else {
    //     //     throw new Error('Cpatcha largeMatrix')
    //     //
    //     // }
    //
    //
    //
    //
    //     // Adicione aqui outras interações necessárias com o CAPTCHA
    //
    //     await browser.close();
    // }

    async resolveImageCaptcha(captcha: ImageCaptchaDto) {
        const decodedBase64 = this.decodeBase64(captcha.image)
        const processedImage = await this.processImage(decodedBase64)
        return await this.readImageContent(processedImage)
    }

    private decodeBase64(base64: string): Buffer {
        return Buffer.from(base64, 'base64')
    }

    private async processImage (imageBuffer: Buffer): Promise<Buffer> {
        const resize: ResizeOptions = {
            width: 9000,
            height: 3000
        }
        const normalize: NormaliseOptions = {
            lower: 8,
            upper: 22
        }
        const options = {
            brightness: 1,
            saturation: 1,
            lightness: 1
        }
        // Processar a imageconst data = await worker.recognize(imageBuffer)m com sharp (por exemplo, redimensionar para 300x300)
        await sharp(imageBuffer)
            .resize(resize)
            .greyscale()
            .normalize(normalize)
            .gamma(1.7, 2.2)
            .modulate(options)
            // .greyscale()
            // .blur(5)
            // .gamma(1.7, 2.2)
            // .negate(false)
            // .normalize(normalize)
            .toFile('test.png')
        return sharp(imageBuffer)
            .resize(resize)
            .greyscale()
            .normalize(normalize)
            .gamma(1.7, 2.2)
            .modulate(options)
            // .blur(5)

            // .negate(false)
            .toBuffer()
    };

    private async readImageContent (imageBuffer: Buffer): Promise<string> {
        const worker = await createWorker();

        // await worker.load();
        // await worker.loadLanguage('eng');
        // await worker.initialize('eng');

        const data = await worker.recognize(imageBuffer)
        // const data = await worker.recognize(imageBuffer, {c})
        await worker.terminate();
        console.log(data)

        return data.data.text;
    };
}
