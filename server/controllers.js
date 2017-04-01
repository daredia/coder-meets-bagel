const fetch = require('node-fetch');

const myProfileId = '35411';
const apiHeaders = {
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
  'Client': 'iOS',
  'Profile-Id': myProfileId,
};

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

  createBagel: (bagelData, response) => {
    const endpoint = 'https://api.coffeemeetsbagel.com/redeem_bagel';

    fetch(endpoint, {
      method: 'POST',
      headers: apiHeaders,
      body: JSON.stringify(bagelData),
    })
    .then(res => res.json())
    .then(data => response.status(201).json(data))
    .catch(err => response.status(400).json({err: err, endpoint: endpoint, reqHeaders: headers, reqBody: body}));
  },

  getBagelId: (profileId, response) => {
    const endpoint = 'https://api.coffeemeetsbagel.com/bagels?embed=profile&prefetch=true';

    fetch(endpoint, {
      method: 'GET',
      headers: apiHeaders
    })
    .then(res => res.json())
    .then(data => {
      const matchingBagels = data.results.filter((bagel) => bagel.profile_id === profileId);
      matchingBagelId = matchingBagels.length ? matchingBagels[0].id : null;
      response.status(200).json({matchingBagelId: matchingBagelId});
    })
    .catch(err => response.status(400).json({err: err, endpoint: endpoint, reqHeaders: headers}));
  },

  likeBagel: (profileId, longId, response) => {
    const endpoint = 'https://api.coffeemeetsbagel.com/batch';

    const body = [
      {
        'relative_url': 'bagel\/' + longId,
        'method': 'PUT',
        'body': {
          'pair_chat_removed': 0,
          'meetup_prompt_answer': 0,
          'action': 1,
          'is_rematched': 0,
          'rising_bagel_count': 0,
          'total_woos': 0,
          'pair_total_woos': 0,
          'is_bonus_bagel': 0,
          'meetup_follow_up_answer': 0,
          'id': longId,
          'feedback': null,
          'reveal_purchased': 0,
          // 'end_date': '2017-04-01 19:00:00',
          'show_order': 1,
          'sync_status': 2,
          'profile_id': profileId,
          'internal_show_in_history': 1,
          'city': null,
          // 'start_date': '2017-03-31 19:00:00',
          'mutual_friends': null,
          'sectionIdentifier': '2017003',
          'pair_bagel_type': -1,
          'connected_through': [],
          // 'given_by_first_name': 'Peter',
          'pair_action': 0,
          'bagel_type': 4,
          'block': 0,
          'couple_id': null,
          'total_woos_seen': 0,
          'pair_block': 0,
          'response_award': 5,
          'chat_removed': 0,
          'next_bonusbagel_price': -999,
          // 'created_at': '2017-04-01 00:06:13',
          'block_reason': '',
          'overlay': {},
          'num_mutual_friends': 0,
          'decoupling_date': null,
          'free_bagel_prompt': null,
          'block_type': null,
          // 'last_updated': '2017-04-01 00:06:17'
        }
      }
    ];

    fetch(endpoint, {
      method: 'POST',
      headers: apiHeaders,
      body: JSON.stringify(body),
    })
    .then(res => res.json())
    .then(data => response.status(200).json(data))
    .catch(err => response.status(400).json({err: err, endpoint: endpoint, reqHeaders: headers, reqBody: body}));
  },
};
