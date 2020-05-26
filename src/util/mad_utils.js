const fetch = require('node-fetch');

const fetchJson = async (url) => {
  return fetch(url)
    .then((res) => {
      if (!res.ok) {
        console.log(url + ': ' + res.statusText + ' (' + res.status + ')');
        return {
          error: res.status,
          message: res.statusText,
        };
      }
      return res.json();
    })
    .then((json) => {
      return json;
    })
    .catch((err) => {
      console.log(url + ': ' + err);
      return {
        error: 500,
        message: err,
      };
    });
};

const fetchResults = async (url) => {
  return fetchJson(url).then((json) => {
    if (json.results) {
      return json.results;
    }
    return json;
  });
};

const getShinyStats = async (client, timeFrom, timeTo) => {
  const url =
    client.config.mad.host +
    '/get_game_stats_shiny?from=' +
    timeFrom.format('X') +
    '&to=' +
    timeTo.format('X');

  return fetchJson(url);
};

const getStatus = async (client) => {
  const url = client.config.mad.host + '/get_status';

  return fetchJson(url);
};

const getDevices = async (client) => {
  const url = client.config.mad.host + '/api/device';

  return fetchResults(url);
};

const getWalkers = async (client) => {
  const url = client.config.mad.host + '/api/walker';

  return fetchResults(url);
};

const getGeofences = async (client) => {
  const url = client.config.mad.host + '/api/geofence';

  return fetchResults(url);
};

const getQuests = async (client, fence) => {
  let url = client.config.mad.host + '/get_quests';
  if (fence !== '') {
    url = url + '?fence=' + fence;
  }

  return fetchJson(url);
};

module.exports = {
  getShinyStats,
  getStatus,
  getDevices,
  getWalkers,
  getGeofences,
  getQuests,
};
