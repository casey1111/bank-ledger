const apiUrl = 'http://localhost:8080/api';

const formatCurrency = amount => {
  return `$ ${amount.toFixed(2)}`;
};

const callApi = (endPoint, method = 'GET', body) => {

  const options = {
    method,
    body,
    headers: { "Content-Type": "application/json" },
  };

  return fetch(`${apiUrl}/${endPoint}`, options);
};

export {
  formatCurrency,
  callApi,
}