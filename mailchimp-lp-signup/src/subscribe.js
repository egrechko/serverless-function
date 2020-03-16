'use strict';
const axios = require('axios');
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


exports.handler = async event => {  
  const data = JSON.parse(event.body);
  
  if (!data.email) {
    console.log('No email included in body.');
    return generateResponse(400, 'Bad request.');
  }

  if (!data.phone) {
    console.log('No phone included in body.');
    return generateResponse(400, 'Bad request.');
  }

  if (!data.name) {
    console.log('No name included in body.');
    return generateResponse(400, 'Bad request.');
  }

  // set variables
  const url = `https://${dataCenter}.api.mailchimp.com/3.0/lists/${listId}/members/`;
  const payload = {
    'email_address': data.email,
    'status': 'subscribed',
    'merge_fields': {
      'FNAME': data.name,
      'PHONE': data.phone
    }
  };

  try {
    await axios({
      method: 'post',
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