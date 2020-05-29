exports.run = async (client, msg, args) => {
  const devices = await client.madUtils.findDevices(client, args);
  const locations = args.filter((a) => {
    return (
      (a.match(/[,.0-9]/g) || []).length == a.length ||
      (a.match(/[.0-9]/g) || []).length == a.length
    );
  });
  if (
    locations.length == 0 ||
    (locations.length == 1 && locations[0].match(/,/g) === null) ||
    locations.length > 2
  ) {
    msg.reply(client.discordUtils.msgError('Location not specified.'));
    return;
  }

  const coords =
    locations.length == 1 ? locations[0] : locations[0] + ',' + locations[1];

  if (devices.length > 0) {
    devices.forEach((d) => {
      let url =
        '/send_gps?origin=' + d.name + '&coords=' + coords + '&sleeptime=0';

      client.madUtils.fetchMAD(client, url).then((res) => {
        msg.reply(
          client.discordUtils.msgOk(
            '**' + d.name + '** sent to **' + coords + '**'
          )
        );
      });
    });
  } else {
    msg.reply(client.discordUtils.msgError('Device not recognised.'));
  }
};

exports.aliases = () => {
  return ['msend'];
};
