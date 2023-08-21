export async function upsertEmployeeOneOffVisit(visitInfo: any) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify(visitInfo);

  let requestOptions: RequestInit = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
  };

  return await fetch(import.meta.env.VITE_API_URL + "/api/employeeoneoffvisits", requestOptions)
  .then(response => response.text())
  .then(result => { return result; })
  .catch(error => { throw error; });
}

export async function getEmployeeOneOffVisits(idToken: string, email: string) {
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let raw = JSON.stringify({idToken: idToken, email: email});

  let requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
  };

  return await fetch(import.meta.env.VITE_API_URL + "/api/getemployeeoneoffvisits", requestOptions)
  .then(response => response.text())
  .then(result => { return JSON.parse(result); })
  .catch(error => { throw error; });
}

export async function getEmployeeOneOffVisitsForCustomer(idToken: string, email: string, employeeEmail: string) {
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let raw = JSON.stringify({idToken: idToken, email: email, employeeEmail: employeeEmail});

  let requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
  };

  return await fetch(import.meta.env.VITE_API_URL + "/api/getemployeeoneoffvisitsforcustomer", requestOptions)
  .then(response => response.text())
  .then(result => { return JSON.parse(result); })
  .catch(error => { throw error; });
}