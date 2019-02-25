const http = require('http');

// cookie session id from REST API.
// Using cookie instead of making it completely stateless (ie, not using Oauth or JWT..)
// to reduce some complexity.
let JSESSIONID = '';

const parseHeaders = headers => {
  if (headers && headers['set-cookie']) {
    const cookie = headers['set-cookie'][0];
    JSESSIONID = cookie.split('=')[1].split(';')[0];
  }
};

// return new object of default options for HTTP request
const defaultOptions = () => {
  return {
    host: 'localhost',
    port: 8080,
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `JSESSIONID=${JSESSIONID}`
    }
  };
};

/**
 * safely parse parameter as JSON
 *
 * @param json
 * @returns {*}
 */
const parseJson = json => {
  try {
    return JSON.parse(json);
  } catch (e) {
    return undefined;
  }
};

/**
 * Perform HTTP POST request to API and sending 'requestBody'
 * @param path
 * @param requestBody
 * @returns {Promise<*>}
 */
const postRequest = async (path, requestBody) => {
  requestBody = JSON.stringify(requestBody);
  const options = defaultOptions();
  options.path = path;
  options.method = 'POST';
  options.headers['Content-Length'] = Buffer.byteLength(requestBody);

  // wrap request call-back as a promise
  return new Promise((resolve, reject) => {
    let body = '';
    const req = http.request(options, res => {
      res.setEncoding(('utf8'));
      res.on('data', chunk => {
        body += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          parseHeaders(res.headers);
          resolve({
            body, // store unparsed data
            status: res.statusCode, // store HTTP Response Status
            json: parseJson(body) // attempt to parse body as JSON to make it easy on caller.
          })
        } else {
          reject({
            body,
            status: res.statusCode,
            json: parseJson(body)
          })
        }
      });

      res.on('error', () => {
        reject({
          status: res.statusCode,
          json: parseJson(body)
        })
      })
    });

    req.on('error', () => {
      reject({
        status: 500,
        body: 'Unable to connect to Ledger API'
      });
    });
    req.write(requestBody);
    req.end();
  });
};

/**
 * Perform HTTP GET request to API
 * @param path
 * @returns {Promise<*>}
 */
const getRequest = async path => {
  const options = defaultOptions();
  options.path = path;
  options.method = 'GET';

  // wrap request callback as a promise
  return new Promise((resolve, reject) => {
    let body = '';
    const req = http.request(options, res => {
      res.setEncoding(('utf8'));
      res.on('data', chunk => {
        body += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({
            body,
            status: res.statusCode,
            json: parseJson(body)
          })
        } else {
          reject({
            body: res.statusCode === 401 ? 'Unauthorized' : body,
            status: res.statusCode,
            json: parseJson(body)
          })
        }
      });

      res.on('error', () => {
        reject({
          status: res.statusCode,
          json: parseJson(body)
        })
      })
    });

    req.on('error', () => {
      reject({
        status: 500,
        body: 'Unable to connect to Ledger API'
      });
    });
    req.end();
  });
};

const createAccount = (username, password) => {
  return postRequest('/api/account', {
    username,
    password
  })
};

const login = (username, password) => {
  return postRequest('/api/login', {
    username,
    password
  })
};

const logout = () => {
  return getRequest('/api/logout');
};

const createTransaction = (memo, transactionType, date, amount) => {
  return postRequest('/api/transactions', {
    memo,
    transactionType,
    date,
    amount
  })
};

const getTransactionHistory = () => {
  return getRequest('/api/account');
};

module.exports = {
  createAccount,
  login,
  logout,
  createTransaction,
  getTransactionHistory
};