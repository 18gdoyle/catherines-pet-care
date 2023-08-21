const { connect, disconnect } = require('../config/db.config');
const { PendingGreetAppointment } = require('../model/pendingGreetAppointment.model');
const { GreetAppointment } = require('../model/greetAppointment.model');
const { Employee } = require('../model/employee.model');
const { Customer } = require('../model/customer.model');
const { RecurringVisits } = require('../model/recurringVisits.model');
const { OneOffVisits } = require('../model/oneOffVisits.model');
const { EmployeeRecurringVisits } = require('../model/employeeRecurringVisits.model');
const { EmployeeOneOffVisits } = require('../model/employeeOneOffVisits.model');


class MongoDBTasks {

  constructor() {
      connect();
  }

  //EMPLOYEE

  async getEmployee(email) {
    try {
      const employee = await Employee.find({email: email});
      return employee
    } catch (error) {
      throw error;
    }
  }

  async getAllEmployees() {
    try {
      const employees = await Employee.find();
      return employees;
    } catch (error) {
      throw error;
    }
  }

  //ONE OFF VISITS

  async upsertOneOffVisits(oneOffVisits) {
    let data = {};
    try {
      data = await OneOffVisits.updateOne({email: oneOffVisits.email}, oneOffVisits, {upsert: true})
    } catch (error) {
      throw error;
    }
    return data;
  }

  async getOneOffVisitsForCustomer(email) {
    try {
      return await OneOffVisits.find({email: email});
    } catch (error) {
      throw error;
    }
  }

  async getAllOneOffVisits() {
    try {
      return await OneOffVisits.find();
    } catch (error) {
      throw error;
    }
  }

  //EMPLOYEE ONE OFF VISITS

  async upsertEmployeeOneOffVisits(oneOffVisits) {
    let data = {};
    try {
      data = await EmployeeOneOffVisits.updateOne({email: oneOffVisits.email}, oneOffVisits, {upsert: true})
    } catch (error) {
      throw error;
    }
    return data;
  }

  async getEmployeeOneOffVisits(email) {
    try {
      const recurringVisits = await EmployeeOneOffVisits.find({email: email});
      return recurringVisits;
    } catch (error) {
      throw error;
    }
  }

  //RECURRING VISITS

  async upsertRecurringVisits(recurringVisits) {
      let data = {};
      try {
        data = await RecurringVisits.updateOne({email: recurringVisits.email}, recurringVisits, {upsert: true})
      } catch (error) {
        throw error;
      }
      return data;
  }

  async getRecurringVisitsForCustomer(email) {
    try {
      const recurringVisits = await RecurringVisits.find({email: email});
      return recurringVisits;
    } catch (error) {
      throw error;
    }
  }

  async getAllRecurringVisits() {
    try {
      return await RecurringVisits.find();
    } catch (error) {
      throw error
    }
  }

  //EMPLOYEE RECURRING VISITS

  async upsertEmployeeRecurringVisits(recurringVisits) {
    let data = {};
    try {
      data = await EmployeeRecurringVisits.updateOne({email: recurringVisits.email}, recurringVisits, {upsert: true})
    } catch (error) {
      throw error;
    }
    return data;
  }

  async getEmployeeRecurringVisits(email) {
    try {
      const recurringVisits = await EmployeeRecurringVisits.find({email: email});
      return recurringVisits;
    } catch (error) {
      throw error;
    }
  }

  //CUSTOMERS

  async getCustomer(email) {
    try {
      const customer = await Customer.find({email: email});
      return customer;
    } catch (error) {
      throw error;
    }
  }

  async createCustomer(customer) {
    let data = {};
    try {
      data = await Customer.create(customer);
    } catch(err) {
      throw err;
    }
    return data;
  }

  async upsertCustomer(customer) {
    let data = {};
    try {
      data = await Customer.updateOne({email: customer.email}, customer, {upsert: true})
    } catch (error) {
      throw error;
    }
    return data;
  }

  //MEET AND GREETS

  async createGreetAppointment(greetAppointment) {
    let data = {};
    try {
      data = await GreetAppointment.create(greetAppointment);
    } catch(err) {
      throw err;
    }
    return data;
  }

  async getGreetAppointments(assignedEmployee) {
    try {
      const appointments = await GreetAppointment.find({assignedEmployee: assignedEmployee});
      return appointments;
    } catch (error) {
      throw error;
    }
  }

  async getGreetAppointmentByCustomerEmail(customerEmail) {
    try {
      const appointment = await GreetAppointment.find({email: customerEmail});
      return appointment;
    } catch (error) {
      throw error;
    }
  }

  async deleteGreetAppointment(id) {
    let data = {};
    try {
      data = await GreetAppointment.deleteOne({_id : id});
    } catch(err) {
      throw err;
    }
    return data;
  }

  //PENDING MEET AND GREETS

  async getPendingGreetAppointments() {
    try {
      const appointments = await PendingGreetAppointment.find();
      return appointments;
    } catch (error) {
      throw error;
    }
  }

  async getPendingGreetAppointmentsByCustomer(customerEmail) {
    try {
      const appointments = await PendingGreetAppointment.find({email: customerEmail});
      return appointments;
    } catch (error) {
      throw error;
    }
  }

  async createPendingGreetAppointment(greetAppointment) {
    let data = {};
    try {
      data = await PendingGreetAppointment.create(greetAppointment);
    } catch(err) {
      throw err;
    }
    return data;
  }

  async deletePendingGreetAppointment(id) {
    let data = {};
    try {
      data = await PendingGreetAppointment.deleteOne({_id : id});
    } catch(err) {
      throw err;
    }
    return data;
  }
}

module.exports = new MongoDBTasks();
