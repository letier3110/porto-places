import { Locator, test } from '@playwright/test';

// test('test', async ({ page }) => {
//   await page.goto('https://www.bing.com/maps?cp=41.160563%7E-8.633194&lvl=11.0');
//   await page.getByRole('button', { name: 'Accept' }).click();
//   await page.getByPlaceholder('Find places and landmarks on').click();
//   await page.getByPlaceholder('Find places and landmarks on').fill('Chapa Quente');
//   await page.getByPlaceholder('Find places and landmarks on').press('Enter');
//   await page.getByText('Praça República 206 Porto').click();
//   await page.getByLabel('Phone', { exact: true }).click();
//   await page.getByLabel('Hours').click();
//   await page.getByRole('button', { name: '-star 67%' }).click();
//   await page.locator('#accordion_7_DEE24E div').filter({ hasText: '5-star67%4-star33%3-star0%2-star0%1-star0%Recent' }).nth(1).click();
//   await page.locator('a').filter({ hasText: 'media-cdn.tripadvisor.com' }).click();
//   await page.frameLocator('#OverlayIFrame').getByLabel('Provided by Tripadvisor').click();
//   await page.frameLocator('#OverlayIFrame').getByLabel('Close image').click();
//   await page.getByRole('button', { name: 'Save to calendar' }).click();
//   await page.getByRole('button', { name: 'Thursday, July 25, 2024 1:00' }).click();
//   await page.getByRole('button', { name: '26' }).click();
//   await page.getByRole('button', { name: 'Tripadvisor 5.0/5 · 4 reviews' }).click();
//   await page.getByRole('button', { name: 'Ubereats 4.8/5 · 1,500 reviews' }).click();
//   await page.getByRole('button', { name: 'Friday, July 26, 2024 1:00 AM' }).click();
//   await page.getByText('Open · Closes 00:').click();
//   await page.getByText('Wednesday').click();
//   await page.locator('#IconItem_4').click();
//   await page.getByText('Tripadvisor (4) · Burger,').click();
//   await page.locator('#taskBarContainer').getByRole('button', { name: 'More' }).click();
//   await page.getByText('Share').nth(1).click();
//   await page.getByRole('button', { name: 'Copy' }).click();
//   await page.getByLabel('Copy URL').click();
// });

