# indeed_scraper

To run this scraper you need to "npm install puppeteer" that is the headless browser.

## Before running the script notice that couple parameters have to be changed. 
In the config.js file the function run() has a parameter "num_pages" that is set to one. That means that the scraper will only open one page that displays jobs on indeed. 
Mind you that each page has 50 jobs in there so if you need to scrape 20 jobs you can keep it as "num_pages=1".
Additionaly notice that at the end of the file I pass a link into the "run()" function. This link pulls up all the software engineering jobs, we can put other links in there for other jobs.
Don't worry about the commented out part, I used it to connect to a database, we don't need it for now, we will figure it out later.

## In the getPages.js file
In the function I have a for loop that take in "num_jobs" as a parameter, that numbers desides how many jobs will be scraped from EACH page. 
Don't make that number higher than 50 because as I mentioned there is 50 jobs on each page.

## In the eachPage.js file
"data" is the variable that is storing all the data, that variable needs to be modified to fit our schema. 
At the very end you see the coment that says "//THIS WRITES THE JSON FILES" the code below uploads the scraped json files into the json folder in this directory. For debugging purposes I coment that part out and instead use the part that says "console.log(data)" that way I can see what I am scraping on the console and I am not wasting my memory. Also don't wory about the redis part I comented out, we don't need it for now. 

## Final words
Make sure you have node.js installed on your environment. 
Also I suggest running it on windows because it was not working on linux.
Do not modify the package.json file.
To run the script type in "node config.js" in your comand line
Feel free to make your own branch and add changes.
And feel free to reach out to me with questions.

### One last thing
For some reason github is not letting me to upload empty foldes so after you pull this repo, you need to create an empty folder named "json" in this dirrectory. That is where all the scraped files will be saved.