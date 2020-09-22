const moment = require('moment'); // require

module.exports = async (client) => {
  console.log('Loading MAD status');
  client.madStatus = await client.madUtils.getStatus(client);
  client.deviceErrors = [];

  console.log(`Commando "${client.user.tag}" awaiting for orders!`);
  client.user.setPresence({
    game: {
      name: 'with MAD',
    },
  });

  setInterval(() => {
    client.madUtils.getStatus(client).then((data) => {
      console.log(data);
      data.forEach((d) => {
        // x minutes later
        let check = moment
          .unix(d.lastProtoDateTime)
          .utc()
          .add(client.config.mad.timeout, 'minute');
        if (
          d.mode !== 'Idle' &&
          moment().isAfter(check) &&
          client.deviceErrors.indexOf(d.name) == -1
        ) {
          client.deviceErrors.push(d.name);
          const msg =
            moment().format('HH:mm') +
            ' **' +
            d.name +
            '** last heard of ' +
            moment.utc(d.lastProtoDateTime * 1000).fromNow();
          client.discordUtils.msgAdmin(client, msg);
        } else if (
          moment().isBefore(check) &&
          client.deviceErrors.indexOf(d.name) >= 0
        ) {
          client.deviceErrors.splice(client.deviceErrors.indexOf(d.name));
          const msg = moment().format('HH:mm') + ' **' + d.name + '** active';
          client.discordUtils.msgAdmin(client, msg);
        }

        client.madStatus.forEach((s) => {
          if (d.name === s.name && d.rmname !== s.rmname) {
            const msg =
              moment().format('HH:mm') +
              ' **' +
              d.name +
              '** -> **' +
              d.rmname +
              '**';
            client.discordUtils.msgAdmin(client, msg);
          }
        });
      });

      client.madStatus = data;
    });
  }, 60000);
};
