const express = require('express');
const cors = require('cors');
const app = express();
const dbc = require("./db/companies");
const dbf = require("./db/financials");
const dbj = require("./db/joint");

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({limit: '2mb'}));
app.use((err, req, res, next) => {
    console.error(err); 
    res.status(500).json({ error: 'Internal Server Error' });
  });


// COMPANY TABLE - APIs
app.post("/companies", async (req, res) => {
    try {
        const results = await dbc.createCompany(req.body);
        res.status(201).json({ id: results[0] });
    } catch (error) {
        console.error("Error creating company:", error);
        res.status(500).json({ error: "Failed to create company" });
    }
});

app.get("/companies", async (req, res) => {
    try {
        const companies = await dbc.getAllCompanies();
        res.status(200).json({ companies });
    } catch (error) {
        console.error("Error getting companies:", error);
        res.status(500).json({ error: "Failed to retrieve companies" });
    }
});

app.patch("/companies/:id", async (req, res) => {
    try {
        const id = await dbc.updateCompany(req.params.id, req.body);
        res.status(200).json({ id });
    } catch (error) {
        console.error("Error updating company:", error);
        res.status(500).json({ error: "Failed to update company" });
    }
});

app.delete("/companies/:id", async (req, res) => {
    try {
        await dbc.deleteCompany(req.params.id);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error deleting company:", error);
        res.status(500).json({ error: "Failed to delete company" });
    }
});


// FINANCIAL TABLE - APIs
app.post("/financials", async (req, res) => {
    try {
        const results = await dbf.createFinancial(req.body);
        res.status(201).json({ id: results[0] });
    } catch (error) {
        console.error("Error creating financials:", error);
        res.status(500).json({ error: "Failed to create financials" });
    }
});

app.get("/financials", async (req, res) => {
    try {
        const financials = await dbf.getAllFinancials();
        res.status(200).json({ financials });
    } catch (error) {
        console.error("Error getting financials:", error);
        res.status(500).json({ error: "Failed to retrieve financials" });
    }
});

app.patch("/financials/:id", async (req, res) => {
    try {
        const id = await dbf.updateFinancial(req.params.id, req.body);
        res.status(200).json({ id });
    } catch (error) {
        console.error("Error updating financial entry:", error);
        res.status(500).json({ error: "Failed to update financial entry" });
    }
});

app.delete("/financials/:id", async (req, res) => {
    try {
        await dbf.deleteFinancial(req.params.id);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error deleting financial entry:", error);
        res.status(500).json({ error: "Failed to delete financial entry" });
    }
});


// JOINT QUERY - APIs
app.get("/joint/getAllCompaniesWith2022RevenuesGreaterThan100KInTheUK", async (req, res) => {
    try {
        const query = await dbj.getAllCompaniesWith2022RevenuesGreaterThan100KInTheUK();
        res.status(200).json({ query });
    } catch (error) {
        console.error("Error getting query:", error);
        res.status(500).json({ error: "Failed to retrieve query" });
    }
});

app.get("/joint/getCountOfCompaniesByCountry", async (req, res) => {
    try {
        const query = await dbj.getCountOfCompaniesByCountry();
        res.status(200).json({ query });
    } catch (error) {
        console.error("Error getting query:", error);
        res.status(500).json({ error: "Failed to retrieve query" });
    }
});


// TEST API
app.get("/test", (req, res) => {
    res.status(200).json({ success: true });
})


app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});