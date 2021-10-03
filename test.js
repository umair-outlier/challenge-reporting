const tape = require('tape')
const jsonist = require('jsonist')

const port = (process.env.PORT = process.env.PORT || require('get-port-sync')())
const endpoint = `http://localhost:${port}`

const server = require('./server')
const Student = require('./models/student')

tape('health', async function (t) {
  const url = `${endpoint}/health`
  try {
    const { data, response } = await jsonist.get(url)
    if (response.statusCode !== 200) {
      throw new Error('Error connecting to sqlite database; did you initialize it by running `npm run init-db`?')
    }
    t.ok(data.success, 'should have successful healthcheck')
    t.end()
  } catch (e) {
    t.error(e)
  }
})

tape('get student by id', async t => {
  const studentId = 1
  const expectedStudent = {
    id: 1,
    first_name: 'Scotty',
    last_name: 'Quigley',
    email: 'Scotty79@hotmail.com',
    is_registered: 1,
    is_approved: 1,
    password_hash: '657907e1fd8e48e2be2aa59031ff8e0f0ecf8694',
    address: '241 Denesik Knolls Apt. 955',
    city: 'Buffalo',
    state: 'ME',
    zip: '04710',
    phone: '1-503-560-6954',
    created: '1628767983203.0',
    last_login: '1628770445749.0',
    ip_address: '2.137.18.155'
  }

  const actual = await Student.findById(studentId)
  t.deepEqual(actual, expectedStudent, 'should be the same')
  t.end()
})

tape('handle invalid student id', async function (t) {
  const studentId = 'non-existent'
  const result = await Student.findById(studentId)

  t.equal(result, null)
  t.end()
})

tape('should call the get student endpoint correctly', async function (t) {
  const studentId = 5
  const url = `${endpoint}/student/${studentId}`
  const expected = {
    id: 5,
    first_name: 'Jermaine',
    last_name: 'Green',
    email: 'Jermaine_Green@yahoo.com',
    is_registered: 0,
    is_approved: 1,
    password_hash: 'aa32f328cd58706ee0ce2abed4ce573058926eca',
    address: '08515 Marty Isle Suite 443',
    city: 'Draper',
    state: 'TN',
    zip: '66697',
    phone: '791.393.7623 x454',
    created: '1628755544322.0',
    last_login: '1628737206320.0',
    ip_address: '158.212.50.124'
  }

  const { data, response } = await jsonist.get(url)
  t.deepEqual(data, expected, 'should return student data')
  t.equal(response.statusCode, 200, 'should return correct status code')
  t.end()
})

tape('should return student grades report', async function (t) {
  const studentId = 5
  const url = `${endpoint}/student/${studentId}/grades`
  const expected = [
    {
      id: 5,
      first_name: 'Jermaine',
      last_name: 'Green',
      email: 'Jermaine_Green@yahoo.com',
      is_registered: 0,
      is_approved: 1,
      password_hash: 'aa32f328cd58706ee0ce2abed4ce573058926eca',
      address: '08515 Marty Isle Suite 443',
      city: 'Draper',
      state: 'TN',
      zip: '66697',
      phone: '791.393.7623 x454',
      created: '1628755544322.0',
      last_login: '1628737206320.0',
      ip_address: '158.212.50.124',
      course: 'Microeconomics',
      grade: 69
    }, {
      id: 5,
      first_name: 'Jermaine',
      last_name: 'Green',
      email: 'Jermaine_Green@yahoo.com',
      is_registered: 0,
      is_approved: 1,
      password_hash: 'aa32f328cd58706ee0ce2abed4ce573058926eca',
      address: '08515 Marty Isle Suite 443',
      city: 'Draper',
      state: 'TN',
      zip: '66697',
      phone: '791.393.7623 x454',
      created: '1628755544322.0',
      last_login: '1628737206320.0',
      ip_address: '158.212.50.124',
      course: 'Philosophy',
      grade: 54
    },
    {
      id: 5,
      first_name: 'Jermaine',
      last_name: 'Green',
      email: 'Jermaine_Green@yahoo.com',
      is_registered: 0,
      is_approved: 1,
      password_hash: 'aa32f328cd58706ee0ce2abed4ce573058926eca',
      address: '08515 Marty Isle Suite 443',
      city: 'Draper',
      state: 'TN',
      zip: '66697',
      phone: '791.393.7623 x454',
      created: '1628755544322.0',
      last_login: '1628737206320.0',
      ip_address: '158.212.50.124',
      course: 'Statistics',
      grade: 22
    },
    {
      id: 5,
      first_name: 'Jermaine',
      last_name: 'Green',
      email: 'Jermaine_Green@yahoo.com',
      is_registered: 0,
      is_approved: 1,
      password_hash: 'aa32f328cd58706ee0ce2abed4ce573058926eca',
      address: '08515 Marty Isle Suite 443',
      city: 'Draper',
      state: 'TN',
      zip: '66697',
      phone: '791.393.7623 x454',
      created: '1628755544322.0',
      last_login: '1628737206320.0',
      ip_address: '158.212.50.124',
      course: 'Calculus',
      grade: 53
    }
  ]

  const { data } = await jsonist.get(url)
  t.deepEqual(data, expected, 'should return student data')
  t.end()
})

tape('should return student grades report', async function (t) {
  const url = `${endpoint}/course/all/grades`
  const expected = [
    { course: 'Calculus', max: 100, min: 0, avg: 50.12 },
    { course: 'Microeconomics', max: 100, min: 0, avg: 49.8 },
    { course: 'Statistics', max: 100, min: 0, avg: 49.99 },
    { course: 'Astronomy', max: 100, min: 0, avg: 49.96 },
    { course: 'Philosophy', max: 100, min: 0, avg: 49.87 }
  ]

  const { data } = await jsonist.get(url)
  t.deepEqual(data, expected, 'should return student data')
  t.end()
})

tape('cleanup', function (t) {
  server.closeDB()
  server.close()
  t.end()
})
