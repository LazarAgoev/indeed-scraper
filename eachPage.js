import fs from "fs"

import cheerio from "cheerio"
import puppeteer from "puppeteer"
import convert from "./converter.js";

const options = {
    args: ['--start-maximized', 'disable-gpu', '--disable-infobars', '--disable-extensions', '--ignore-certificate-errors'],
    headless: false,
    ignoreDefaultArgs: ['--enable-automation'],
    defaultViewport: null,
  };

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function scrape(fullLink, browser){
    
    //const browser = await puppeteer.launch(options)
    const page = await browser.newPage()

    await page.goto(fullLink, {
        waitUntil: "domcontentloaded",
      });


    await sleep(2*1000)
    
    const content = await page.content()
    let data = {
        inventory: {
            jobID: null,
            posted: null, 
            searchOrigin: fullLink
        },
        origin_title: null, 
        job_info: {
            companyName: null,
            locations: []
        },
        remote: null,
        visa: null,
        citizenship: null,
        clearence: null,
        education_req: {
            degree: null,
            major: null
        },
        skills: [],
        job_type: [],
        compensation: {
            salary: [],
            benefits: {
                other: [],
                _401K: 0,
                _401K_matching: 0,
                PTO: 0,
                insurance: {
                    health: 0,
                    dental: 0,
                    vision: 0,
                    life: 0
                }
            }

        },
        job_description: null

    }

    const $ = cheerio.load(content.toString())

    
    //title
    let title = $(".icl-u-xs-mb--xs.icl-u-xs-mt--none.jobsearch-JobInfoHeader-title")
    data.origin_title = title.text()

    //company name
    let company =$("a", ".jobsearch-InlineCompanyRating-companyHeader" ).last()
    data.job_info.companyName= company.text()
    //company location
    let companyLoc = $('div.icl-u-xs-mt--xs.icl-u-textColor--secondary.jobsearch-JobInfoHeader-subtitle.jobsearch-DesktopStickyContainer-subtitle').children()
        companyLoc.each((index, location)=>{
        if(index > 0)
            data.job_info.locations.push($(location).text())
    });
    //company website, not used
    /*
    let button = $(".icl-Button.icl-Button--primary.icl-Button--lg.icl-Button--block.jobsearch-CallToApply-applyButton-newDesign.icon-flipped","#applyButtonLinkContainer")
    data.company.site = button.attr('href')
    */
    
    //rating not used
    /*
    let rating = $('div.icl-Ratings-starsCountWrapper')
    data.rating = rating.attr('aria-label')
    */
    
    //jobDetails
    let details = $('.jobsearch-JobDescriptionSection-sectionItem','#jobDetailsSection')
    details.each((_, detail) => {
        let item = $(detail).children()

        let bold = $(".jobsearch-JobDescriptionSection-sectionItemKey.icl-u-textBold", detail).text().toLowerCase()

        if( bold === "salary" ){
            item.each((index, info)=>{
                if ( index === 0 ){}
                else{
                    data.compensation.salary.push($(info).text())
                }
            });  
        }
        //not used
        /*
        else if( bold === "shift & schedule"){
            item.each((index, info)=>{
                if ( index === 0 ){}
                else{
                    data.jobDetails.schedule.push($(info).text())
                }
            });  
        }
        */
        else if( bold === "job type" ){
            item.each((index, info)=>{
                if ( index === 0 ){}
                else{
                    data.job_type.push($(info).text())
                }
            });  
        }
        //not used
        /*
        else{
            item.each((index, info)=>{
                    data.jobDetails.extra.push($(info).text())

            });  
        }
        */

    });

    //requirements
    let qualiffications = $(".icl-u-xs-my--none.jobsearch-ReqAndQualSection-item--closedBullets").children()
    qualiffications.each((_,element)=>{
        data.skills.push($(element).text())
    });

    //benefits
    let benefits = $(".css-tvvxwd.ecydgvn1","#benefits")
    benefits.each((_,element)=>{
        data.compensation.benefits.other.push($(element).text())
    });

    //salaryInfo
    let salary = $('ul', "#salaryGuide").children()
    salary.each((index, element)=>{
        data.compensation.salary.push($(element).text())
    });

    //job Description
    let descr =  $("#jobDescriptionText")
    
    //not used
    /*
    let bold = $('b',descr)
    bold.each((_,element)=>{
        data.jobDescription.bold.push($(element).text())
    });

    let italic = $('i',descr)
    italic.each((_,element)=>{
        data.jobDescription.italic.push($(element).text())
    });

    let underline = $('u',descr)
    underline.each((_,element)=>{
        data.jobDescription.underline.push($(element).text())
    });
    */
    let descrText = descr.html()

    



    //descrText = descrText.replaceAll('<div>', '')
    //descrText = descrText.replaceAll('</div>', '')
    //descrText = descrText.replaceAll('<p>', '')
    //descrText = descrText.replaceAll('</p>', '')
    //descrText = descrText.replaceAll('<b>', '')
    //descrText = descrText.replaceAll('</b>', '')
    //descrText = descrText.replaceAll('<ul>', '')
    //descrText = descrText.replaceAll('</ul>', '')
    //descrText = descrText.replaceAll('<li>', '')
    //descrText = descrText.replaceAll('</li>', '')
    //descrText = descrText.replaceAll('<i>', '')
    //descrText = descrText.replaceAll('</i>', '')
    //descrText = descrText.replaceAll('<u>', '')
    //descrText = descrText.replaceAll('</u>', '')
    //descrText = descrText.replaceAll('<br>', '\n')

    
    data.job_description = descrText

    //hiring insights not used
    /*
    let hiringInsights = $(".jobsearch-HiringInsights-entry","#hiringInsightsSectionRoot")
    hiringInsights.each((_,element)=>{
        data.hiringInsights.general.push($(element).text())
    });
    */

    let jobActivity = $(".jobsearch-HiringInsights-entry--bullet")
    jobActivity.each((index,element)=>{
        if(index === 0)
            data.inventory.posted = $(element).text()
    });
    
    const job_id = await (await page.evaluateHandle(() => window.mosaic.providerData["mosaic-provider-reportcontent"].jobKey)).jsonValue()
    data.inventory.jobID = job_id

    /*
    fs.writeFile('json\\indeed_'+job_id+'.json', JSON.stringify(data), (err) => {
        if (err) throw err;
    });
    

    */

    //console.log(data)

    //await page.close();
    return data;


  

}

