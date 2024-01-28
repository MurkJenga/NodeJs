const fetch = require('node-fetch');
const config = require('../config.json')

const returnJsonResponse = async (endpoint) => {
  try {
    const response = await fetch(endpoint);
    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    console.error('Error fetching JSON:', error);
    throw error;
  }
};

const sendJsonRequest = (data, endpoint) => {
    fetch(`${config.apiHost}/${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(data),  
    })   
}
module.exports = { returnJsonResponse, sendJsonRequest };