import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CompanyView = () => {
    const [data, setData] = useState([]);
    const [holdingMessage, setHoldingMessage] = useState("Loading...");

    // RETRIEVES AND SETS DATA - ALL COMPANY RECORDS FROM DATABASE
    useEffect(() => {
        const fetchData = async () => {
            try {
              const response = await axios.get('http://localhost:5000/companies');
              setData(response.data.companies);
              if(response.data.companies.length > 0) {
                setHoldingMessage(null)
              } else {
                setHoldingMessage("No data available.")
              }
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };
        
        fetchData();
 
    }, []);
    
    
  return (
    <div>
      <h2>Companies Table</h2>
      {Array.isArray(data) && data.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                {Object.values(item).map((value, index) => (
                  <td key={index}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>{holdingMessage}</p>
      )}
    </div>
  );
};

export default CompanyView;
