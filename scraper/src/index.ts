const { Pool } = require('pg');
const puppeteer = require('puppeteer');
const { array } = require('pg');

interface Apartment {
  name: string;
  locality: string;
  price: string;
  images: string[];
}

const pool = new Pool({
  user: 'postgres',
  host: 'postgres',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
  idleTimeoutMillis: 0,
  connectionTimeoutMillis: 0,
});

const jokes: String[] = [
  "Why did the programmer quit his job? He didn't get arrays.",
  "Why do programmers prefer dark mode? Because light attracts bugs.",
  "Why did the developer go broke? He used up all his cache.",
  "Why do JavaScript developers wear glasses? Because they can't C#.",
  "Why do Java developers wear glasses? Because they can't C++.",
  "Why don't programmers like nature? It has too many bugs.",
  "Why don't programmers like nature? It's all algorithm and no fun.",
  "Why don't programmers like playing hide and seek? They can't find the bugs.",
  "Why did the database administrator leave his wife? She had one-to-many relationships.",
];

let numApts:number = 0;
// Function to display a random joke
function displayJoke(): void {
  if (numApts < 500) {
    const randomIndex = Math.floor(Math.random() * jokes.length);
    console.log(jokes[randomIndex]);
  }
}
setInterval(displayJoke, 30000);
(async () => {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);

  const MAX_PAGES:Number = 25;
  const MAX_APTS:Number = 500;
  let numPages:number = 1;

  // Drop the "apartments" table if it exists
  await pool.query('DROP TABLE IF EXISTS apartments');

  // Create the "apartments" table
  await pool.query(`CREATE TABLE apartments (
    id SERIAL PRIMARY KEY,
    name TEXT,
    locality TEXT,
    price TEXT,
    images TEXT[]
  )`);

  while (numPages <= MAX_PAGES && numApts < MAX_APTS) {
    await page.goto(`https://www.sreality.cz/en/search/for-sale/apartments?page=${numPages}`);
    await page.waitForSelector('.property.ng-scope');

    const apartmentElements = await page.$$('.property.ng-scope');

    for (const apartment of apartmentElements) {
      const name = await apartment.$eval('.name.ng-binding', el => el.textContent.trim());
      const locality = await apartment.$eval('.locality.ng-binding', el => el.textContent.trim());
      const price = await apartment.$eval('.norm-price.ng-binding', el => el.textContent.trim());

      const imageElements = await apartment.$$('._15Md1MuBeW62jbm5iL0XqR._1sm7uHIebD7tngzBEQy3dD img');
      const images = await Promise.all(
        imageElements.map(async img => {
          const src = await img.getProperty('src');
          return src.jsonValue();
        })
      );

      const apartmentData: Apartment = {
        name,
        locality,
        price,
        images,
      };

      // Write the apartment data to the Postgres database
      const query = {
        text: 'INSERT INTO apartments(name, locality, price, images) VALUES($1, $2, $3, $4)',
        values: [apartmentData.name, apartmentData.locality, apartmentData.price, apartmentData.images]
      };
      await pool.query(query);

      // console.log(apartmentData); if wants to see data which load in base uncomment 
      numApts++;



      if (numApts >= MAX_APTS) break;
    }

    if (numPages >= MAX_PAGES) {
      
      break;
    }

    numPages++;
  }
  console.log('\x1b[33m\x1b[1m%s\x1b[0m', `Scraping completed. Scraped ${numApts} apartments.`);
  await browser.close();
  await pool.end();
})();
