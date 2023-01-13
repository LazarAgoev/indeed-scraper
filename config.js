import scrape from './eachPage.js'
import getJobs from './getPages.js';
import puppeteer from "puppeteer"
//import { createClient } from 'redis';

/*
These are the only variables you need to modify
JOBNAME is the name of the job you want to scrape
NUMJOBS is now many jobs you need to scrape
*/
const JOBNAME="Software engineer";
const NUMJOBS=1;




const options = {
    args: ['--start-maximized', 'disable-gpu', '--disable-infobars', '--disable-extensions', '--ignore-certificate-errors'],
    headless: false,
    ignoreDefaultArgs: ['--enable-automation'],
    defaultViewport: null,
  };


async function run(){
  let link = "https://www.indeed.com/jobs?q="
  let nameArr=JOBNAME.split(" ")
  for(let i=0; i<nameArr.length; i++){
    link=link+nameArr[i].toLowerCase()+"+" 
  }
  link = link.replace(/.$/, ''); 
  link = link + "&sort=date&limit=50&start=";

  /*
  const endpoint = "redis-15435.c276.us-east-1-2.ec2.cloud.redislabs.com"
  const client = createClient({
        socket: {
            host: endpoint,
            port: 15435
        },
        password: 'JaJ88HJ4pkKquhc1y3l9fThkIIIwnUkW'
    });
  await client.connect();

  */
  const browser = await puppeteer.launch(options)
  
  let num_pages = Math.floor(NUMJOBS/50);
  let last_page = NUMJOBS%50;
  for(let i = 0; i<num_pages; i++)
    {
      //await sleep(10*1000)
      await getJobs(link+50*i, browser, 50)
    }
    await getJobs(link+50*num_pages, browser, last_page);
    console.log("done");

}


run();
