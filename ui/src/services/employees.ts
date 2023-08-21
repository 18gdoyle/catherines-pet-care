
export async function getEmployeeInfo(idToken: string, email: string) {
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let raw = JSON.stringify({idToken: idToken, email: email});

  let requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
  };

  return await fetch(import.meta.env.VITE_API_URL + "/api/getemployee", requestOptions)
  .then(response => response.text())
  .then(result => { return JSON.parse(result); })
  .catch(error => { throw error; });
}

export async function getAllEmployees() {
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let raw = JSON.stringify({secretCode: '398b80f2-e1a8-4bf9-b33c-7bfa69c5964c'});

  let requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
  };

  return await fetch(import.meta.env.VITE_API_URL + "/api/getallemployees", requestOptions)
  .then(response => response.text())
  .then(result => { return JSON.parse(result); })
  .catch(error => { throw error; });
}

