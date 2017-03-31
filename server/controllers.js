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
};