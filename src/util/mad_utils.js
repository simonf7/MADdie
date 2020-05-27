const fetch = require('node-fetch');

const fetchJson = async (client, url) => {
  return fetch(client.config.mad.host + url)
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

const fetchResults = async (client, url) => {
  return fetchJson(client, url).then((json) => {
    if (json.results) {
      return json.results;
    }
    return json;
  });
};

const getShinyStats = async (client, timeFrom, timeTo) => {
  const url =
    '/get_game_stats_shiny?from=' +
    timeFrom.format('X') +
    '&to=' +
    timeTo.format('X');

  return fetchJson(client, url);
};

const getStatus = async (client) => {
  return fetchJson(client, '/get_status');
};

const getDevices = async (client) => {
  return fetchResults(client, '/api/device');
};

const getWalkers = async (client) => {
  return fetchResults(client, '/api/walker');
};

const getGeofences = async (client) => {
  return fetchResults(client, '/api/geofence');
};

const getAreas = async (client) => {
  return fetchResults(client, '/api/area');
};

const getQuests = async (client, fence) => {
  let url = '/get_quests';
  if (fence !== '') {
    url = url + '?fence=' + fence;
  }

  return fetchJson(client, url);
};

const getQuestStats = async (client) => {
  return fetchJson(client, '/get_stop_quest_stats');
};

module.exports = {
  fetchJson,
  fetchResults,
  getShinyStats,
  getStatus,
  getDevices,
  getWalkers,
  getGeofences,
  getAreas,
  getQuests,
  getQuestStats,
};
