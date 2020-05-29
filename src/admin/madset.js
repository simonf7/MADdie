exports.run = async (client, msg, args) => {
  const devices = await client.madUtils.findDevices(client, args);
  const walkers = await client.madUtils.findWalkers(client, args);

  if (walkers.length > 0) {
    devices.forEach((d) => {
      client.madUtils.setDeviceWalker(client, d.id, walkers[0].id);
    });

    const res = await client.madUtils.reloadMAD(client);
    if (res.status >= 200 && res.status < 300) {
      msg.reply(
        client.discordUtils.msgOk(
          'Device' +
            (devices.length == 1 ? '' : 's') +
            ' **' +
            devices.map((d) => d.name).join('**, **') +
            '** set to walker **' +
            walkers[0].name +
            '**'
        )
      );
    }
  } else {
    msg.reply(client.discordUtils.msgError('Walker not found.'));
  }
};

exports.aliases = () => {
  return ['mset'];
};
