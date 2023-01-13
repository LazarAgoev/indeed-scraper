import fs from "fs"

import scrape from './eachPage.js'
import convert from "./converter.js";
import puppeteer from "puppeteer"

//const fs = require('fs')
//const cheerio = require('cheerio');
//const puppeteer = require('puppeteer');


const options = {
    args: ['--start-maximized', 'disable-gpu', '--disable-infobars', '--disable-extensions', '--ignore-certificate-errors'],
    headless: false,
    ignoreDefaultArgs: ['--enable-automation'],
    defaultViewport: null,
  };

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getData(fullLink, browser){
    let data = await scrape(fullLink, browser);       // or await scrape(fullLink, browser)
    data = await convert(data);
    
    fs.writeFile('json\\indeed_'+data.inventory.jobID+'.json', JSON.stringify(data), (err) => {
        if (err) throw err;
    });
    
    //console.log(data)

}

export async function getJobs(str, browser, num_jobs){
    const page = await browser.newPage()
    await page.goto(str);
    
    let Links = await page.$$(".jcs-JobTitle.css-jspxzf.eu4oa1w0")
    let numLinks = Links.length //number of jobs, not used anymore
    let prefix = 'https://www.indeed.com'

    //reads information from each job

    for (let i = 0; i < num_jobs; i++) {
        const elements = await page.evaluateHandle((i) => document.getElementsByClassName("jcs-JobTitle css-jspxzf eu4oa1w0")[i],i);
        const resultHandle = await page.evaluateHandle(elements => elements.getAttribute("href"), elements);
        let link = await resultHandle.jsonValue();
        let fullLink = prefix+link

        await sleep(2 * 1000);
        
        getData(fullLink, browser);

    
    
    }

    //console.log("done with getPages")
    //await page.close();
    //await browser.close();
}




export default getJobs