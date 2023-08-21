export async function upsertEmployeeRecurringVisit(visitInfo: any) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify(visitInfo);

  let requestOptions: RequestInit = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
  };

  return await fetch(import.meta.env.VITE_API_URL + "/api/employeerecurringvisits", requestOptions)
  .then(response => response.text())
  .then(result => { return result; })
  .catch(error => { throw error; });
}

export async function getEmployeeRecurringVisits(idToken: string, email: string) {
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let raw = JSON.stringify({idToken: idToken, email: email});

  let requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
  };

  return await fetch(import.meta.env.VITE_API_URL + "/api/getemployeerecurringvisits", requestOptions)
  .then(response => response.text())
  .then(result => { return JSON.parse(result); })
  .catch(error => { throw error; });
}

export async function getEmployeeRecurringVisitsForCustomer(idToken: string, email: string, employeeEmail: string) {
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let raw = JSON.stringify({idToken: idToken, email: email, employeeEmail: employeeEmail});

  let requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
  };

  return await fetch(import.meta.env.VITE_API_URL + "/api/getemployeerecurringvisitsforcustomer", requestOptions)
  .then(response => response.text())
  .then(result => { return JSON.parse(result); })
  .catch(error => { throw error; });
}