const puppeteer = require("puppeteer");
const { setDefaultOptions } = require("expect-puppeteer");
const fs = require("fs");
const fsPromises = fs.promises;
 
const baseURL = process.env.BASE_URL || "http://localhost:3000";
 
// Extend Jest timeout to 30 seconds
jest.setTimeout(30000);
 
const onPageConsole = (msg) =>
  Promise.all(msg.args().map((event) => event.jsonValue()))
    .then((eventJson) =>
      console.log(`<LOG::page console ${msg.type()}>`, ...eventJson)
    )
    .catch(() => console.log(`<LOG::page console ${msg.type()}>`));
 
describe("US-01 - Create and list reservations - E2E", () => {
  let page;
  let browser;
 
  beforeAll(async () => {
    await fsPromises.mkdir("./.screenshots", { recursive: true });
    setDefaultOptions({ timeout: 5000 });
 
    // Start Puppeteer with headless mode disabled for debugging
    browser = await puppeteer.launch({
      headless: false, // Set to true later for CI
      slowMo: 50, // Adds delay between actions for debugging
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  });
 
  beforeEach(async () => {
    if (page) {
      await page.close();
    }
    page = await browser.newPage();
    page.on("console", onPageConsole);
    await page.setViewport({ width: 1920, height: 1080 });
 
    // Ensure a fresh navigation
    await page.goto(`${baseURL}/reservations/new`, {
      waitUntil: "networkidle2",
    });
 
    // Wait before interaction
    await page.waitForTimeout(500);
  });
 
  afterAll(async () => {
    await browser.close();
  });
 
  describe("/reservations/new page", () => {
    test("filling and submitting form creates a new reservation and then displays the dashboard for the reservation date", async () => {
      const lastName = Date.now().toString(10);
 
      // Wait for input fields before interacting
      await page.waitForSelector("input[name=first_name]");
      await page.type("input[name=first_name]", "James");
      await page.type("input[name=last_name]", lastName);
      await page.type("input[name=mobile_number]", "800-555-1212");
      await page.type("input[name=reservation_date]", "01012035");
      await page.type("input[name=reservation_time]", "1330");
      await page.type("input[name=people]", "2");
 
      await page.screenshot({
        path: ".screenshots/us-01-submit-before.png",
        fullPage: true,
      });
 
      // Ensure submit button is visible before clicking
      await page.waitForSelector("[type=submit]");
      await page.waitForTimeout(500);
 
      await Promise.all([
        page.click("[type=submit]"),
        page.waitForNavigation({ waitUntil: "networkidle2" }),
      ]);
 
      await page.screenshot({
        path: ".screenshots/us-01-submit-after.png",
        fullPage: true,
      });
 
      await page.waitForTimeout(500);
      await expect(page).toMatch(lastName);
    });
 
    test("canceling form returns to previous page", async () => {
      // Navigate to dashboard first
      await page.goto(`${baseURL}/dashboard`, { waitUntil: "networkidle2" });
      await page.goto(`${baseURL}/reservations/new`, { waitUntil: "networkidle2" });
 
      // Ensure cancel button is present
      await page.waitForXPath(
        "//button[contains(translate(., 'ACDEFGHIJKLMNOPQRSTUVWXYZ', 'acdefghijklmnopqrstuvwxyz'), 'cancel')]"
      );
 
      const [cancelButton] = await page.$x(
        "//button[contains(translate(., 'ACDEFGHIJKLMNOPQRSTUVWXYZ', 'acdefghijklmnopqrstuvwxyz'), 'cancel')]"
      );
 
      if (!cancelButton) {
        throw new Error("Cancel button not found.");
      }
 
      await page.screenshot({
        path: ".screenshots/us-01-cancel-before.png",
        fullPage: true,
      });
 
      await page.waitForTimeout(500);
 
      await Promise.all([
        cancelButton.click(),
        page.waitForNavigation({ waitUntil: "networkidle2" }),
      ]);
 
      await page.screenshot({
        path: ".screenshots/us-01-cancel-after.png",
        fullPage: true,
      });
 
      expect(page.url()).toContain("/dashboard");
    });
  });
});
