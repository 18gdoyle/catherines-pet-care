

export async function getTravelTime(location1: string, location2: string) {
  let location1Encoded = encodeURIComponent(location1);
  let location2Encoded = encodeURIComponent(location2);
  
  let requestOptions: RequestInit = {
    method: "GET",
    redirect: "follow"
  };

  return await fetch("https://dev.virtualearth.net/REST/v1/Routes?wayPoint.1=" + location2Encoded + "[address]&waypoint.2=" + location1Encoded + "[address]&distanceUnit=mi&key=AjC_Oq8NOrJZHTVqrjFCq6oVkF8v6nPOkLFkqM6csftnXOWgyAu0l88CT8-YFjQ3", requestOptions)
  .then(response => response.text())
  .then(result => {
    let driveInSeconds = JSON.parse(result).resourceSets[0].resources[0].routeLegs[0].travelDuration;
    return driveInSeconds;
  })
  .catch(error => {
    throw error;
  });
}

export async function getAddressAutoFill(text: string) {
    let requestOptions = {
        method: "GET",
    };
    return await fetch("https://dev.virtualearth.net/REST/v1/Autosuggest?query=" + text + "&key=AjC_Oq8NOrJZHTVqrjFCq6oVkF8v6nPOkLFkqM6csftnXOWgyAu0l88CT8-YFjQ3", requestOptions)
    .then(response => response.json())
    .then(result => {
        return result.resourceSets[0].resources[0].value;
    })
    .catch(error => {
        throw error;
    });
}