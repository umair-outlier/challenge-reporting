const knex = require('./db')
const Student = require('./models/student')
const gradesData = require('./grades.json')
const CourseService = require('./services/course')

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
  const grades = gradesData
    .filter(grade => String(grade.id) === req.params.id)
    .map(grade => ({ ...student, ...grade }))

  res.json(grades)
}

async function getCourseGradesReport (req, res) {
  const stats = CourseService.getCourseStats()
  res.json(stats)
}
