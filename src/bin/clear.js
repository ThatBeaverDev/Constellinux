// Clear Logs

function init() {
    let logs = document.getElementById("log")
    while (logs !== null) {
        logs.remove()
        logs = document.getElementById("log")
    }
    let warns = document.getElementById("warn")
    while (warns !== null) {
        warns.remove()
        warns = document.getElementById("warn")
    }
    let errs = document.getElementById("error")
    while (errs !== null) {
        errs.remove()
        errs = document.getElementById("error")
    }
}