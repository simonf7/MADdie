const { checkStock } = require('../util/stock');

exports.run = async (client, msg, args) => {
  let text = await checkStock(false);

  if (text != '') {
    msg.channel.send(text);
  }
};
