import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QueryView = () => {
    const [dataCountries, setDataCountries] = useState([]);
    const [dataRevenues, setDataRevenues] = useState([]);
    const [holdingMessage1, setHoldingMessage1] = useState("Loading...");
    const [holdingMessage2, setHoldingMessage2] = useState("Loading...");

    // RETRIEVES AND SETS DATA - COUNT OF COMPANIES BY COUNTRY
    useEffect(() => {
        const fetchData = async () => {
            try {
              const response = await axios.get('http://localhost:5000/joint/getCountOfCompaniesByCountry');
              setDataCountries(response.data.query);
              if(response.data.query.length > 0) {
                setHoldingMessage1(null)
              } else {
                setHoldingMessage1("No data available.")
              }
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };
        
        fetchData();
 
 
    }, []);

    // RETRIEVES AND SETS DATA - ALL COMPANIES WITH 2022 REVENUES GREATER THAN 100K IN THE UK
    useEffect(() => {
      const fetchData = async () => {
          try {
            const response = await axios.get('http://localhost:5000/joint/getAllCompaniesWith2022RevenuesGreaterThan100KInTheUK');
            setDataRevenues(response.data.query);
            if(response.data.query.length > 0) {
              setHoldingMessage2(null)
            } else {
              setHoldingMessage2("No data available.")
            }
          } catch (error) {
              console.error('Error fetching data: ', error);
          }
      };
      
      fetchData();


  }, []);
    
    
  return (
    <div>
      <div>
        <h2>Count of Companies by Country Table</h2>
        {Array.isArray(dataCountries) && dataCountries.length > 0 ? (
          <table className="table table-striped">
            <thead>
              <tr>
                {Object.keys(dataCountries[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataCountries.map((item, index) => (
                <tr key={index}>
                  {Object.values(item).map((value, index) => (
                    <td key={index}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>{holdingMessage1}</p>
        )}
      </div>
      <div className="mt-5">
        <h2>Companies that have a 2022 revenue greater than £100k in the UK</h2>
        <div className="m-3 mt-5">
        <div><h3>Count: {dataRevenues.length}</h3></div>  
      </div> 
        {Array.isArray(dataRevenues) && dataRevenues.length > 0 ? (
          <table className="table table-striped">
            <thead>
              <tr>
                {Object.keys(dataRevenues[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataRevenues.map((item, index) => (
                <tr key={index}>
                  {Object.values(item).map((value, index) => (
                    <td key={index}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>{holdingMessage2}</p>
        )}
      </div>
      
    </div>
    
        
  );
};

export default QueryView;
