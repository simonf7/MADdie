const moment = require('moment'); // require

exports.run = async (client, msg, args) => {
  const status = await client.madUtils.getStatus(client);

  let widths = [9, 8, 10, 20];

  status.forEach((s) => {
    if (s.name.length + 3 > widths[0]) {
      widths[0] = s.name.length + 3;
    }
    if (s.rmname.length + 3 > widths[1]) {
      widths[1] = s.rmname.length + 3;
    }
  });

  let text =
    '```' +
    'Device'.padEnd(widths[0] + 2, ' ') +
    'Route'.padEnd(widths[1] + 2, ' ') +
    'Pos'.padEnd(widths[2] + 2, ' ') +
    'Last Data';
  text =
    text +
    '\n' +
    ''.padEnd(widths[0], '=') +
    '  '.padEnd(widths[1] + 2, '=') +
    '  '.padEnd(widths[2] + 2, '=') +
    '  '.padEnd(widths[3] + 2, '=');

  status.forEach((s) => {
    text =
      text +
      '\n' +
      s.name.padEnd(widths[0] + 2, ' ') +
      s.rmname.padEnd(widths[1] + 2, ' ') +
      s.routePos.toString().padStart(3, ' ') +
      '/' +
      s.routeMax.toString().padStart(3, ' ') +
      '     ' +
      moment.utc(s.lastProtoDateTime * 1000).fromNow();
  });

  text = text + '```';
  msg.reply({ embed: { description: text } });
};

exports.aliases = () => {
  return ['ms'];
};
