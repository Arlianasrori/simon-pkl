import puppeteer from "puppeteer"
import fs from "fs"
import ejs from 'ejs'

(async () => {
    const html = fs.readFileSync("index.ejs",{encoding : "utf-8"})

    const browser = await puppeteer.launch({ headless: true});
    const page = await browser.newPage();
    await page.setContent(ejs.render(html,{}))
    const pdf = await page.pdf({ format : "a4",path : "pdf.pdf"});

  await browser.close();
})();