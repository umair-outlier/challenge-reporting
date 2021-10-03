
const knex = require('../db')

module.exports = {
  findById
}

async function find (conditions = {}) {
  return knex('students').select('*').where(conditions)
}

async function findById (id) {
  const record = await find({ id })
  return record[0] || null
}
