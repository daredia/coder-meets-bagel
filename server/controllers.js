const fetch = require('node-fetch');

const apiHeaders = {
  me: {
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
    'Profile-Id': '35411',
  },
  shehzam: {
    'Cookie': 'sessionid=ijaz9ilpdhd7a60x56fhywmolg1ookug',
    'Device-Name': 'Sony D5803',
    'AppStore-Version': '3.18.0.1306',
    'Facebook-Auth-Token': 'EAAD4bKUPbR8BADsxyFbmQqK2YLIecAbXxtPet8M1jixsszeWI11pZBpScNjQvMZAFRnu1kBqxZBqX8ABerz6dOAQYGPCq3FbwnzwpYbYBgDZCFcAd0pZBYk8p9BffoZBtXAeQOm23xvpawfVby7GZA48VaPNZAZCVmCg6zHkWCxVl6JMJCmr07gSw7knpfiBlrusNhjP7ruZCaPbJt1VZCSoeZAW',
    'Charset': 'utf-8',
    'Client': 'Android',
    'Accept': 'application/json; version=3.0',
    'App-Version': '1306',
    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 5.1.1; D5803 Build/23.4.A.1.236)',
    'Host': 'api.coffeemeetsbagel.com',
    'Accept-Encoding': 'gzip',
    // 'Profile-Id': '3618566',
  }
};

exports.parseEmailData = (data) => {
  // `data` is json posted from zapier upon receiving a bagel share email forwarded by me
  const emailTextParts = data.emailText ? data.emailText.split('http') : null;
  const url = emailTextParts.length > 1 ? 'http' + emailTextParts[1] : null;
  const isAndroid = data.emailRecipient && data.emailRecipient.toLowerCase().includes('android');

  return {
    url: url,
    android: isAndroid,
  };
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


exports.getBagelDeeplink = (receivedBagelLink) => {
  // example of a received bagel link: http://cmb.gs/rKzc/gDcc23CfYB
  const bagelPathPrefix = 'rKzc';
  // example of a deeplink for redeeming a bagel: https://bnc.lt/rKzc/lfVzNtxIVB
  const bagelDeeplinkPrefix = 'https://bnc.lt/rKzc/';

  const bagelPathIndex = receivedBagelLink.indexOf(bagelPathPrefix) + 5;
  const bagelPath = receivedBagelLink.slice(bagelPathIndex);
  return bagelDeeplinkPrefix + bagelPath;
};

exports.swipeBagel = (profileId, longId, bagelProfileData, response, options) => {
  console.log('inside swipeBagel');
  const endpoint = 'https://api.coffeemeetsbagel.com/batch';
  const headers = (options && options.recipient) ?
      apiHeaders[options.recipient] :
      apiHeaders.me;

  const body = [
    {
      'relative_url': 'bagel\/' + longId,
      'method': 'PUT',
      'body': {
        'pair_chat_removed': 0,
        'meetup_prompt_answer': 0,
        'action': (options && options.dislike) ? 2 : 1, // 1 is like, 2 is dislike
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
    headers: headers,
    body: JSON.stringify(body),
  })
  .then(res => res.json())
  .then(data => {
    console.log('data inside swipeBagel', data);
    response.status(200).json({data, bagelProfileData});
  })
  .catch(err => {
    const errObj = {err, endpoint, headers, body, bagelProfileData};
    console.log(JSON.stringify(errObj));
    response.status(400).json(errObj);
  });
};

exports.getBagelId = (profileId, bagelProfileData, response, options) => {
  console.log('inside getBagelId');
  const endpoint = 'https://api.coffeemeetsbagel.com/bagels?embed=profile&prefetch=true';
  const headers = (options && options.recipient) ?
      apiHeaders[options.recipient] :
      apiHeaders.me;

  fetch(endpoint, {
    method: 'GET',
    headers: headers
  })
  .then(res => res.json())
  .then(data => {
    const matchingBagels = data.results.filter((bagel) => bagel.profile_id === profileId);
    const matchingBagelId = matchingBagels.length ? matchingBagels[0].id : null;
    
    if ((options && options.test) || !matchingBagelId) {
      return response.status(200).json({matchingBagelId, bagelProfileData});
    }
    exports.swipeBagel(profileId, matchingBagelId, bagelProfileData, response, options);
  })
  .catch(err => {
    const errObj = {err, endpoint, headers, bagelProfileData};
    console.log(JSON.stringify(errObj));
    response.status(400).json(errObj);
  });
};

exports.createBagel = (bagelData, bagelProfileData, response, options) => {
  console.log('inside createBagel');
  const endpoint = 'https://api.coffeemeetsbagel.com/redeem_bagel';
  const headers = (options && options.recipient) ?
      apiHeaders[options.recipient] :
      apiHeaders.me;

  fetch(endpoint, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(bagelData),
  })
  .then(res => res.json())
  .then(data => {
    console.log('data inside createBagel', data);
    if ((options && options.test) || !data.success) {
      return response.status(201).json({data, bagelProfileData});
    }
    exports.getBagelId(bagelData.redeem_profile_id, bagelProfileData, response, options);
  })
  .catch(err => {
    const errObj = {err, endpoint, headers, body, bagelProfileData};
    console.log(JSON.stringify(errObj));
    response.status(400).json(errObj);
  });
};

exports.getBagelProfileData = (bagelData, response, options) => {
  console.log('inside getBagelProfileData');
  const endpoint = 'https://api.coffeemeetsbagel.com/batch';
  // Unlike with other api requests, for this one, DONT use the recipient's headers - always use 
  // 'me' since i'm the one who got this bagel in my discover tab
  // TODO: find an API call to access bagels in history, so i can get shehzam's history bagels
  // and show their pics, even if he swiped on them on a different day than the day i shared them
  const headers = apiHeaders.me;
  const body = [{
    'relative_url': 'givetakes?embed=profile',
    'method': 'GET'
  }];

  fetch(endpoint, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body),
  })
  .then(res => res.json())
  .then(data => {
    console.log('data inside getBagelProfileData', data);
    if ((options && options.test) || data[0].status_code !== 200) {
      return response.status(200).json(data);
    }

    const matchingBagels = data[0].body.results.filter((bagel) => bagel.id === bagelData.redeem_profile_id);
    const matchingBagel = matchingBagels[0] || null;

    exports.createBagel(bagelData, matchingBagel, response, options);
  })
  .catch(err => {
    const errObj = {err: err, endpoint: endpoint, reqHeaders: headers, reqBody: body};
    console.log(JSON.stringify(errObj));
    response.status(400).json(errObj);
  });
};

