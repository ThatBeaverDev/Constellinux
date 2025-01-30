// ROTUR COMMANDS

async function init(args) {
    let cmd = args[0]
    let resp
    args.splice(0,1)
    switch(cmd) {
        case "login":
            system.rotur.usr = args[0]
            system.rotur.pswd = args[1]
            args[1] = "**********"
            system.logs[system.logs.length - 1].content = "rotur login " + args.join(" ")
            system.refreshLogsPanel()
            break;
    }
}