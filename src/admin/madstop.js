exports.run = async (client, msg, args) => {
  const devices = await client.madUtils.findDevices(client, args);
  const walker = await client.madUtils.findWalkers(client, ['idle']);

  if (walker.length > 0) {
    devices.forEach((d) => {
      client.madUtils.setDeviceWalker(client, d.id, walker[0].id);
    });

    const res = await client.madUtils.reloadMAD(client);
    if (res.status >= 200 && res.status < 300) {
      await client.asyncForEach(devices, async (d) => {
        await client.madUtils.fetchMAD(
          client,
          '/quit_pogo?origin=' + d.name + '&adb=False'
        );
      });

      msg.reply(
        client.discordUtils.msgOk(
          'Device' +
            (devices.length == 1 ? '' : 's') +
            ' **' +
            devices.map((d) => d.name).join('**, **') +
            '** stopped'
        )
      );
    }
  }
};

exports.aliases = () => {
  return ['mstop'];
};
