const Discord = require('discord.js');

exports.run = async (client, msg, args) => {
  const fences = await client.madUtils.getGeofences(client);

  let fArgs = [];
  let rArgs = [];
  args.forEach((a) => {
    let found = false;
    if (a.length > 2) {
      for (var key in fences) {
        if (fences[key].startsWith(a)) {
          fArgs.push(fences[key]);
          found = true;
        }
      }
      if (!found) {
        rArgs.push(a);
      }
    }
  });
  fArgs.push('');
  if (rArgs.length == 0) {
    rArgs.push('');
  }

  let quests = await client.madUtils.getQuests(client, fArgs[0]);
  if (quests.error) {
    quests = await client.madUtils.getQuests(client, 'pokestops_' + fArgs[0]);
  }
  if (quests.error) {
    msg.reply(client.discordUtils.msgError('Sorry, something went wrong'));
    return;
  }

  let message = new Discord.RichEmbed();
  message.setDescription(
    'Quests found' +
      (fArgs[0] !== '' ? ' for ' + fArgs[0] : '') +
      (rArgs[0] !== '' ? ' matching ' + rArgs.join(', ') : '')
  );
  let count = 0;
  let replied = false;

  quests.filter((q) => {
    let name = q.quest_reward_type === 'Pokemon' ? q.pokemon_name : q.item_type;
    let lName = name.toLowerCase();

    rArgs.forEach((r) => {
      if (
        (r === 'pokemon' && q.quest_reward_type === 'Pokemon') ||
        r === '' ||
        lName.includes(r)
      ) {
        message.addField(
          name + ' : ' + q.name,
          `http://www.google.com/maps/place/${q.latitude},${q.longitude}`
        );

        count = count + 1;
        if (count == 25) {
          if (replied) {
            msg.channel.send(message);
          } else {
            msg.reply(message);
            replied = true;
          }

          message = new Discord.RichEmbed();
          count = 0;
        }
      }
    });
  });

  if (count > 0) {
    if (replied) {
      msg.channel.send(message);
    } else {
      msg.reply(message);
      replied = true;
    }
  }

  if (!replied) {
    msg.reply(client.discordUtils.msgEmbed('Sorry, no matching quests found'));
  }
};
