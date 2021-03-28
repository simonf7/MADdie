async function onDevice(client, msg, device) {
  const res = await client.madUtils.powerDevice(client, device, 'power_on');
  if (res.status >= 200 && res.status < 300) {
    msg.reply(client.discordUtils.msgOk('Device **' + device.name + '** on'));
  }
}

async function offDevice(client, msg, device) {
  const res = await client.madUtils.powerDevice(client, device, 'power_off');
  if (res.status >= 200 && res.status < 300) {
    msg.reply(client.discordUtils.msgOk('Device **' + device.name + '** off'));
  }
}

async function stopDevice(client, msg, device) {
  const walker = await client.madUtils.findWalkers(client, ['idle']);

  if (walker.length > 0) {
    client.madUtils.setDeviceWalker(client, device.id, walker[0].id);

    const res = await client.madUtils.reloadMAD(client);
    if (res.status >= 200 && res.status < 300) {
      await client.madUtils.fetchMAD(
        client,
        '/quit_pogo?origin=' + device.name + '&adb=False'
      );

      msg.reply(
        client.discordUtils.msgOk('Device **' + device.name + '** stopped')
      );
    }
  }
}

async function setDeviceWalker(client, msg, device, walker) {
  client.madUtils.setDeviceWalker(client, device.id, walker.id);

  const res = await client.madUtils.reloadMAD(client);
  if (res.status >= 200 && res.status < 300) {
    msg.reply(
      client.discordUtils.msgOk(
        'Device **' + device.name + '** set to walker **' + walker.name + '**'
      )
    );
  }
}

exports.run = async (client, msg, args) => {
  let regEx = /!([a-zA-Z0-9]*) /gm;
  const command = regEx.exec(msg.content);
  if (!command || command.length == 0) {
    msg.reply(client.discordUtils.msgError('Command not found'));
    return;
  }

  const devices = await client.madUtils.findDevices(client, command);
  if (devices.length == 0) {
    msg.reply(
      client.discordUtils.msgError('Device ' + command[1] + ' not found')
    );
    return;
  }

  // stopping a walker
  if (args[0] == 'stop') {
    await stopDevice(client, msg, devices[0]);
    return;
  }

  // power on a walker
  if (args[0] == 'on') {
    await onDevice(client, msg, devices[0]);
    return;
  }

  // power off a walker
  if (args[0] == 'off') {
    await offDevice(client, msg, devices[0]);
    return;
  }

  // walker specified
  const walkers = await client.madUtils.findWalkers(client, args);
  if (walkers.length > 0) {
    await setDeviceWalker(client, msg, devices[0], walkers[0]);
    return;
  }

  // look for lat,lon
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
    msg.reply(
      client.discordUtils.msgError('Command or location not specified.')
    );
    return;
  }

  const coords =
    locations.length == 1
      ? locations[0]
      : locations[0].replace(',', '') + ',' + locations[1].replace(',', '');

  let url =
    '/send_gps?origin=' +
    devices[0].name +
    '&coords=' +
    coords +
    '&sleeptime=0';

  client.madUtils.fetchMAD(client, url).then((res) => {
    msg.reply(
      client.discordUtils.msgOk(
        '**' + devices[0].name + '** sent to **' + coords + '**'
      )
    );
  });
};

exports.aliases = () => {
  return ['atv001', 'atv002', 'atv003', 'atv004', 'atv005'];
};