exports.getBagelData = (endpoint, response, options) => {
  console.log('inside getBagelData');
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
  .then(html => {
    const bagelData = parseHtmlResponse(html);
    if (options && options.test) {
      return response.status(200).json(bagelData);
    }
    exports.getBagelProfileData(bagelData, response, options);
  })
  .catch(err => {
    const errObj = {err: err, endpoint: endpoint, requestHeaders: headers};
    console.log(JSON.stringify(errObj));
    response.status(400).json(errObj);
  });
};

exports.shareBagel = (profileId, response) => {
  console.log('inside shareBagel');
  const endpoint = 'https://api.branch.io/v1/url';
  const headers = {
    'Accept': 'application/json',
    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 5.1.1; D5803 Build/23.4.A.1.236)',
    'Host': 'api.branch.io',
    'Connection': 'Keep-Alive',
    'Accept-Encoding': 'gzip'
  };

  const body = {
    'identity_id': '197138173673876432',
    'device_fingerprint_id': '197138172512119641',
    'session_id': '377037759529666487',
    'tags': ['redeem_bagel'],
    'data': '{\"redeem_profile_id\":' + profileId + ',\"redeem_profile_guid\":\"' + profileId + '\",\"sent_by_profile_id\":3618566,\"sent_by_profile_guid\":\"3618566\",\"sender_first_name\":\"Shehzam\",\"validation_code\":\"e52ae299\",\"$deeplink_path\":\"\\\/redeem_bagel\\\/' + profileId + '\\\/e52ae299\\\/3618566\\\/\",\"$desktop_url\":\"https:\\\/\\\/coffeemeetsbagel.com\",\"page\":\"redeem_bagel\",\"$android_deepview\":\"cmb_private_2\",\"$desktop_deepview\":\"cmb_private_2\",\"$og_title\":\"Shehzam Sent You a Hot Bagel\",\"$og_description\":\"He is 21 years old, attended Jesse M. Bethel High School, works as a Gas Turbine System Technician \",\"$og_image_url\":\"https:\\\/\\\/d1ghufavkue0e7.cloudfront.net\\\/cache\\\/8d\\\/81\\\/8d811d292c5a1a1a013b2ea98d37825b.jpg\",\"~campaign\":\"redeem_bagel\",\"source\":\"android\"}',
    'metadata': {},
    'hardware_id': '90ce03134640b809',
    'is_hardware_id_real': true,
    'brand': 'Sony',
    'model': 'D5803',
    'screen_dpi': 320,
    'screen_height': 1184,
    'screen_width': 720,
    'wifi': true,
    'os': 'Android',
    'os_version': 22,
    'instrumentation': {
      'v1\/url-qwt': '3',
      'v1\/open-brtt': '1436',
      'v1\/open-lrtt': '953'
    },
    'sdk': 'android1.14.5',
    'retryNumber': 0,
    'branch_key': 'key_live_abjg33tvXvD4utUJQ30cpgebndh2wkei'
  };

  fetch(endpoint, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body),
  })
  .then(res => res.json())
  .then(data => {
    console.log('data inside swipeBagel', data);
    response.status(200).json(data);
  })
  .catch(err => {
    const errObj = {err: err, endpoint: endpoint, reqHeaders: headers, reqBody: body};
    console.log(JSON.stringify(errObj));
    response.status(400).json(errObj);
  });
};
