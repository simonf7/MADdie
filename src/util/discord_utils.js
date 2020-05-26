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

module.exports = {
  msgAdmin,
  msgEmbed,
  msgError,
  msgOk,
};
