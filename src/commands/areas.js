exports.run = async (client, msg, args) => {
  client.madUtils.getQuestStats(client).then((questStats) => {
    let text = '';

    questStats.stop_quest_stats.forEach((a) => {
      text =
        text +
        (text === '' ? '' : '\n') +
        '**' +
        a.fence.replace('pokestops_', '') +
        '**  processed: ' +
        a.processed +
        ' (' +
        a.quests +
        ' / ' +
        a.stops +
        ')';
    });

    msg.reply(client.discordUtils.msgEmbed(text));
  });
};
