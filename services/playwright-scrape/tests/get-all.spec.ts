import { test } from '@playwright/test'
import fs from 'fs'

interface IVenue {
  name: string
  coordinates: {
    latitude: number
    longitude: number
  }
  address: string
  hours: {
    open: string
    close: string
  }[]
  gmaps: string
  menu: {
    name: string
    price: number
  }[]
  mediaUrl: string[]
  reviews: {
    name: string
    rating: number
    comment: string
  }[]
  tags: string[]
  medianRating: number
  numberOfRatings: number
  lastCheckIn: number
}

test('test', async ({ page }) => {
  console.log(process.env.VENUE_LINKS)
  if (!process.env.VENUE_LINKS) {
    throw new Error('VENUE_LINKS env var is required')
  }
  await page.goto('https://maps.app.goo.gl/KiubzxUd9L4eqPEL8')
  await page.getByRole('button', { name: 'PT-PT' }).click()
  await page.getByRole('menuitem', { name: 'English', exact: true }).locator('span').nth(2).click()
  await page.getByRole('button', { name: 'Accept all' }).click()
  await page.waitForTimeout(1000)
  const links = process.env.VENUE_LINKS.split(',')
  const venuesData: Array<IVenue> = []
  for (const link of links) {
    // const
    // links.forEach(async (link: string) => {
    console.log('link', link)
    await page.goto(link)
    // const core = await page.$('.id-content-container')
    // if (!core) return
    // const innerCore = await page.locator('[jstcache="3"] > div > div > div > div').first()
    const nameEl = await page
      .locator('[jstcache="3"] > div > div > div > div > div:nth-child(2) > div > div > div')
      .first()
    const name = await nameEl?.textContent()
    const addressEl = await page
      .locator('[jstcache="3"] > div > div > div > div > div:nth-child(9) > div:nth-child(3)')
      .first()
    const address = await addressEl?.textContent()
    // const numberOfRatingsEl = await page
    //   .locator(
    //     '[jstcache="3"] > div > div > div > div > div:nth-child(2) > div > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(2)'
    //   )
    //   .first()
    // const numberOfRatingsText = await numberOfRatingsEl?.textContent()
    // const numberOfRatings = numberOfRatingsText?.split('(')[1].split(')')[0]
    // const medianRating = numberOfRatingsText?.split('(')[0]
    const partVenueData = {
      name: name ?? 'failed to fetch name',
      address: address ?? 'failed to fetch address',
      // numberOfRatings: Number.parseInt(numberOfRatings ?? '0'),
      numberOfRatings: 0,
      // medianRating: Number.parseFloat(medianRating ?? '0')
      medianRating: 0,
    }
    const btnBg = await page.$('[jsaction$=".heroHeaderImage"]')
    if (!btnBg) return
    const fromImg = await btnBg.$('img')
    const imgUrl = await fromImg?.getAttribute('src')
    // console.log(page.url()) // https://www.google.com/maps/place/DONAU/@41.144653,-8.6009002,17z/data
    const secondPartVenueData = {
      mediaUrl: [imgUrl?.split('=w')[0].concat('=w408-h544-k-no') ?? 'failed to fetch image'],
      coordinates: {
        latitude: Number.parseFloat(page.url().split('place/')[1].split('/')[1].split('@')[1].split(',')[0]),
        longitude: Number.parseFloat(page.url().split('place/')[1].split('/')[1].split('@')[1].split(',')[1])
      }
    }
    const finalJSON: IVenue = {
      ...partVenueData,
      ...secondPartVenueData,
      gmaps: link,
      lastCheckIn: Date.now(),
      // and put empty values to other keys
      hours: [],
      menu: [],
      reviews: [],
      tags: []
    }
    console.log(finalJSON)
    venuesData.push(finalJSON)
    // })
  }
  // write `venuesData` to local JSON file
  fs.writeFileSync('venuesData.json', JSON.stringify(venuesData, null, 2))
})
