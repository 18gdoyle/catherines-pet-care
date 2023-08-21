

export async function createMeetAndGreet(greetAppointmentData: any) {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify(greetAppointmentData);

    let requestOptions: RequestInit = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return await fetch(import.meta.env.VITE_API_URL + "/api/pendinggreetappointment", requestOptions)
    .then(response => response.text())
    .then(result => { return result; })
    .catch(error => { throw error; });
}

export async function getPendingGreetAppointment(customerEmail: string) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let requestOptions: RequestInit = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return await fetch(import.meta.env.VITE_API_URL + "/api/pendinggreetappointment/" + customerEmail, requestOptions)
    .then(response => response.text())
    .then(result => {
        return JSON.parse(result);
    })
    .catch(error => {
        throw error;
    });
}

export async function getAllPendingGreetAppointments() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let requestOptions: RequestInit = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return await fetch(import.meta.env.VITE_API_URL + "/api/pendinggreetappointment", requestOptions)
    .then(response => response.text())
    .then(result => {
        return JSON.parse(result);
    })
    .catch(error => {
        throw error;
    });
}

export async function deletePendingGreetAppointmentById(appointmentID: string) {
    let requestOptions: RequestInit = {
        method: 'DELETE',
    }

    return await fetch(import.meta.env.VITE_API_URL + "/api/pendinggreetappointment/" + appointmentID, requestOptions)
    .then(response => response.text())
    .then(result => { return result; })
    .catch(error => { throw error; });
}

export async function deleteGreetAppointmentById(appointmentID: string) {
    let requestOptions: RequestInit = {
        method: 'DELETE',
    }

    return await fetch(import.meta.env.VITE_API_URL + "/api/greetappointment/" + appointmentID, requestOptions)
    .then(response => response.text())
    .then(result => { return result; })
    .catch(error => { throw error; });
}

export async function createApprovedGreetAppointment(greetAppointmentData: any) {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify(greetAppointmentData);

    let requestOptions: RequestInit = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return await fetch(import.meta.env.VITE_API_URL + "/api/greetappointment", requestOptions)
    .then(response => response.text())
    .then(result => { return result; })
    .catch(error => { throw error; });
}

export async function getGreetAppointment(customerEmail: string) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let requestOptions: RequestInit = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return await fetch(import.meta.env.VITE_API_URL + "/api/greetappointmentbycustomer/" + customerEmail, requestOptions)
    .then(response => response.text())
    .then(result => {
        return JSON.parse(result);
    })
    .catch(error => {
        throw error;
    });
}

export async function getEmployeesGreetAppointments(employeeEmail: string) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let requestOptions: RequestInit = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
  };

  return await fetch(import.meta.env.VITE_API_URL + "/api/greetappointment/" + employeeEmail, requestOptions)
  .then(response => response.text())
  .then(result => {
      return JSON.parse(result);
  })
  .catch(error => {
      throw error;
  });
}