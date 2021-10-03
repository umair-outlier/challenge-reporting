const _ = require('lodash')
const knex = require('../db')
const testStudents = require('../mocks/test-students.json')
const IS_TEST = process.env.NODE_ENV === 'test'

module.exports = {
  findById
}

async function find (conditions = {}) {
  return knex('students').select('*').where(conditions)
}

async function findById (id) {
  if (IS_TEST) return _.find(testStudents, { id: Number(id) }) || null

  const record = await find({ id })
  return record[0] || null
}
