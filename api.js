const knex = require('./db')
const Student = require('./models/student')
const gradesData = require('./grades.json')
const CourseService = require('./services/course')
const testGrades = require('./mocks/test-grades.json')
const IS_TEST = process.env.NODE_ENV === 'test'

module.exports = {
  getHealth,
  getStudent,
  getStudentGradesReport,
  getCourseGradesReport
}

async function getHealth (req, res, next) {
  try {
    await knex('students').first()
    res.json({ success: true })
  } catch (e) {
    console.log(e)
    res.status(500).end()
  }
}

async function getStudent (req, res) {
  const { id } = req.params
  const student = await Student.findById(id)
  if (!student) return res.status(404).json({ message: 'Student Not Found' })

  res.json(student)
}

async function getStudentGradesReport (req, res, next) {
  const student = await Student.findById(req.params.id)
  let grades = IS_TEST ? testGrades : gradesData

  grades = grades
    .filter(grade => String(grade.id) === req.params.id)
    .map(grade => ({ ...student, ...grade }))

  res.json(grades)
}

async function getCourseGradesReport (req, res) {
  const stats = CourseService.getCourseStats()
  res.json(stats)
}
