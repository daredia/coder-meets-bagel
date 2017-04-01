const fetch = require('node-fetch');

const myProfileId = '35411';

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
    .catch(err => response.status(400).json({err: err, endpoint: endpoint, requestHeaders: headers}));
  },

  getBagelId: (profileId, response) => {
    const endpoint = 'https://api.coffeemeetsbagel.com/bagels?embed=profile&prefetch=true';
    
    const headers = {
      'Host': 'api.coffeemeetsbagel.com',
      'Accept': 'application/json; version=3.0',
      'AppStore-Version': '3.25.0',
      'App-Version': '698',
      'Facebook-Auth-Token': 'EAAD4bKUPbR8BAIZCfeDgW06YP310jOxdfU0WDeFBMJAfs7Ds6eISTvyxtAElAeoTMxRyZAAMkj4Jew7ArEOG5bLbjTMilyUmqm4y3tbJbQiOFGZCeevkqZCLlRJozA5HEIXruS8qsbJuS5w1BL3ZBdtkZB34VsIuvnSnn2XHAy0TzlXokaoZBi8FThdDGj7ge3J3HsZCZAFZAF51TMkjJsppdsk5wo6POz8RIZD',
      'Accept-Language': 'en-US;q=1',
      'Accept-Encoding': 'gzip, deflate',
      'Cookie': 'csrftoken=SqHigc2vn9JEgjekXea5huTXx1IzLJ9B; sessionid=8tykekyoukx01auxyymcy0y5ydqfgrju',
      'User-Agent': 'Coffee Meets Bagel/3.25.0 (iPhone; iOS 9.3.3; Scale/2.00)',
      'Facebook-Auth-Token-Expires': '2017-05-29 21:09:32',
      'Connection': 'keep-alive',
      'Client': 'iOS',
      'Profile-Id': myProfileId,
    };

    fetch(endpoint, {
      method: 'GET',
      headers: headers
    })
    .then(res => res.json())
    .then(data => {
      const matchingBagel = data.results.filter((bagel) => bagel.profile_id === profileId);
      matchingBagelId = matchingBagel[0].id;
      response.status(200).json({matchingBagelId: matchingBagelId});
    })
    .catch(err => response.status(400).json({err: err, endpoint: endpoint, requestHeaders: headers}));
  },
};
