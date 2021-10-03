const _ = require('lodash')
const gradesData = require('../grades.json')
const testGrades = require('../mocks/test-grades.json')
const IS_TEST = process.env.NODE_ENV === 'test'

module.exports = {
  getCourseStats
}

function getCourseStats () {
  const grades = _.groupBy(IS_TEST ? testGrades : gradesData, 'course')
  const stats = Object.keys(grades).map(course => {
    const gradesData = grades[course]
    const max = _.maxBy(gradesData, 'grade').grade
    const min = _.minBy(gradesData, 'grade').grade
    const avg = _.meanBy(gradesData, 'grade')

    return { course, max: max, min: min, avg: Number(parseFloat(avg).toFixed(2)) }
  })

  return stats
}
