const knex = require("./knex");

function getAllCompaniesWith2022RevenuesGreaterThan100KInTheUK() {
    return knex("financials")
      .leftJoin("companies", "financials.company_id", "companies.id")
      .where("companies.country_code", "GB")
      .where("financials.year", 2022)
      .where("financials.revenue_gbp", ">", 100000)
      .select("*");
  }

  function getCountOfCompaniesByCountry() {
    return knex("companies")
      .select("country")
      .count("* as count")
      .groupBy("country");
  }



module.exports = {
    getAllCompaniesWith2022RevenuesGreaterThan100KInTheUK,
    getCountOfCompaniesByCountry
}