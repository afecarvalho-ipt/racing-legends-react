const apiUrl =
  "https://ipt-ti2-racinglegends-api.eu-gb.mybluemix.net/";

async function getJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json"
    }
  });

  if (response.ok) {
    return await response.json();
  } else {
    return Promise.reject(response);
  }
}

export async function getCategories() {
  return await getJson(apiUrl + "/api/v1/categories");
}

export function getCategoryImage(categoryId) {
  return (
    apiUrl + "/api/v1/categories/" + categoryId + "/image"
  );
}

export async function getDriversByCategory(categoryId) {
  return await getJson(
    apiUrl + "/api/v1/categories/" + categoryId + "/drivers"
  );
}

export function getDriverImage(driverId) {
  return apiUrl + "/api/v1/drivers/" + driverId + "/image";
}

export async function getDriverDetailsById(driverId) {
  return await getJson(
    apiUrl + "/api/v1/drivers/" + driverId
  );
}
