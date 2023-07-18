require('dotenv').config(); // Load environment variables from .env file
const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL
const url = process.env.URL

const fetch = require('node-fetch');
const puppeteer = require('puppeteer');

async function getRewardAmount() {
  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    await page.goto(url);

    // Wait for the target element to be available
    await page.waitForSelector('#app div.main-content > div > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div > div:nth-child(3) > div.column.is-9');

    // Extract the reward amount
    const rewardAmountText = await page.$eval('#app div.main-content > div > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div > div:nth-child(3) > div.column.is-9', element => element.textContent.trim());

    // Close the browser
    await browser.close();

    // Parse the reward amount as a number
    const rewardAmount = parseFloat(rewardAmountText);

    return rewardAmountText;
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}

async function sendDiscordMessage() {
  try {
    const rewardAmount = await getRewardAmount();
	  let message = 'Current unclaimed ATOM rewards: `' + rewardAmount + '`';
    await fetch(discordWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'Staked ATOM',
        content: message
      })
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

(async function() {
  await sendDiscordMessage();
})();


setInterval(async function() {
	await sendDiscordMessage();
}, 86400000);
