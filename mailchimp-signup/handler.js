'use strict';
const axios = require('axios');
const crypto = require('crypto');
const myDomain = process.env.DOMAIN || '*';
const apiKey = process.env.API_KEY;
const listId = process.env.LIST_ID;
const dataCenter = apiKey.substr(-3);

function generateResponse(code, message) {
  return {
    statusCode: code,
    headers: {
      'Access-Control-Allow-Origin': myDomain,
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(message)
  };
};

module.exports.subscribe = async event => {  
  const data = JSON.parse(event.body);
  
  if (!data.email) {
    console.log('No email included in body.');
    return generateResponse(400, 'Bad request.');
  }

  // set variables
  let hash = crypto.createHash('md5').update(data.email).digest('hex');
  const url = `https://${dataCenter}.api.mailchimp.com/3.0/lists/${listId}/members/${hash}`;
  const payload = {
    'email_address': data.email,
    'status_if_new': 'subscribed'
  };

  try {
    await axios({
      method: 'put',
      url: url,
      data: payload,
      auth: {
        username: 'ladeeda',
        password: apiKey
      }
    });

    return generateResponse(200, 'Subscriber added.');
    
  } catch (err) {
    console.log(err.message);
    return generateResponse(400, 'Bad request.');
  }
};