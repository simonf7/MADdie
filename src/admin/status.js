const moment = require('moment'); // require

exports.run = async (client, msg, args) => {
  const view = {
    username: client.user.username,
    version: client.version,
    ready: moment(client.readyAt).fromNow(),
    pings: client.pings,
    dbVersion: client.dbVersion,
  };

  const template = JSON.stringify(client.dts.status);
  const message = client.mustache.render(template, view);
  msg.reply(JSON.parse(message));

  console.log(`${msg.author.username} requested status`);
};
