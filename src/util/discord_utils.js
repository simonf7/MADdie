const msgAdmin = async (client, msg) => {
  client.config.discord.admin.forEach((id) => {
    client.fetchUser(id, false).then((user) => {
      console.log('Notifying: ' + user.username);
      user.send(msg);
    });
  });
};

const msgEmbed = (msg) => {
  return { embed: { description: msg } };
};

const msgError = (msg) => {
  return {
    embed: { description: ':rotating_light:  ' + msg, color: 15158332 },
  };
};

const msgOk = (msg) => {
  return {
    embed: { description: ':white_check_mark:  ' + msg, color: 3066993 },
  };
};

const showTable = (table, align = []) => {
  let width = [];
  table.forEach((row) => {
    row.forEach((e, i) => {
      if ((width[i] && width[i] < e.length) || !width[i]) {
        width[i] = e.length;
      }
    });
  });
  let text = '';
  table.forEach((row, i) => {
    text = text + (i == 0 ? '```' : '\n');
    row.forEach((e, i) => {
      if (align[i] && align[i] == 'r') {
        text = text + e.padStart(width[i], ' ') + '  ';
      } else {
        text = text + e.padEnd(width[i] + 2, ' ');
      }
    });
    if (i == 0) {
      text = text + '\n';
      width.forEach((w) => {
        text = text + ''.padEnd(w, '=') + '  ';
      });
    }
  });

  text = text + '```';

  return text;
};

module.exports = {
  msgAdmin,
  msgEmbed,
  msgError,
  msgOk,
  showTable,
};
