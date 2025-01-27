// LS

function init(args) {
    system.post(system.folders.listDirectory((args[0] || system.dir)).join(",   "))
}