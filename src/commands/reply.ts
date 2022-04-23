export default  {
    description: 'Reply',
    minArgs: 1,
    expectedArgs: '<reply>',
    slash: true,
    hidden: true,
    guildOnly: true,
    options: [
      {
        name: 'reply',
        description: 'Message to reply with',
        type: 3,
        required: true
      }, 
    ],
    callback: async ({ client, text, args, interaction }:any) => {
      interaction.reply({content: args[0]})
    },
}