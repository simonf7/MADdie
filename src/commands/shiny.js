const moment = require('moment'); // require
const fetch = require('node-fetch');

exports.run = async (client, msg, args) => {
  const message = await msg.reply('Please wait... Searching...');

  let times = [];
  let pokemon = [];
  args.forEach((a) => {
    if (!isNaN(Date.parse(a))) {
      times.push(a);
    } else {
      pokemon.push(a);
    }
  });

  let timeFrom = moment('1970-01-01 00:00:00');
  let timeTo = moment('2100-12-31 00:00:00');

  if (times[0]) {
    timeFrom = moment(Date.parse(times[0]));
    if (times[1]) {
      timeTo = moment(Date.parse(times[1]));
    }
  }

  const timeFormat = 'Do MMM YYYY, h:mma';
  let text = 'Shiny pokemon found';
  switch (times.length) {
    case 0:
      text = text + ' since scanning started';
      break;

    case 1:
      text = text + ' since ' + timeFrom.format(timeFormat);
      break;

    default:
      text =
        text +
        ' between ' +
        timeFrom.format(timeFormat) +
        ' and ' +
        timeTo.format(timeFormat);
  }
  if (pokemon.length > 0) {
    text = text + ' matching ' + pokemon.join(' or ');
  }

  const json = await client.madUtils.getShinyStats(client, timeFrom, timeTo);

  let mons = json.global_shiny_statistics.sort((a, b) =>
    a.odds < b.odds ? -1 : a.odds > b.odds ? 1 : 0
  );
  mons.forEach((row) => {
    let found = pokemon.length == 0;
    pokemon.forEach((p) => {
      if (row.name.toLowerCase().indexOf(p) >= 0) {
        found = true;
      }
    });

    if (found) {
      if (text.length > 1900) {
        msg.channel.send(text);
        text = '';
      }

      if (text != '') {
        text = text + '\n';
      }
      text =
        text +
        '**' +
        row.name +
        '** odds: 1/' +
        row.odds +
        ' encounters: ' +
        row.count;
    }
  });
  message.delete();
  msg.channel.send(text);
};
