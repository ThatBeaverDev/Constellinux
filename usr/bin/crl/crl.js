// CRL COMPILER

function compileCommand(data) {
    let cmd = data.cmd
    let args = data.args
    let result
    switch(cmd[0]) {
        case "if":
            result = "if ("
            result += compileToken(args[0])
            result += ") {"
            for (const i in args[1]) {
                result += "\n"
                result += compileToken(args[1][i])
            }
            result += "\n}"
            break;
        case "ui":
            switch(cmd[1]) {
                case "text":
                    result = "html += '<r>" + compileToken(args[0]) + "</r>'"
                    break;
                case "tabs":
                    result = "html += system.crl.uiTabs(" + compileToken(args[0]) + ")"
                    break;
                case "post":
                    result = "html += " + compileToken(args[0])
                default:
                    result = "// currently unsupported UI call."
            }
            break;
        default:
            cmd = cmd.join(".")
            for (let i in args) {
                args[i] = compileToken(args[i])
            }
            switch(cmd) {
                case "url.get":
                    result = "await system.fetchURL(" + args[0] + ")"
                    break;
                case "array.get":
                    args[0] = system.cast.Stringify(args[0])
                    result = "system.crl.getArraySubsets(" + args.join(",") + ")"
                    break;
                default:
                    result = cmd + "(" + args.join(",") + ")"
            }
    }
    return result
}

function compileVarAssign(data) {
    let dat
    switch(data.cmd.join(".")) {
        case "window.name":
            dat = "system.gui.renameWindow(PID," + compileToken(data.args[1]) + ")"
            break;
        default:
            let pre = compileVariable(data.cmd)
            let args = data.args
            for (let i in args) {
                args[i] = compileToken(args[i])
            }
            args = args.join(" ")
            dat = pre + args
    }
    return dat

}

function compileVariable(data) {
    return 'VARIABLES["' + data.join('"]["') + '"]'
}

function compileToken(token) {
    switch(token.type) {
        case "code":
            return compileCommand(token.data)
        case "varAssign":
            return compileVarAssign(token.data)
        case "variable":
            return compileVariable(token.data)
        case "string":
            return String(token.data)
        case "integer":
            return Number(token.data)
        case "operator":
            return token.data
        case undefined:
            return undefined
        case "object":
            return system.cast.Stringify(token.data, false)
        case "array":
            if (typeof token.data == "object") {
                return token.data
            } else {
                try {return JSON.parse(token.data)} catch(e) {  system.warn("Cannot Parse Array to Object: " + token.data, "compileCRL")  }
            }
        default:
            console.log("Unknown Token Type and Data: " + token.type + " and " + token.data)
            return token.data
    }
}

function init(args) {
    // Define Functions and Locations
    system.crl = {}
    system.startProcess("crlAstGen","/usr/bin/crl/astGen.js")
    system.crl.compile = function compile(code) {
        system.crl.result = "let temp\nlet VARIABLES = system.processes[PID].variables\n"
        let ast = system.crl.generateAST(code)
        let events = ast.events
        for (const i in Object.keys(events)) {
            let eventName = Object.keys(events)[i]
            let event = ast.events[eventName]
            let allowed = true
            switch(eventName) {
                case "start":
                    system.crl.result += "async function init() {\nsystem.gui.newWindow(PID)\nconsole.log('crl')\n"
                    break;
                case "frame":
                    system.crl.result += "async function frame() {\nlet html = ''\n"
                    break;
                default:
                    allowed = false
            }
            if (allowed) {
                for (const data in event) {
                    if (typeof event[data] == "string" && event[data][0] == "∆") {
                        result += token.data
                    } else {
                        system.crl.result += "\n"
                        system.crl.result += compileToken(event[data])
                    }
                }
                switch(eventName) {
                    case "frame":
                        system.crl.result += "system.gui.windowInnerHTML(PID,html)\n}\n"
                        break;
                    default:
                    system.crl.result += "}\n"
                }
            }
            
        }
        return system.crl.result
    }

    // CRL Commands
    system.crl.getArraySubsets = function getArraySubsets(subsets, array) {
        let result = []
        subsets = system.cast.Objectify(subsets)
        array = system.cast.Objectify(array)
        if (typeof subsets == "string") {
            subsets = [subsets]
        }
        for (let i = 0; i < array.length; i++) {
            let x = []
            for (let i2 = 0; i2 < subsets.length; i2++) {
                x.push(array[i][subsets[i2]])
            }
            result.push(x)
        }
        return result
    }

    system.crl.uiTabs = function uiTabs(array) {
        let result = "<r>"
        if (typeof array == 'string') {
            array = system.cast.Objectify(array)
        }
        if (typeof array == "string") {
            array = [array]
        }
        for (let i = 0; i < array.length; i++) {
            result += '<br>' + array[i]
        }
        result += "</r>"
        return('\n' + result)
    }
}