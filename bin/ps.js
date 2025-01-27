// list processes

function init(args) {
    let data = ""
    for (const i in system.processes) {
        try {
        const item = system.processes[i]
        data += item.PID + " - " + item.name + "\n"
        } catch(e) {}
    }
    system.post(data)
}