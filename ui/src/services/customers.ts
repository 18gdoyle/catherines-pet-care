export async function getCustomerInfo(idToken: string, email: string) {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({idToken: idToken, email: email});

    let requestOptions: RequestInit = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return await fetch(import.meta.env.VITE_API_URL + "/api/getcustomer", requestOptions)
    .then(response => response.text())
    .then(result => { return JSON.parse(result); })
    .catch(error => { throw error; });
}

export async function createCustomer(customerData: any) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(customerData);

    let requestOptions: RequestInit = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return await fetch(import.meta.env.VITE_API_URL + "/api/customer", requestOptions)
    .then(response => response.text())
    .then(result => { return result; })
    .catch(error => { throw error; });
}

export async function upsertCustomer(customer: any) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(customer);

    let requestOptions: RequestInit = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return await fetch(import.meta.env.VITE_API_URL + "/api/customer", requestOptions)
    .then(response => response.text())
    .then(result => { return result; })
    .catch(error => { throw error; });
}