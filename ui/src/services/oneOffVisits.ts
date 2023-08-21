export async function createOneOffVisits(visitInfo: any) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify(visitInfo);

  let requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
  };

  return await fetch(import.meta.env.VITE_API_URL + "/api/oneoffvisits", requestOptions)
  .then(response => response.text())
  .then(result => { return result; })
  .catch(error => { throw error; });
}

export async function getOneOffVisitsForCustomer(idToken: string, email: string) {
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let raw = JSON.stringify({idToken: idToken, email: email});

  let requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
  };

  return await fetch(import.meta.env.VITE_API_URL + "/api/getoneoffvisitsforcustomer", requestOptions)
  .then(response => response.text())
  .then(result => { return JSON.parse(result); })
  .catch(error => { throw error; });
}

export async function getAllOneOffVisits(idToken: string, email: string) {
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let raw = JSON.stringify({idToken: idToken, email: email});

  let requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
  };

  return await fetch(import.meta.env.VITE_API_URL + "/api/getalloneoffvisits", requestOptions)
  .then(response => response.text())
  .then(result => { return JSON.parse(result); })
  .catch(error => { throw error; });
}