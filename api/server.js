const express = require('express');
var cors = require('cors')
const bodyParser = require('body-parser');
require('dotenv').config()

const admin = require("firebase-admin");

const serviceAccount = require("./catherines-pet-care-firebase-adminsdk-da460-f444523fc8.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const mongoDBTasks = require('./tasks/mongoDB.tasks');
const { response } = require('express');

const app = express();
const port = process.env.PORT || 3000;

var whitelist = ['http://127.0.0.1:5173', 'http://localhost:5173', 'http://localhost:3000', 'https://catherines-pet-care.uk.r.appspot.com', 
    //'https://a0ff-2601-41-c401-8ac0-998f-69d0-d7cf-850f.ngrok.io'
]

let corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
    }
}

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.static('dist'));

//EMPLOYEES

app.post('/api/getemployee', async (req, res) => {
  let response;
  try {
    response = await admin.auth().verifyIdToken(req.body.idToken);
  } catch (error) {
    res.json(error);
    return;
  }
  let data = null;
  if (response.email === req.body.email) {
    data = await mongoDBTasks.getEmployee(req.body.email);
  }
  res.json(data);
})

app.post('/api/getallemployees', async (req, res) => {
  if (req.body.secretCode = '398b80f2-e1a8-4bf9-b33c-7bfa69c5964c') {
    let data = await mongoDBTasks.getAllEmployees();
    res.json(data);
  } else {
    res.json('access denied');
  }
})

//ONE OFF VISITS

app.post('/api/oneoffvisits', async (req, res) => {
  let data = await mongoDBTasks.upsertOneOffVisits(req.body);
  res.json(data);
})

app.post('/api/getoneoffvisitsforcustomer', async (req, res) => {
    let response;
    try {
        response = await admin.auth().verifyIdToken(req.body.idToken);
    } catch (error) {
        res.json(error);
        return;
    }
  let data = null;
  if (response.email === req.body.email) {
    data = await mongoDBTasks.getOneOffVisitsForCustomer(req.body.email);
  }
  res.json(data);
})

app.post('/api/getalloneoffvisits', async (req, res) => {
  let response;
    try {
        response = await admin.auth().verifyIdToken(req.body.idToken);
    } catch (error) {
        res.json(error);
        return;
    }
  let data = null;
  if (response.email === req.body.email) {
    data = await mongoDBTasks.getAllOneOffVisits();
  }
  res.json(data);
})

//EMPLOYEE ONE OFF VISITS

app.put('/api/employeeoneoffvisits', async (req, res) => {
  let data = await mongoDBTasks.upsertEmployeeOneOffVisits(req.body);
  res.json(data);
})

app.post('/api/getemployeeoneoffvisits', async (req, res) => {
  let response;
  try {
      response = await admin.auth().verifyIdToken(req.body.idToken);
  } catch (error) {
      res.json(error);
      return;
  }
  let data = null;
  if (response.email === req.body.email) {
      data = await mongoDBTasks.getEmployeeOneOffVisits(req.body.email);
  }
  res.json(data);
})

app.post('/api/getemployeeoneoffvisitsforcustomer', async (req, res) => {
  let response;
  try {
    response = await admin.auth().verifyIdToken(req.body.idToken);
  } catch (error) {
    res.json(error);
    return;
  }
  let data = null;
  if (response.email === req.body.email) {
    data = await mongoDBTasks.getEmployeeOneOffVisits(req.body.employeeEmail);
  }
  res.json(data);
})

//RECURRING VISITS

app.put('/api/recurringvisits', async (req, res) => {
    let data = await mongoDBTasks.upsertRecurringVisits(req.body);
    res.json(data);
})

app.post('/api/getrecurringvisitsforcustomer', async (req, res) => {
    let response;
    try {
        response = await admin.auth().verifyIdToken(req.body.idToken);
    } catch (error) {
        res.json(error);
        return;
    }
    let data = null;
    if (response.email === req.body.email) {
        data = await mongoDBTasks.getRecurringVisitsForCustomer(req.body.email);
    }
    res.json(data);
})

