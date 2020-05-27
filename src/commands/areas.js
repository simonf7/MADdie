exports.run = async (client, msg, args) => {
  client.madUtils.getQuestStats(client).then((questStats) => {
    let table = [];
    table.push(['Area', 'Processed', 'Quests', 'Stops']);

    questStats.stop_quest_stats.forEach((a) => {
      table.push([
        a.fence.replace('pokestops_', ''),
        a.processed.replace(' ', '').padStart(4, ' '),
        a.quests.toString().padStart(3, ' '),
        a.stops.toString().padStart(3, ' '),
      ]);
    });

    msg.reply(
      client.discordUtils.msgEmbed(
        client.discordUtils.showTable(table, ['l', 'r', 'r', 'r'])
      )
    );
  });
};
