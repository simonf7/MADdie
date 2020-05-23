module.exports = async (client) => {
  console.log(`Commando "${client.user.tag}" awaiting for orders!`);
  client.user.setPresence({
    game: {
      name: 'with MAD',
    },
  });
};
