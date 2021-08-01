const fetch = require('node-fetch');

const fetchMAD = async (client, url) => {
  return fetch(client.config.mad.host + url)
    .then((res) => {
      if (!res.ok) {
        console.error(
          'GET ' + url + ': ' + res.statusText + ' (' + res.status + ')'
        );
        return {
          error: res.status,
          message: res.statusText,
        };
      }
      return res;
    })
    .catch((err) => {
      console.error('GET ' + url + ': ' + err);
      return {
        error: 500,
        message: err,
      };
    });
};

const fetchJson = async (client, url) => {
  return fetch(client.config.mad.host + url)
    .then((res) => {
      if (!res.ok) {
        console.error(
          'GET ' + url + ': ' + res.statusText + ' (' + res.status + ')'
        );
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
      console.error('GET ' + url + ': ' + err);
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

const _sendJson = async (url, data = {}, method = 'POST') => {
  return fetch(url, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: method,
    body: JSON.stringify(data),
  })
    .then((res) => {
      if (!res.ok) {
        console.error(
          method + ' ' + url + ': ' + res.statusText + ' (' + res.status + ')'
        );
        return {
          error: res.status,
          message: res.statusText,
        };
      }
      return res;
    })
    .catch((err) => {
      console.error(method + ' ' + url + ': ' + err);
      return {
        error: 500,
        message: err,
      };
    });
};

const sendJson = async (client, url, data = {}, method = 'POST') => {
  return _sendJson(client.config.mad.host + url, data, method);
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

const findDevices = async (client, names) => {
  return getStatus(client).then((devices) => {
    let found = [];
    devices.forEach((d) => {
      names.forEach((n) => {
        if (d.name.toLowerCase() === n) {
          found.push({
            id: d.device_id,
            name: d.name,
            url: '/api/device/' + d.device_id,
          });
        }
      });
    });

    return found;
  });
};

const setDeviceWalker = async (client, deviceId, walkerId) => {
  const url = '/api/device/' + deviceId;
  const payload = {
    walker: '/api/walker/' + walkerId,
  };

  return sendJson(client, url, payload, 'PATCH');
};

const getWalkers = async (client) => {
  return fetchResults(client, '/api/walker');
};

const findWalkers = async (client, names) => {
  return getWalkers(client).then((walkers) => {
    let found = [];
    for (var key in walkers) {
      names.forEach((n) => {
        if (walkers[key].toLowerCase() === n.replace(' ', '_')) {
          found.push({
            id: parseInt(key.match(/[0-9]+/g)[0]),
            name: walkers[key],
            url: key,
          });
        }
      });
    }

    return found;
  });
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

const reloadMAD = async (client) => {
  return fetchMAD(client, '/reload');
};

const powerDevice = async (client, device, action) => {
  if (client.config.power && client.config.power[action]) {
    const endPoint = client.config.power[action].endpoint;
    let string = JSON.stringify(client.config.power[action].command);
    string = string.replace(':device:', device.name);
    const command = JSON.parse(string);

    return await _sendJson(endPoint, command);
  }

  return null;
};

module.exports = {
  fetchMAD,
  fetchJson,
  fetchResults,
  getShinyStats,
  getStatus,
  getDevices,
  findDevices,
  setDeviceWalker,
  getWalkers,
  findWalkers,
  getGeofences,
  getAreas,
  getQuests,
  getQuestStats,
  reloadMAD,
  powerDevice,
};
