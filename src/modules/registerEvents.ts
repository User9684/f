import {readdirSync} from "fs";
const ascii = require("ascii-table");
import {client} from '../index'

const table = new ascii().setHeading("Events", "Load Status");

export async function init() {
    let loaded = 0;
    const events = readdirSync("./events/").filter(f => f.endsWith(".js"));
        for (let file of events) {
            const evt = require(`../events/${file}`);
            let eName = file.split(".")[0];
            table.addRow(file, '✅');
            loaded++;
            client.on(eName, evt.bind(null, client))
        }
    console.log(`Successfully loaded ${loaded} events.`);
};