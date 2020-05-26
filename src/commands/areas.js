exports.run = async (client, msg, args) => {
  const fences = await client.madUtils.getGeofences(client);

  let text = '';
  for (var key in fences) {
    text = text + (text === '' ? '' : '\n') + fences[key];
  }
  msg.reply({ embed: { description: text } });
};
