import './App.css';
import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from "./components/navbar";
import SQLiteView from "./components/sqlite";
import CompanyView from "./components/companies";
import FinancialView from "./components/financials";
import CSVView from "./components/csvview";
import QueriesView from "./components/queriesview";


function App() {
  return (
    <div className="container">
    <Navbar />
    <br/>
    <Routes> 
        <Route path="/" exact element={<SQLiteView />} />
        <Route path="/companies" element={<CompanyView />} />
        <Route path="/financials" element={<FinancialView />} />
        <Route path="/csv" element={<CSVView />} />
        <Route path="/queries" element={<QueriesView />} />
      
    </Routes>
    </div>
  );
}

export default App;
