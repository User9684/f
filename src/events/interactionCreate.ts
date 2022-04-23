import {settings} from '../botSettings'
export = async(client:any, interaction:any) =>{
    if(interaction.isCommand()){
        require('../commands/'+interaction.command.name).callback({client, interaction, settings})
    } else if(interaction.isButton()){

    }
}