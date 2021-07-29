'use strict';

const puppeteer = require('puppeteer');

const fetch = require('node-fetch');
const fs = require('fs')

// Extract all imageLinks from the page
async function extractImageLinks(){
    const browser = await puppeteer.launch({
        headless: false
    })

    const page = await browser.newPage()

    // Get the page url from the user
    let baseURL = process.argv[2] ? process.argv[2] : "https://magart.rochester.edu/objects-1/portfolio?records=20&query=Portfolios%3D%222070%22&page=6"

    try {
        await page.goto(baseURL, {waitUntil: 'networkidle0'})
        await page.waitForSelector('body')

        let imageBank = await page.evaluate(() => {
            let imgTags = Array.from(document.querySelectorAll('img'))

            let imageArray = []

            imgTags.map((image) => {
                let src = image.src

                let srcArray = src.split('/')
                let pos = srcArray.length - 1
                let filename = srcArray[pos]

                imageArray.push({
                    src,
                    filename
                })
            })

            return imageArray
        })

        await browser.close()
        return imageBank

    } catch (err) {
        console.log(err)
    }
}

(async function(){
    console.log("Downloading images...")

    let imageLinks = await extractImageLinks()

    imageLinks.map((image) => {
        let filename = `./images/${image.filename}`
        saveImageToDisk(image.src, filename)
    })

    console.log("Download complete, check the images folder")
})()

function saveImageToDisk(url, filename){
    fetch(url)
    .then(res => {
        const dest = fs.createWriteStream(filename);
        res.body.pipe(dest)
    })
    .catch((err) => {
        console.log(err)
    })
}