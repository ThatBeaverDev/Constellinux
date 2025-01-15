// systemC

function init() {
    var config = system.files.get("/etc/systemc.json")
    if (config === undefined) {
        system.log("no systemC config file found. creating one.","systemC")
        let obj = {}
        obj.creation = Date.now()
        obj.services = []
        obj.services.push("/bin/terminalService.js")
        obj.services.push("/usr/bin/crl/crl.js")
        obj.services.push("/usr/bin/desktopEnv/desktopEnv.js")
        system.files.writeFile("/etc/systemc.json",JSON.stringify(obj))
        system.log("Created blank systemC config file at /etc/systemc.json","systemC")
    }
    let services = JSON.parse(system.files.get("/etc/systemc.json")).services
    for (const i in services) {
        system.startProcess(services[i], services[i])
    }
}

function frame() {
}