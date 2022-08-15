import * as altlib from "@alt1/base"
import { frameworkEntry } from "./framework"

// webpack
require("!file-loader?name=[name].[ext]!./index.html")
require("!file-loader?name=[name].[ext]!./appconfig.json")

export function main() {
    console.debug("In main")

    if (!window.alt1) {
        console.error("Not in alt1 context, aborting")
        return
    }

    if (!window.alt1.permissionPixel) {
        console.error("No pixel permission found")
        return
    }

    document
        .querySelector("#testbutton")
        ?.addEventListener("click", (_) => test())

    frameworkEntry()
}

export function test() {
    let x = altlib.captureHoldFullRs()
    console.debug(x)
}

if (window.alt1) {
    alt1.identifyAppUrl("./appconfig.json")
}

document.addEventListener(
    "readystatechange",
    (e) => {
        try {
            main()
        } catch (e) {
            console.error(e)
            document.querySelector("#output")!.innerHTML =
                "Error loading plugin, please reload"
        }
    },
    { once: true }
)
