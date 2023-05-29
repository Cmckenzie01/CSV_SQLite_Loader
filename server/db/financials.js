const knex = require("./knex");

async function createFinancial(financials) {
    // RETRIEVE COMPANY ID VALUES FROM COMPANIES TABLE
    const companyMapping = {};
    const companies = await knex('companies').select('name', 'id');
    for (const { name, ID } of companies) {
      companyMapping[name] = ID;
    }
  
    // MAP COMPANY NAMES TO IDS AND RETURN UPDATED FINANCIAL DATA
    const financialsData = financials.map(({ name, year, revenue_usd, revenue_gbp }) => {
      const companyId = companyMapping[name];
      if (!companyId) {
        throw new Error(`Company with name '${name}' not found.`);
      }
      return {
        company_id: companyId,
        year,
        revenue_usd,
        revenue_gbp
      };
    });
  
    // INSERT FINANCIAL DATA
    const result = await knex('financials').insert(financialsData);
  
    return result;
  }

function getAllFinancials() {
    return knex("financials").select("*");
};

function deleteFinancial(id) {
    return knex("financials").where("id", id).del();
};

function updateFinancial(id, financial) {
    return knex("financials").where("id", id).update(financial)
}

module.exports = {
    createFinancial,
    getAllFinancials,
    deleteFinancial,
    updateFinancial
}