//function for tasting purposes
async function page(){
    const browser = await puppeteer.launch(options)
    let link = "https://www.indeed.com/viewjob?jk=bf960373fda8c398&q=dishwasher&tk=1gijir33uj3ta801&from=web&advn=3743816628155314&adid=371503356&ad=-6NYlbfkN0CzFdobHjYFpTaQteiYYpoYzywvSjvfsgLYOrDq4TeiiH7_wcwCkq8RLixW0Pfkm1sZXCEV417ZQiyCcpzm_xO2XC1rbMMRbFrZWmNK2o0hGi-VU3RV2UblNf3LJKKKS1-fwv_tpXuWXdWSIZELRSzumBPJljVjtiQ_aQijT-6XIkvSPpFNzWxKTWQqpmnal0agA_1f9RK0zlC5DLvAcxpgDzFA90IaCLNfvTvi5yb6BMYmNHJn-_yA32VrjCXo0LRT-TfAE96N17sCp__RfL0yAOQQKq93Eau2JPiF2rEseX4lDqj0PXnIgdn752_ql8WT5ICKAL-gPIFppL71loXdManreFDA5DXpDQtS3tW73A-rPV3gQtNfK7U4g7UDQK8%3D&pub=4a1b367933fd867b19b072952f68dceb&xkcb=SoDj-_M3WTtjtnwjrh0PbzkdCdPP&vjs=3";
    let data =await scrape(link,browser)
    data = await convert(data);
    fs.writeFile('json\\indeed_'+data.inventory.jobID+'.json', JSON.stringify(data), (err) => {
        if (err) throw err;
    });
    

}

page();

export default scrape