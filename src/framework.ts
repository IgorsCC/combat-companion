import BossTimerReader from "@alt1/bosstimer/dist"
import BuffReader, { BuffInfo } from "@alt1/buffs/dist"
import ChatBoxReader, { ChatLine } from "@alt1/chatbox/dist"

// Response types

type Response = TTSAlert | ShowImage

export interface TTSAlert {
    type: "alert"
    tts: string
}

export interface ShowImage {
    type: "showimage"
    imgpath: string
}

// Trigger types
// For now we plan on s

type Trigger = ChatTrigger | BuffTrigger | BossHpTrigger | TimeTrigger

export interface ChatTrigger {
    type: "chat"
    pattern: RegExp
    triggerfn: (l: { chatline: string }) => Response[]
}

export interface BuffTrigger {
    type: "buff"
}

export interface BossHpTrigger {
    type: "bosshp"
    triggerfn: (l: { hp: number }) => Response[]
}

export interface TimeTrigger {
    type: "bosstime"
    triggerfn: (l: { secs: number }) => Response[]
}

export function simpleChatAlert(pattern: RegExp, resp: string): ChatTrigger {
    return {
        type: "chat",
        pattern: pattern,
        triggerfn: (_) => {
            return [
                {
                    type: "alert",
                    tts: resp,
                },
            ]
        },
    }
}

interface Context {
    chatbox: ChatBoxReader
    bosstimer: BossTimerReader
    buffs: BuffReader

    triggers: Trigger[]

    inferredTick: number
}

export function onAppTick(ctx: Context) {
    let resp: Response[] = []

    // The chatboxreader only returns new lines that it found
    // so this will dispatch all triggers on the newly found lines only
    let chatlines = ctx.chatbox.read() ?? []
    if (chatlines.length > 0) {
        for (const line of chatlines) {
            ctx.triggers
                .filter((x): x is ChatTrigger => x.type == "chat")
                .filter((x) => x.pattern.exec(line.text) === null)
                .map((x) => x.triggerfn({ chatline: line.text }))
                .forEach((x) => resp.concat(x))
        }
    }

    // TODO buffs

    // Sigh. The time-based triggers
    // The issue: here's all the ways we can track time and their problems
    //
    //  - System clock: RS ticks are not exactly 600ms. This is most
    //    evident during DXP when the game slows down >10%. This is so bad that
    //    we can't really rely on this staying in sync for more than a few
    //    minutes from any given reference point
    //  - Boss timer: the game runs in ticks, but the timer runs in mins/secs
    //    this means if we have mechanics that occur on a second that contains
    //    two ticks, we're screwed
    //  - Prayer drain: not all encounters drain prayer. Most notably croesus
    //
    //  There's another problem hiding in boss timer/prayer drain: we take
    //  snapshots of the game every 100/200ms. This means that we lag real time
    //  by anywhere from 1ms to 200ms, with no way to tell where we are

    // Here's the very inelegant solution/hack that we use:
    // TODO XD
}

export function frameworkEntry() {
    let chatbox = new ChatBoxReader()
    let bosstimer = new BossTimerReader()
    let buffs = new BuffReader()

    let triggers: ChatTrigger[] = []

    let ctx: Context = { chatbox, bosstimer, buffs, triggers, inferredTick: 0 }
    let apploop = setInterval((_) => onAppTick(ctx), 1000)
}
