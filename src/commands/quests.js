const Discord = require('discord.js');

exports.run = async (client, msg, args) => {
  const areas = await client.madUtils.getAreas(client);

  let fArgs = [];
  let rArgs = [];
  args.forEach((a) => {
    let found = false;
    if (a.length > 2) {
      areas.forEach(area => {
        if (area.name.startsWith('pokestops_' + a)) {
          fArgs.push(area.name);
          found = true;
        }
      });
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
    quests = await client.madUtils.getQuests(
      client,
      fArgs[0].replace('pokestops_', '')
    );
  }
  if (quests.error) {
    msg.reply(client.discordUtils.msgError('Sorry, something went wrong'));
    return;
  }

  let message = new Discord.RichEmbed();
  message.setDescription(
    'Quests found' +
    (fArgs[0] !== '' ? ' for ' + fArgs[0].replace('pokestops_', '') : '') +
    (rArgs[0] !== '' ? ' matching ' + rArgs.join(', ') : '')
  );
  let count = 0;
  let replied = false;

  quests.filter((q) => {
    let name = q.quest_reward_type === 'Pokemon' ? q.pokemon_name : q.item_type;
    let lName = name.toLowerCase();

    rArgs.forEach((r) => {
      if (
        //(r === 'pokemon' && q.quest_reward_type === 'Pokemon') ||
        //r === '' ||
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
