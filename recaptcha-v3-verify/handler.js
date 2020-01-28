'use strict';
const axios = require('axios');
const myDomain = process.env.DOMAIN;
const mySecret = process.env.SECRET;


// helper function for returning status
function generateResponse (code, body) {
  return {
    statusCode: code,
    headers: {
      "Access-Control-Allow-Origin" : myDomain,
      'Access-Control-Allow-Headers': 'x-requested-with',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(body)
  };
};

// Google reCaptcha V3 serverless verify function
module.exports.verify = async (event) => {
  const data = JSON.parse(event.body);

  // check if data is set
  if ( data === null || data === undefined ) {
    console.log('Bad request. No body.');
    return generateResponse(400, 'Bad request');
  }

  // check if token is set
  if ( data.token === null || data.token === undefined ) {
    console.log('Bad request. Token not set');
    return generateResponse(400, 'Bad request');
  }

  const result = await axios({
    method: 'post',
    url: 'https://www.google.com/recaptcha/api/siteverify',
    params: { secret: mySecret, response: data.token }
  }).then( response => response.data);

  return generateResponse(200, result);
};