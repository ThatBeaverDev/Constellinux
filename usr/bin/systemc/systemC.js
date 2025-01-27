// systemC

function init() {
    system.log("SystemC Found and Running.", "systemC")
    system.systemC = true
    var config = system.files.get("/etc/systemc.json")
    if (config === undefined) {
        system.log("no systemC config file found. creating one.","systemC")
        let obj = {}
        obj.creation = Date.now()
        obj.services = []
        obj.services.push("/usr/bin/crl/crl.js")
        obj.services.push("/usr/bin/desktopEnv/desktopEnv.js")
        obj.services.push("/usr/bin/cryptography/cryptography.js")
        obj.services.push("/usr/bin/rotur/rotur.js")
        obj.services.push("/usr/bin/welcome/welcome.js")
        system.files.writeFile("/etc/systemc.json",JSON.stringify(obj))
        system.log("Created blank systemC config file at /etc/systemc.json","systemC")
    }
    let services = JSON.parse(system.files.get("/etc/systemc.json")).services
    for (const i in services) {
        system.startProcess(services[i], services[i])
    }

    //system.gui.newWindow(PID)
    //system.gui.windowInnerText(PID, "<p>hello from systemC!</p>")
}

function frame() {
}