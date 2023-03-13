# flat-finder
## Overview
This program is a web scraper that extracts information about apartments for sale from the sreality.cz website. It uses the Puppeteer library to automate a headless Chrome browser to navigate to each page of search results, extract information about each apartment, and store it in memory.

The backend is built using Node.js and the Express.js framework, which provides a REST API for retrieving the scraped apartment data from the PostgreSQL database. The API endpoint /apartments supports pagination with a default page size of 25, and returns a JSON response with the apartments data retrieved from the database.

The scraped data is stored in a PostgreSQL database, and the program uses the pg package to connect to the database with the configuration details provided in the pool object. Connection pooling is used to optimize performance and handle multiple requests concurrently.

## Configuration
The program is currently configured to scrape up to 25 pages of search results, and up to 500 apartments in total. These values can be adjusted by modifying the MAX_PAGES and MAX_APTS constants at the beginning of the code.

## Output
The program outputs the scraped apartment data to the console in the following format:
Name: [apartment name]
Locality: [apartment locality]
Price: [apartment price]
Images: [array of images]

At the end of the scraping process, the program will output a message indicating how many apartments were scraped. During the scraping process, the program will periodically output progress updates to the console. These updates will include the number of apartments that have been scraped so far, as well as a random joke to keep things light-hearted.

## Dockerization
The program has been dockerized using Docker Compose to simplify deployment and setup. The docker-compose.yml file defines the services that make up the application, including the backend, frontend, Postgres database, and the scraper. Each service is built from a Dockerfile in its respective directory, and can be run using the command docker-compose up in your terminal.

## Running the Scraper
To run the scraper, follow these steps:

Make sure you have Docker installed on your machine.
Clone this repository to your local machine.
Navigate to the root directory of the repository in your terminal.
Run the following command to start the scraper and other services:
docker-compose up

If you encounter a NAT error on Windows, you can try running the following commands in a Windows PowerShell terminal to fix it:
net stop winnat
docker-compose up 
net start winnat
Once the services are running, you can access the frontend by navigating to http://localhost:8080 in your web browser. This will display a table of the scraped data.
Note: It may take a few minutes for the scraper to complete scraping all the pages.
