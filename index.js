
import { ADMIN_USERNAME, ADMIN_PASSWORD } from './secrets.js'
import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import { executablePath } from 'puppeteer'
import dotenv from 'dotenv'
import fs from 'fs'
import { log } from 'console'

dotenv.config({
    path: '/.env'
})
puppeteer.use(StealthPlugin())

// const url = `https://bot.sannysoft.com/`                 // this was used for taking screenshot
const url = `https://quotes.toscrape.com/`
;(async () => {
    const browser = await puppeteer.launch({headless: 'new', executablePath: executablePath()})
    const page = await browser.newPage()
    await page.goto(url)
    // await page.screenshot({path: 'public/temp/after.png', fullPage: true })

    // logging in 
    await page.click('.col-md-4 a')
    await page.type('#username', ADMIN_USERNAME)
    await page.type('#password', 'ADMIN_PASSWORD')
    await page.click('[type=submit]')
    console.log('Login successful..')

    const content = await page.evaluate(() => Array.from(document.querySelectorAll('.quote'), (e) =>({
        quote: e.querySelector('.text').innerText.trim(),
        author: e.querySelector('.author').innerText.trim()
    })))
    console.log('Scraping completed');

    fs.writeFile('files/quotes.json', JSON.stringify(content), (error) => {
        if(error) throw error
        log('File saved')
    })

    await browser.close()
})()