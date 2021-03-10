const puppeteer = require('puppeteer-core');

function delay(time) {
   return new Promise(function(resolve) {
       setTimeout(resolve, time)
   });
}


class CrawlSession {

  constructor(browser) {
    console.log("CrawlSession constructor");

    this.browser = browser;
    this.page = null;
    this.errors = 0;
    this.url_queue = [];
  }

  async connectPage() {
    console.log("connectPage");

    if (this.page == null) {
      this.page = await this.browser.newPage();
    }
  }


  async scanCatalog(url) {

    console.log("scanCatalog");
    
    var response = await this.page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 0,
    });
    
    if (! response.ok()) {

      console.error("Bad status", response.status(), url);

    }

    
    var threadList = await this.page.$$eval('div.thread > a', as => as.map(a => a.href));
    
    
    if (threadList == 0){
      console.log("Scanning catalog type 2");

      threadList = await this.page.$$eval('td.txt-sub > a', as => as.map(a => a.href));
    }
    
    console.log("Found threads", threadList.length);
    
    this.url_queue = threadList;
    
    
  }

  async visitEachURL(url_list) {
    
    console.log("visitEachURL");

    var errors = 0;
    var k = 0;

    for(let url of url_list) {

      console.log(k,"goto", url);
      
      var response = await this.page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 0,
      });
      

      if (! response.ok()) {
        
        console.error("Bad status", response.status(), url);
        
        errors += 1;
      }
      
      k += 1;
      
      delay(1000);
      
    }
  }

  async visitUrl(url){

    console.log("visitUrl", url);
    
    var response = await this.page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 0,
    });


    if (! response.ok()) {

      console.error("Bad status", response.status(), url);

    }
    
  }

}


exports.CrawlSession = CrawlSession;

