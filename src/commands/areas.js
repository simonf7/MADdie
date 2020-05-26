exports.run = async (client, msg, args) => {
  const areas = await client.madUtils.getAreas(client);

  let text = '';
  for (var key in areas) {
    if (areas[key].startsWith('pokestops_')) {
      text =
        text + (text === '' ? '' : '\n') + areas[key].replace('pokestops_', '');
    }
  }
  msg.reply(client.discordUtils.msgEmbed(text));
};
