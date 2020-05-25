const fetch = require('node-fetch');

const getShinyStats = async (client, timeFrom, timeTo) => {
  const url =
    client.config.mad.host +
    '/get_game_stats_shiny?from=' +
    timeFrom.format('X') +
    '&to=' +
    timeTo.format('X');

  return fetch(url)
    .then((res) => res.json())
    .then((json) => {
      return json;
    });
};

const getStatus = async (client) => {
  const url = client.config.mad.host + '/get_status';

  return fetch(url)
    .then((res) => res.json())
    .then((json) => {
      return json;
    });
};

const getDevices = async (client) => {
  const url = client.config.mad.host + '/api/device';

  return fetch(url)
    .then((res) => res.json())
    .then((json) => {
      return json.results;
    });
};

const getWalkers = async (client) => {
  const url = client.config.mad.host + '/api/walker';

  return fetch(url)
    .then((res) => res.json())
    .then((json) => {
      return json.results;
    });
};

module.exports = {
  getShinyStats,
  getStatus,
  getDevices,
  getWalkers,
};
