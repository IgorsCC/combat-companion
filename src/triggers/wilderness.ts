import { ChatTrigger, simpleChatAlert } from "../framework"

export const triggers: ChatTrigger[] = [
    simpleChatAlert(/You sense a shard/, "Pray range"),
    simpleChatAlert(/You sense the magic/, "Pray mage"),
    simpleChatAlert(/tasks in a row and gain/, "Slayer task complete"),
    simpleChatAlert(
        /The creatures of the Wilderness disapprove of your continued/,
        "Ambush"
    ),
    simpleChatAlert(/has appeared nearby/, "Elite slayer monster spawn"),
    simpleChatAlert(/golden beam shines over/, "Loot beam"),
]

export function main() {}
