const moment = require('moment'); // require

exports.run = async (client, msg, args) => {
  const status = await client.madUtils.getStatus(client);

  let table = [];
  table.push(['Device', 'Route', 'Pos', 'Length', 'Last Data']);

  status.forEach((s) => {
    table.push([
      s.name,
      s.rmname,
      s.routePos.toString(),
      s.routeMax.toString(),
      moment.utc(s.lastProtoDateTime * 1000).fromNow(),
    ]);
  });

  msg.reply(
    client.discordUtils.msgEmbed(
      client.discordUtils.showTable(table, ['l', 'l', 'r', 'r', 'l'])
    )
  );
};

exports.aliases = () => {
  return ['mstatus'];
};
