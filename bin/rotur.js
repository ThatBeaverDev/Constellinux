// ROTUR COMMANDS

async function init(args) {
    let cmd = args[0]
    let resp
    args.splice(0,1)
    switch(cmd) {
        //case "install":
        //    resp = await system.fetchURL("https://apps.mistium.com/install?appname=" + args[0] + "&language=crl")
        //    system.log(resp)
        //    break;
        case "run":
            resp = await system.fetchURL("https://apps.mistium.com/install?appname=" + args[0] + "&language=crl")
            system.files.writeFile("/temp.crl",resp)
            system.startProcess("/temp.crl")
            break;
        case "login":
            system.rotur.usr = args[0]
            system.rotur.pswd = args[1]
            args[1] = "**********"
            system.logs[system.logs.length - 1].content = "rotur login " + args.join(" ")
            system.refreshLogsPanel()
            break;
    }
}