app.post('/api/getallrecurringvisits', async (req, res) => {
    let response;
    try {
        response = await admin.auth().verifyIdToken(req.body.idToken);
    } catch (error) {
        res.json(error);
        return;
    }
    let data = null;
    if (response.email === req.body.email) {
        data = await mongoDBTasks.getAllRecurringVisits();
    }
    res.json(data);
})

//EMPLOYEE RECURRING VISITS

app.put('/api/employeerecurringvisits', async (req, res) => {
  let data = await mongoDBTasks.upsertEmployeeRecurringVisits(req.body);
  res.json(data);
})

app.post('/api/getemployeerecurringvisits', async (req, res) => {
  let response;
  try {
      response = await admin.auth().verifyIdToken(req.body.idToken);
  } catch (error) {
      res.json(error);
      return;
  }
  let data = null;
  if (response.email === req.body.email) {
      data = await mongoDBTasks.getEmployeeRecurringVisits(req.body.email);
  }
  res.json(data);
})

app.post('/api/getemployeerecurringvisitsforcustomer', async (req, res) => {
  let response;
  try {
      response = await admin.auth().verifyIdToken(req.body.idToken);
  } catch (error) {
      res.json(error);
      return;
  }
  let data = null;
  if (response.email === req.body.email) {
      data = await mongoDBTasks.getEmployeeRecurringVisits(req.body.employeeEmail);
  }
  res.json(data);
})

//CUSTOMERS

app.post('/api/getcustomer', async (req, res) => {
    let response;
    try {
        response = await admin.auth().verifyIdToken(req.body.idToken);
    } catch (error) {
        res.json(error);
        return;
    }
    let data = null;
    if (response.email === req.body.email) {
        data = await mongoDBTasks.getCustomer(req.body.email);
    }
    res.json(data);
})

app.post('/api/customer', async (req, res) => {
    let data = await mongoDBTasks.createCustomer(req.body);
    res.json(data);
})

app.put('/api/customer', async (req, res) => {
    let data = await mongoDBTasks.upsertCustomer(req.body);
    res.json(data);
})

app.get('/api/customer/:email', async (req, res) => {
    let data = await mongoDBTasks.getCustomer(req.params.email);
    res.json(data);
})

//GREET APPOINTMENTS

app.post('/api/greetappointment', async (req, res) => {
    let data = mongoDBTasks.createGreetAppointment(req.body);
    res.json(data);
})

app.get('/api/greetappointment/:email', async (req, res) => {
    let data = await mongoDBTasks.getGreetAppointments(req.params.email);
    res.json(data);
})

app.get('/api/greetappointmentbycustomer/:email', async (req, res) => {
    let data = await mongoDBTasks.getGreetAppointmentByCustomerEmail(req.params.email);
    res.json(data);
})

app.delete('/api/greetappointment/:id', async (req, res) => {
    let data = mongoDBTasks.deleteGreetAppointment(req.params.id);
    res.json(data);
})

//PENDING GREET APPOINTMENTS

app.post('/api/pendinggreetappointment', async (req, res) => {
    let data = await mongoDBTasks.createPendingGreetAppointment(req.body);
    res.json(data);
});

app.get('/api/pendinggreetappointment', async (req, res) => {
    let data = await mongoDBTasks.getPendingGreetAppointments();
    res.json(data);
});

app.get('/api/pendinggreetappointment/:customeremail', async (req, res) => {
    let data = await mongoDBTasks.getPendingGreetAppointmentsByCustomer(req.params.customeremail)
    res.json(data);
});

app.delete('/api/pendinggreetappointment/:id', async (req, res) => {
    let data = await mongoDBTasks.deletePendingGreetAppointment(req.params.id)
    res.json(data);
})

//SERVE PAGE

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/dist/index.html'));
});

app.listen(port, () => {
    console.log(`Server listening on the port  ${port}`);
})