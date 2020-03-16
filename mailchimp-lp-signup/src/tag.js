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

exports.handler = async event => {
  const data = JSON.parse(event.body);
  
  // check input
  if (!data.email) {
    console.log('No email included in body.');
    return generateResponse(400, 'Bad request.');
  }

  if (!data.tags) {
    console.log('No tags provided.');
    return generateResponse(400, 'Bad request.');
  }

  // generate hash
  let hash = crypto.createHash('md5').update(data.email).digest('hex');
  const tags = new Array();

  data.tags.forEach(tag => {
    tags.push({
      'name': tag,
      'status': 'active'
    });
  });
  
  // generate payload
  const payload = {
    'tags': tags
  }

  // generate url
  const url = `https://${dataCenter}.api.mailchimp.com/3.0/lists/${listId}/members/${hash}/tags`;

  // send request
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

    return generateResponse(200, 'Tag added to subscriber.');
  } catch (err) {
    console.log(err.message);
    return generateResponse(400, 'Internal server error');
  }
}