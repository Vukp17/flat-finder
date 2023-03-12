"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
(async () => {
    const browser = await puppeteer_1.default.launch();
    const page = await browser.newPage();
    const MAX_PAGES = 25;
    const MAX_APTS = 500;
    let numPages = 1;
    let numApts = 0;
    while (numPages <= MAX_PAGES && numApts < MAX_APTS) {
        await page.goto(`https://www.sreality.cz/en/search/for-sale/apartments?page=${numPages}`);
        await page.waitForSelector('.property.ng-scope');
        const apartmentElements = await page.$$('.property.ng-scope');
        for (const apartment of apartmentElements) {
            const name = await apartment.$eval('.name.ng-binding', el => el.textContent.trim());
            const locality = await apartment.$eval('.locality.ng-binding', el => el.textContent.trim());
            const price = await apartment.$eval('.norm-price.ng-binding', el => el.textContent.trim());
            const imageElements = await apartment.$$('._15Md1MuBeW62jbm5iL0XqR._1sm7uHIebD7tngzBEQy3dD img');
            const images = await Promise.all(imageElements.map(async (img) => {
                const src = await img.getProperty('src');
                return src.jsonValue();
            }));
            const apartmentData = {
                name,
                locality,
                price,
                images,
            };
            console.log(apartmentData);
            numApts++;
            if (numApts >= MAX_APTS)
                break;
        }
        numPages++;
    }
    await browser.close();
})();
