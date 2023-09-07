async function deleteExpiredBots(client,EmbedBuilder,mysql) {
  const currentTime = new Date();
  const connection = await mysql.createConnection(process.env.DB_URL);

  try {
    const [ rows ] = await connection.execute('select *  FROM bots_db');
    for (let i=0;i<rows.length;i++){
      const date = new Date(rows[i].duration)
      if (date <= currentTime) {
        if (rows[i].remind == 'true'){
        const user = await client.users.fetch(rows[i].customer)
        const channel = await client.channels.fetch('1149238109234548787')
        const embed = new EmbedBuilder()
        .setTitle(rows[i].name + ` - needs to be payed again`)
        .setColor('Yellow')
        .addFields({name:`> **Path:**`,value:`/home/servicebots/${rows[i].type}/${rows[i].name}`},
        {name:`> **Command:**`,value:`pm2 list | grep "${rows[i].name}"`},
        {name:`> **Application Information:**`,value:`Link: \`https://discord.com/developers/applications/${rows[i].id}\` \n  Name : \`${rows[i].name}\` \n  Original Owner: \`${user.username}\` `})
        const message = `**You need to pay for your Bot again!**__The ${rows[i].pay_type} PAYMENT-Bot:__> <@${rows[i].id}> | ${rows[i].name} (\`${rows[i].id}\`)> **Please go to <#1073917050541572146> and open a Ticket, otherwise your Bot will go offline soon!**`
        
        await channel.send({content:`<@849123406477656086> The ${rows[i].pay_type} payment for ${rows[i].name} have ended.`})
        await connection.execute('update bots_db set remind = ? where id = ?',['false',rows[i].id])
        try{
          await user.send({content:message,embeds:[embed]})
        }catch(e){
          console.log(e)
          await channel.send(`${customer.username} have their dms closed`)
          }
        }
        }
      }
  } catch (error) {
    console.error('Error reminding expired bots:', error);
  } finally {
    await connection.end();
  }
}

module.exports = { deleteExpiredBots }
