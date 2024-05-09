import puppeteer from "puppeteer";
import generateId from "./generateIdUtils.js";
import ejs from "ejs"

export async function generatePdf (content,data,jenis) {
  const browser = await puppeteer.launch({ headless: true});
  const page = await browser.newPage();
  await page.setContent(ejs.render(content,data))
  await page.pdf({ format : "a4",path : `public/absen_pdf/analisis/${generateId()}-${jenis}.pdf`});

  await browser.close();
}