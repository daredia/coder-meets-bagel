const fetch = require('node-fetch');

parseHtmlResponse = (html) => {
  // html response contains a string that looks like this example:
  // `window.location = "cmb:///redeem_bagel/145032/14adc3ed/3618566/?link_click_id=<...>";`
  const dataPrefix = 'redeem_bagel/';
  const htmlParts = html.split(dataPrefix);
  const dataParts = htmlParts[1].split('/');
  return {
    'redeem_profile_id': dataParts[0],
    'validation_code': dataParts[1],
    'sent_by_profile_id': dataParts[2],
  };
};

module.exports = {
  getBagelDeeplink: (receivedBagelLink) => {
    // example of a received bagel link: http://cmb.gs/rKzc/gDcc23CfYB
    const bagelPathPrefix = 'rKzc';
    // example of a deeplink for redeeming a bagel: https://bnc.lt/rKzc/lfVzNtxIVB
    const bagelDeeplinkPrefix = 'https://bnc.lt/rKzc/';

    const bagelPathIndex = receivedBagelLink.indexOf(bagelPathPrefix) + 5;
    const bagelPath = receivedBagelLink.slice(bagelPathIndex);
    return bagelDeeplinkPrefix + bagelPath;
  },
  
  getBagelData: (endpoint, response) => {
    const headers = {
      'Host': 'bnc.lt',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Cookie': '_s=REd9NA6Z4Cwsp3Ixr5WcIJzYUj9Tdos5orVJxc8CoFrhYPtcFqde5T34yXPMlrni',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_3_3 like Mac OS X) AppleWebKit/601.1 (KHTML, like Gecko) CriOS/57.0.2987.100 Mobile/13G34 Safari/601.1.46',
      'Accept-Language': 'en-us',
      'Accept-Encoding': 'gzip, deflate',
    };

    fetch(endpoint, {
      method: 'GET',
      headers: headers
    })
    .then(res => res.text())
    .then(html => response.status(200).json(parseHtmlResponse(html)))
    .catch(err => response.status(400).json(err));
  },
};
