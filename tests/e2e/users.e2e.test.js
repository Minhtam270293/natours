const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');
const { dbConnect, dbDisconnect } = require('../environment/setupMongo');
const { startServer, stopServer } = require('../../startServer'); 



let driver;
let server;

const rootURL = 'http://127.0.0.1:3000';
const waitUntilTime = 20000;

async function getElementByCss(css) {
  const el = await driver.wait(until.elementLocated(By.css(css)), waitUntilTime);
  return await driver.wait(until.elementIsVisible(el), waitUntilTime);
}

describe('Homepage UI - E2E Test', () => {
  beforeAll(async () => {
    const mongoUri = await dbConnect();
    server = await startServer(mongoUri, 3000);
    driver = await new Builder().forBrowser('chrome').build();
    await driver.manage().window().setSize(1280, 1024);
  }, 60000);

  afterAll(async () => {
    if (driver) await driver.quit();
    if (server) await stopServer();
    await dbDisconnect();
  }, 30000);

  it('should open the homepage', async () => {
    await driver.get(rootURL);
    const title = await driver.getTitle();
    expect(title).toBeDefined();
  }, 20000);

  it('should display the Log in link', async () => {
    const el = await getElementByCss('a.nav__el[href="/login"]');
    const actual = await el.getText();
    expect(actual).toBe('LOG IN');
  }, 20000);
});
