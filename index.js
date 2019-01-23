const puppeteerFirefox = require('puppeteer-firefox');
const url = 'https://chrome-devtools-frontend.appspot.com/serve_file/@15234034d19b85dcd9a03b164ae89d04145d8368/SupportedCSSProperties.js';
const puppeteerChrome = require('puppeteer');

Promise.all([supportedCSS(puppeteerFirefox), supportedCSS(puppeteerChrome)]).then(([firefox, chrome]) => {
    const chromeOnly = new Set(chrome);
    for (const x of firefox)
        chromeOnly.delete(x);
    console.log(Array.from(chromeOnly).join('\n'));
});
async function supportedCSS(puppeteer) {
    const browser = await puppeteer.launch();
    const page = (await browser.pages())[0];
    await page.goto(url);
    const css = await page.evaluate(() => {
        const code = document.body.textContent;
        const properties = JSON.parse(code.substring(code.indexOf('=') + 1, code.length - 1));
        const supported = [];
        for (const property of properties) {
            if (CSS.supports(property.name, 'inherit'))
                supported.push(property.name);
        }
        return supported;
    });
    await browser.close();
    return css;
}