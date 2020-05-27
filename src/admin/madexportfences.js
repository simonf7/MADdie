const fs = require('fs');

exports.run = async (client, msg, args) => {
  // split args between include and exclude
  const inc = args
    .filter((a) => {
      return a.startsWith('!') == false;
    })
    .map((a) => a.replace(' ', '_'));
  const exc = args
    .filter((a) => {
      return a.startsWith('!');
    })
    .map((a) => a.replace(' ', '_'));

  const fences = await client.madUtils.getGeofences(client);
  let output = [];

  let colors = [
    '#6cb1e1',
    '#ff9900',
    '#99cc00',
    '#3333cc',
    '#3366ff',
    '#ff00ff',
    '#ffcc00',
    '#ccff00',
    '#00ccff',
    '#00ffcc',
    '#ff00cc',
    '#cc00ff',
    '#ff99cc',
    '#99ffcc',
  ];
  let count = 0;

  for (var key in fences) {
    const fence = await client.madUtils.fetchResults(client, key);

    let include = inc.length == 0 ? true : exc.length == 0 ? false : true;
    inc.forEach((a) => {
      if (fence.name.startsWith(a)) {
        include = true;
      }
    });
    exc.forEach((a) => {
      if (fence.name.startsWith(a.substring(1))) {
        include = false;
      }
    });

    if (include) {
      const id = key.match(/[0-9]+/g);
      let json = {
        name: fence.name,
        color: colors[count % colors.length],
        id: parseInt(id[0]),
        path: [],
      };
      fence.fence_data.forEach((c) => {
        const location = c.match(/[0-9]+[.][0-9]+/g);
        if (location && location.length == 2) {
          json.path.push(location.map((l) => parseFloat(l)));
        }
      });
      output.push(json);

      count += 1;
    }
  }

  fs.writeFileSync(
    client.config.temp + 'geofences.json',
    JSON.stringify(output, undefined, 2),
    'utf8'
  );

  msg.reply('', { files: [client.config.temp + 'geofences.json'] });
};

exports.aliases = () => {
  return ['mef'];
};
