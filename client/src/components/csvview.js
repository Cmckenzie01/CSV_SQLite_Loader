import React, { useState } from 'react';
import { DataFrame } from 'data-forge';
import * as Papa from 'papaparse';
import dataset from '../data/country_code_data.json';
import axios from 'axios';
 
const CSVView = () => {
    const [file, setFile] = useState(null);
    const [array, setArray] = useState([]);
    const [dataFrame, setDataFrame] = useState();

    // DATABASE LOAD BLOCKERS
    const [domainAdded, setdomainAdded] = useState(false);
    const [codesAdded, setcodesAdded] = useState(false);
    const [revenuesAdded, setrevenuesAdded] = useState(false);
    const [duplicatesRemoved, setduplicatesRemoved] = useState(false);
    const [missingRemoved, setmissingRemoved] = useState(false);

    // MESSAGE OUTPUT VARIABLES
    const [messageOutput, setMessageOutput] = useState("Message Output");
    const [companiesProcessed, setCompaniesProcessed] = useState(0);
    const [missingDataRemoved, setMissingDataRemoved] = useState(0);
    const [duplicateDataRemoved, setDuplicateDataRemoved] = useState (0);
    const [companiesUploaded, setCompaniesUploaded] = useState(0); 


    const fileReader = new FileReader();

    const handleOnChange = (e) => {
        setFile(e.target.files[0]);
        setMessageOutput("Looks like this you've choosen a file")
    };


    // FORMAT DATAFRAME INTO OUTPUT ARRAY FOR BROWSER
    const DataFrameToOutputArray = (dataFrame) => {
      const csvHeader = dataFrame.getColumnNames();
      const csvRows = dataFrame.toRows();
    
      const array = csvRows.map((row) => {
        const obj = csvHeader.reduce((object, header, index) => {
          object[header] = row[index];
          return object;
        }, {});
    
        return obj;
      });
    
      setArray(array);
    };


    // FORMAT TITLE CASE
    const toTitleCase = (str) => {
      if (str) {
        return str.replace(/\w\S*/g, (txt) => {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      }
      return str;
    };
    

    // LOAD CSV FILE INTO DATAFRAME
    const handleOnSubmit = (e) => {
        e.preventDefault();

        if (file) {
            fileReader.onload = function (event) {
                const text = event.target.result;

                const parsedData = Papa.parse(text, { header: true });
                const dataArray = parsedData.data;

                let  dataFrame = new DataFrame(dataArray);

                dataFrame = dataFrame.transformSeries({
                  "Company Name": (row) => toTitleCase(row)
                });

                dataFrame = dataFrame.transformSeries({
                  "Revenue (2021)": (value) => {
                    const numericValue = parseFloat(value.replace(/[^0-9.-]+/g, ''));
                    return isNaN(numericValue) ? "N/A" : numericValue;
                  },
                  "Revenue (2022)": (value) => {
                    const numericValue = parseFloat(value.replace(/[^0-9.-]+/g, ''));
                    return isNaN(numericValue) ? "N/A" : numericValue;
                  },
                });
                setMessageOutput("Let's see that data!")
                setDataFrame(dataFrame);
                DataFrameToOutputArray(dataFrame);
                
                const companiesProcessed = dataFrame.count()
                setCompaniesProcessed(companiesProcessed)
            };

            fileReader.readAsText(file);
        }
    };


    // DOMAIN COLUMN
    const extractDomain = (url) => {
      try {
        const { hostname } = new URL(url);
        const domain = hostname.replace(/^www\./, ''); // Remove "www." prefix
        return domain;
      } catch (error) {
        return 'N/A';
      }
    };

    const addDomainColumn = () => {
      if (array.length > 0) {
        const updatedDataFrame = dataFrame.generateSeries({
          "Company Domain": (row) => extractDomain(row['Company Website']),
        });
        setMessageOutput("One Domain column coming up!")
        setDataFrame(updatedDataFrame);
        DataFrameToOutputArray(updatedDataFrame);
        setdomainAdded(true)
      }
    };



    // COUNTRY CODE
    const getCountryCode = (country) => {
      const countryEntry = dataset.find((entry) => entry.Name === country);
      return countryEntry ? countryEntry['Code'] : 'N/A';
    };


    const addCountryCodeColumn = () => {
      if (dataFrame && dataset) {
        const updatedDataFrame = dataFrame.generateSeries({
          'Country Code': (row) => getCountryCode(row['Country']),
        });

        setMessageOutput("Nice, looks like we now have some country codes")
        setDataFrame(updatedDataFrame);
        DataFrameToOutputArray(updatedDataFrame);
        setcodesAdded(true);
      }
    };


    // GBP REVENUES
    const getGBPValue = (usdValue, rate) => {
      const gbpValue = usdValue * rate;
      return isNaN(gbpValue) ? 'N/A' : gbpValue;
    };

    const addGBPRevenues = async () => {
      try {
        const response = await axios.get('http://www.floatrates.com/daily/usd.json');
        const rates = response.data;
    
        const updatedDataFrame = dataFrame.generateSeries({
          'Revenue (2021) GBP': (row) => getGBPValue(row['Revenue (2021)'], rates.gbp.rate),
          'Revenue (2022) GBP': (row) => getGBPValue(row['Revenue (2022)'], rates.gbp.rate),
        });

        setMessageOutput("As a Scot, these figures make way more sense to me")
        setDataFrame(updatedDataFrame);
        DataFrameToOutputArray(updatedDataFrame);
        setrevenuesAdded(true);

      } catch (error) {
        console.error('Error fetching exchange rates:', error);
        return null;
      }
    };



    // REMOVE DUPLICATES
    const removeDuplicateORRows = () => {
      setMessageOutput("This might take a second...")
      if (dataFrame && dataFrame.count() > 0) {
        let updatedDataFrame = dataFrame.distinct(
          (row) =>
            row['Company Name']
        );
        updatedDataFrame = dataFrame.distinct(
          (row) =>
            row['Company Website']
        );
        const removedRowCount = dataFrame.count() - updatedDataFrame.count();
        const removedDataFrame = dataFrame.except(updatedDataFrame);
        
        setDataFrame(updatedDataFrame);
        DataFrameToOutputArray(updatedDataFrame);
        setduplicatesRemoved(true);
        setMessageOutput("Duplicate Rows removed: " + removedRowCount)
        setDuplicateDataRemoved(removedRowCount)
      }
    };


    // REMOVE MISSING/NULL VALUES
    const removeRowsWithEmptyValues = () => {
      setMessageOutput("This might take a second...")
      if (dataFrame && dataFrame.count() > 0) {
        const updatedDataFrame = dataFrame.where(
          (row) => 
          {
          for (const column of dataFrame.getColumnNames()) {
            if (!row[column] || row[column] === 'N/A' || row[column] === 'n/a') {
              return false;
            }
          }
          return true;
        });
    
        const removedRowCount = dataFrame.count() - updatedDataFrame.count();
        const removedDataFrame = dataFrame.except(updatedDataFrame);
    
        setDataFrame(updatedDataFrame);
        DataFrameToOutputArray(updatedDataFrame);
        setmissingRemoved(true);
        setMessageOutput("Missing Data Rows removed: " + removedRowCount)
        setMissingDataRemoved(removedRowCount)
      }
    };


    // LOAD DATA TO DATABASE
    const loadDatatoDatabase = () => {
      setMessageOutput("This might take a second...")
      if (dataFrame) {
        const companyFormattedDataFrame = dataFrame.dropSeries(['Revenue (2021)','Revenue (2022)', 'Revenue (2021) GBP', 'Revenue (2022) GBP']).renameSeries({
          "Company Name": "name",
          "Company Website": "website",
          "Company Domain": "domain", 
          "Country": "country",
          "Country Code": "country_code"
          
        });

        const financeFormattedDataFrame = dataFrame.dropSeries(['Company Website', 'Company Domain', 'Country', 'Country Code'])

        const Year1financeFormattedDataFrame = financeFormattedDataFrame
          .dropSeries(['Revenue (2022)', 'Revenue (2022) GBP'])
          .generateSeries({"Year": (row) => 2021})
          .renameSeries({
            "Company Name": "name",
            "Year": "year",
            "Revenue (2021)": "revenue_usd",
            "Revenue (2021) GBP": "revenue_gbp"
          });

        const Year2financeFormattedDataFrame = financeFormattedDataFrame
          .dropSeries(['Revenue (2021)', 'Revenue (2021) GBP'])
          .generateSeries({"Year": (row) => 2022})
          .renameSeries({
              "Company Name": "name",
              "Year": "year",
              "Revenue (2022)": "revenue_usd",
              "Revenue (2022) GBP": "revenue_gbp"
          });

        // Set batch size and data rows
        const batchSize = 500;
        const rows = companyFormattedDataFrame.toArray();
        const rows2 = Year1financeFormattedDataFrame.toArray();
        const rows3 = Year2financeFormattedDataFrame.toArray();

        // Set POST destinations
        const companyDestination = 'http://localhost:5000/companies'
        const financialDestination = 'http://localhost:5000/financials'

        // Load Company Rows
        if (rows.length <= batchSize) {
          sendBatch(rows, companyDestination);
        } else {
          const batches = splitRowsIntoBatches(rows, batchSize);
          batches.forEach((batch) => sendBatch(batch, companyDestination));
        }

        // Load 2021 Financial Rows
        if (rows2.length <= batchSize) {
          sendBatch(rows2, financialDestination);
        } else {
          const batches = splitRowsIntoBatches(rows2, batchSize);
          batches.forEach((batch) => sendBatch(batch, financialDestination));
        }

        // Load 2022 Financial Rows
        if (rows3.length <= batchSize) {
          sendBatch(rows3, financialDestination);
        } else {
          const batches = splitRowsIntoBatches(rows3, batchSize);
          batches.forEach((batch) => sendBatch(batch, financialDestination));
        }

        // Count variables for output message
        const CompanyRowCount = companyFormattedDataFrame.count();
        const FinancialRowCount = Year1financeFormattedDataFrame.count() + Year2financeFormattedDataFrame.count();
   
        setCompaniesUploaded(CompanyRowCount + FinancialRowCount)
        setMessageOutput(companiesProcessed + " Rows Processed --- " + duplicateDataRemoved + " Duplicates Removed --- " + missingDataRemoved + " Nulls Removed --- " + CompanyRowCount + " Company Rows & " + FinancialRowCount + " Financial Rows loaded to Database.");
        setArray([]);
      }
    };

    function splitRowsIntoBatches(rows, batchSize) {
      const numBatches = Math.ceil(rows.length / batchSize);
      const batches = [];
      for (let i = 0; i < numBatches; i++) {
        const start = i * batchSize;
        const end = start + batchSize;
        const batchRows = rows.slice(start, end);
        batches.push(batchRows);
      }
      return batches;
    }

    function sendBatch(data, destination) {
      console.log(destination);
      axios
        .post(destination, data )
        .then((response) => {
          console.log('POST request successful:', response);
        })
        .catch((error) => {
          console.error('Error sending POST request:', error);
        });
    }

    // For table headers in browser
    const headerKeys = Object.keys(Object.assign({}, ...array));

  return (
    <div style={{ textAlign: "center" }}>
        <h1>CSV Import</h1>
        <form>
            <input 
                type={"file"} 
                id={"csvFileInput"}
                accept={".csv"}
                onChange={handleOnChange}
                />
            <button 
                className="ms-2"
                onClick={(e) => {
                    handleOnSubmit(e);
                }}
            >IMPORT CSV
            </button>
        </form> 

        {array.length > 0 && (
        <button onClick={addDomainColumn} style={{ marginTop: '20px' }}>
          Add Domain
        </button>
      )}
      
      {array.length > 0 && (
        <button className="ms-2" onClick={addCountryCodeColumn} style={{ marginTop: '20px' }}>
          Add Country Codes
        </button>
      )}

      {array.length > 0 && (
        <button className="ms-2" onClick={addGBPRevenues} style={{ marginTop: '20px' }}>
          Add GBP Revenues
        </button>
      )}

       {array.length > 0 && (
        <button className="ms-2" onClick={removeDuplicateORRows} style={{ marginTop: '20px' }}>
          Remove Duplicate Name OR Website
        </button>
      )}

      {array.length > 0 && (
        <button className="ms-2" onClick={removeRowsWithEmptyValues} style={{ marginTop: '20px' }}>
          Remove Missing/Null Data
        </button>
      )}

      <br />

      {domainAdded && codesAdded && revenuesAdded && duplicatesRemoved && missingRemoved && (
        <button className="ms-5" onClick={loadDatatoDatabase} style={{ marginTop: '20px' }}>
          Load Data to Database
        </button>
      )}

        <br />

      <div className="m-3 mt-5">
        <div>No. of Entries: {array.length}</div>  
        <div>{messageOutput}</div>
      </div> 
    
    <table className="table table-striped">
        <thead>
          <tr key={"header"}>
            {headerKeys.map((key) => (
              <th>{key}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {array.map((item) => (
            <tr key={item.id}>
              {Object.values(item).map((val) => (
                <td>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default CSVView;