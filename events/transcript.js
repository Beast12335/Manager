const { AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const trans = require('discord-html-transcripts');
module.exports = async (channel) => {
  try {
    const attachment = await trans.createTranscript(channel,{
      filename: channel.name,
      saveImages: true,
      poweredBy: false
    });
    channel.send({
      files:[attachment]
    });

  } catch (error) {
    console.error('Error generating and sending transcript:', error);
  }
}
