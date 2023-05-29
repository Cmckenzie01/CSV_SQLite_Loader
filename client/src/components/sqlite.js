import React from 'react';
import ReactMarkdown from 'react-markdown';

const READMEContent = `
# CSV_SQLite_Loader

React/Node.js app to process and load CSV data to a SQLite database

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)

## Features

- CSV file parsing and loading into a DataFrame
- Data pre-processing:
  - Converting company names to title case 
  - Converting revenue values to integers
  - Generating new columns based on existing columns (e.g., Domain, Country Codes, GBP Revenues)
- Duplicate removal:
  - Removing duplicate entries based on Name or Website
- Data validation:
  - Removing rows with missing or invalid data
- Database loading:
  - Sending the processed data to a backend API for loading into a SQLite database
- Database queries:
  - Viewing the loaded company data and financial data through API calls
  - Performing detailed queries on the company and financial data

## Getting Started

To get started with the application, follow these steps:

1. Clone the repository: 
   git clone https://github.com/Cmckenzie01/CSV_SQLite_Loader


2. Change the project directory: 
   cd cd CSV_SQLite_Loader


3. Install the dependencies for both the client and server: 
   # Install client dependencies
   cd client
   npm install

   # Install server dependencies
   cd ../server
   npm install

4. Start the application:
   # From the server directory
   cd ../client
   npm start

   # From the client directory
   cd ../server
   npm start


4. Open the application in your browser:
   The application will be accessible at http://localhost:3000.


## Usage
0. Explore each page:
   - When the database is empty the companies, financials, and queries pages will display No Data Available messages.
   - This application has a narrow use case and will only work on the specifically formated data it was designed for.

1. Upload CSV File:

   - In the CSV page, click on the "Upload CSV" button to select a CSV file containing the company data, and then click Import CSV.
   - The application will parse the CSV file and load it into a DataFrame.

2. Data Pre-processing:

   - By default loading the data will perform various pre-processing tasks, such as converting company names to title case and converting revenue values to integers.
   - Additional functionalities, activated by the display buttons that will appear once data is loaded include; generating new columns based on existing columns, removing duplicate entries based on specific criteria, and removing rows with missing or invalid data can be activated by clicking the respective buttons.

3. Database Loading:

   - Once all buttons have been pressed, a new button will appear. Click on the "Load Data to Database" button to load the processed data into the database.
   - The data will be sent to the backend API, which will insert it into the SQLite database.

4. Viewing Data:

   - Navigate to the "Companies" and "Financials" pages to view the loaded data.
   - The application makes API calls to fetch the company and financial data from the database and displays it in a table format.
   - The table includes the relevant rows and provides a count of the entries/rows in each respective table.

5. Database Queries:

   - Access the "Queries" page to view more details queries on the company and financial data. 
   - The application sends API requests to the backend, which executes the pre-programmed queries on the database and returns the results.


## API Endpoints

The following API endpoints are available:

- GET \`localhost:5000/companies\` - Fetch all company data from the database.
- POST \`localhost:5000/companies\` - Insert new company data into the database.
- PATCH \`localhost:5000/companies/:id\` - Update a company's data by ID.
- DELETE \`localhost:5000/companies/:id\` - Delete a company by ID.
- GET \`localhost:5000/financials\` - Fetch all financial data from the database.
- POST \`localhost:5000/financials\` - Insert new financial data into the database.
- PATCH \`localhost:5000/financials/:id\` - Update financial data for a specific company by ID.
- DELETE \`localhost:5000/financials/:id\` - Delete financial data for a specific company by ID.

## Database Schema

The application uses a SQLite database with the following schema:

**companies**

| Column       | Type    |
| ------------ | ------- |
| id           | INTEGER |
| name         | TEXT    |
| website      | TEXT    |
| domain       | TEXT    |
| country      | TEXT    |
| country_code | TEXT    |

**financials**

| Column      | Type    |
| ----------- | ------- |
| id          | INTEGER |
| company_id  | INTEGER |
| year        | TEXT    |
| revenue_usd | INTEGER |
| revenue_gbp | INTEGER |

## Contributing

We are not taking contributions.

## License

This project is unlicensed.
`;

const SQLiteView = () => {
  return (
    <div>
      <ReactMarkdown>{READMEContent}</ReactMarkdown>
    </div>
  );
};

export default SQLiteView;