interface ReviewData {
  name: string;
  rating: number;
  comment: string;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface MenuItem {
  name: string;
  price: number;
}

interface RestaurantData {
  name?: string | null;
  coordinates?: Coordinates | null;
  address?: string | null;
  hours?: string[] | null;
  gmaps?: string | null;
  menu?: Array<MenuItem> | null;
  mediaUrl?: string[] | null;
  reviews?: Array<ReviewData> | null;
  tags?: string[] | null;
  medianRating?: number | null;
  numberOfRatings?: number | null;
}

// VENUE_NAME='Chapa Quente' npx playwright test scripts/tests/get-map-data.spec.ts
// collect from console log data
test('collect restaurant data', async ({ page }) => {
  await page.goto('https://www.bing.com/maps?cp=41.160563%7E-8.633194&lvl=11.0');
  await page.getByRole('button', { name: 'Accept' }).click();
  await page.getByPlaceholder('Find places and landmarks on').click();
  await page.getByPlaceholder('Find places and landmarks on').fill(process.env.VENUE_NAME ?? 'Chapa Quente'); //process.env.VENUE_NAME==='Chapa Quente'
  await page.getByPlaceholder('Find places and landmarks on').press('Enter');
  // launch script from bash:
  // ... (navigation and interactions as in the original script)

  // partial class name selector:
  // "//div[starts-with(@class, '_wrapper_')"
  const generalInfoLocatpr = await page.locator('.b_wftp_cell').first()
  const reviewsLocator = await page.locator('div:nth-child(2) > .b_wftp_cell').first();

  const restaurantData: RestaurantData = {};

  // Name
  restaurantData.name = await page.getByRole('heading').textContent();
  // get third children of firstAfterName
  const firstAfterName = await page.locator('.b_factrow').first(); // rating, cousine, price level
  const ratingLocator = await firstAfterName.locator('div:nth-child(3)').first();
  // // · Burger, Brazilian · 
  // const tagContent = (await ratingLocator.textContent() ?? '');
  // const splitTags = tagContent.split('·')
  // const filterTags = splitTags.filter((tag) => tag.trim().length > 0)
  // const megaTag = filterTags.join(', ')
  // const newTags = megaTag.split(', ')
  // restaurantData.tags = newTags.filter((tag) => tag.trim().length > 0);
  // console.log('[debug]', { tagContent, splitTags, filterTags, megaTag, newTags, tags: restaurantData.tags });

  // Coordinates - from query string of url
  const url = await page.url();
  const latitude = parseFloat(new URL(url).searchParams.get('cp')?.split('~')[0] ?? '0');
  const longitude = parseFloat(new URL(url).searchParams.get('cp')?.split('~')[1] ?? '0');
  
  restaurantData.coordinates = { latitude, longitude };

  // Address
  restaurantData.address = await page.getByLabel('Address').textContent();

  // Hours
  await page.getByLabel('Show more').click();
  await page.getByLabel('Hours');
  const hoursText = await page.getByLabel('Hours').textContent() ?? '';
  // Open · Closes 00:30Days of weekOpen hoursThursday18:00 - 00:30Friday18:00 - 00:30Saturday18:00 - 00:30Sunday18:00 - 00:30MondayClosedTuesdayClosedWednesday18:00 - 00:30
  restaurantData.hours = hoursText.split("Open hours")[1].split(/(?<=\d{2}:\d{2})/).map((line) => line.trim());

  // Google Maps link (URL)
  await page.getByLabel('Share').click();
  // add timeout 5 second
  await page.waitForTimeout(1000);
  const clipboardText = await page.getByLabel('Copy URL').textContent();
  // get from copy buffer
  // const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
  restaurantData.gmaps = clipboardText;
  await page.getByRole('button', { name: 'Close' }).click();

  // Menu (sample item names and prices)
  restaurantData.menu = [];
  // // @ts-expect-error due to the use of the `??` operator
  // const menuItems: Array<Locator> = await page.locator('.menu-item') ?? [];
  // for (const menuItem of menuItems) {
  //   const name = await menuItem.locator('.item-name').textContent();
  //   const priceText = await menuItem.locator('.item-price').textContent();
  //   const price = parseFloat((priceText??'0.0').replace(/[^\d.]/g, ''));
  //   restaurantData.menu.push({ name: name??'', price });
  // }

  // Media URLs (images, videos)
  restaurantData.mediaUrl = await page.locator('.media-item img').evaluateAll(
    (elements) => elements.map((element) => (element as any).src)
  );

  // Reviews (sample)
  restaurantData.reviews = [];
  // // @ts-expect-error due to the use of the `??` operator
  // const reviewElements: Array<Locator> = await page.locator('.review') ?? [];
  // for (const reviewElement of reviewElements) {
  //   const name = await reviewElement.locator('.reviewer-name').textContent();
  //   const ratingText = await reviewElement.locator('.rating').textContent();
  //   const rating = parseFloat(ratingText??'0');
  //   const comment = await reviewElement.locator('.comment').textContent();
  //   restaurantData.reviews.push({ name: name??'', rating, comment: comment??'' });
  // }

  // // Tags (cuisine, features, etc.)
  // restaurantData.tags = await page.locator('.tag').allTextContents();

  // Median rating
  const medianRatingText = '0'; // await page.locator('.median-rating').textContent();
  restaurantData.medianRating = parseFloat(medianRatingText ?? '0');

  // Number of ratings
  const numRatingsText = '0'; // await page.locator('.num-ratings').textContent();
  restaurantData.numberOfRatings = parseInt((numRatingsText??'0').replace(/\D/g, ''), 10);

  console.log(JSON.stringify(restaurantData, null, 2)); 
});
