const knex = require("./knex");

function createCompany(company) {
    return knex("companies").insert(company);
};

function getAllCompanies() {
    return knex("companies").select("*");
};

function deleteCompany(id) {
    return knex("companies").where("id", id).del();
};

function updateCompany(id, company) {
    return knex("companies").where("id", id).update(company)
}

module.exports = {
    createCompany,
    getAllCompanies,
    deleteCompany,
    updateCompany
}