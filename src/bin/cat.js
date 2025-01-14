// CAT files

function init(args) {
    if (args[0][0] == "/") {
        system.post(system.files.get(args[0]))
    } else {
        system.post(system.files.get(system.dir + "/" + args[0]))
    }
}