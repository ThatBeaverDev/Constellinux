// Name: CRL AST Generator
// ID: crlastgen
// Description: Generates the AST For CRL for Constellinux / The Constellinux Project / Castorea Kernel

Object.clone=function(e){if(null===e)return null;if("object"==typeof e){if(Array.isArray(e))return e.map((e=>Object.clone(e)));if(e instanceof RegExp)return new RegExp(e);{let n={};for(let r in e)e.hasOwnProperty(r)&&(n[r]=Object.clone(e[r]));return n}}return e};

system.crl.generateAST = function generateAST(p0) {
    let ast = {}
    let split = p0.split("/@ event ").filter((item) => item !== "");
    let temp
    let temp2
    let astor = {}
    for (let i = 0; i < split.length; i++) {
        temp = split[i].indexOf(":")
        temp = [split[i].substring(0,temp), split[i].substring(temp + 1)]
        temp2 = Object.clone(temp)
        if (temp2[1] == ":\n") {
            temp2.splice(0,2)
        } else {
            temp2.splice(0,1)
        }
        temp2 = temp2.join("")
        ast[temp[0]] = reTokenise(temp2)
    }
    astor.events = ast
    return astor
}

function reTokenise(p0) {
    let result = []
    let lines = p0.split("\n").filter(line => line !== "")
    let code
    let temp
    let obj
    let cmd
    let args
    let i
    for (let line = 0; line < lines.length; line++) {
        code = tokenise(lines[line])
        i = 0
        obj = {}
        obj.data = {}
        obj.type = undefined
        if (lines[line][0] === "(" && lines[line].slice(-1) === ")") {
            i = lines[line].indexOf("(")
            args = lines[line].lastIndexOf(")")
            obj = tokenise(lines[line].substring(i + 1, args))
            for (let i = 0; i < obj.length; i++) {
                temp = {}
                temp.data = obj[i]
                temp.type = tokentype(temp.data)
                if (temp.type == "code") {
                    temp = reTokenise(temp.data)[0]
                }
                if (temp.type == "variable") {
                    temp.data = temp.data.split(".")
                }
                obj[i] = temp
            }
        } else if (tokentype(lines[line]) == "code" && code.length == 1) {
            i = lines[line].indexOf("(")
            cmd = lines[line].substring(0, i).split(".")
            args = lines[line].lastIndexOf(")")
            args = tokenise(lines[line].substring(i + 1, args))
            obj.data.cmd = cmd
            obj.data.args = args
            for (let i = 0; i < obj.data.args.length; i++) {
                temp = {}
                temp.data = obj.data.args[i]
                temp.type = tokentype(temp.data)
                if (temp.type == "code") {
                    temp = reTokenise(temp.data)[0]
                }
                if (temp.type == "variable") {
                    temp.data = temp.data.split(".")
                }
                obj.data.args[i] = temp
            }
            obj.type = "code"
        } else {
            obj.data.cmd = code[i].split(".")
            obj.data.args = Object.clone(code)
            obj.data.args.splice(0,1)
            for (i = 0; i < obj.data.args.length; i++) {
                temp = {}
                temp.data = obj.data.args[i]
                temp.type = tokentype(temp.data)
                if (temp.type == "code") {
                    temp = reTokenise(temp.data)[0]
                } else if (temp.type == "variable") {
                    temp.data = temp.data.split(".")
                }
                obj.data.args[i] = temp
            }
            if (code[2][0] == "(" && code[2].slice(-1) == ")") {
                obj.type = "code"
            } else {
                obj.type = "varAssign"
            }
        }
        result.push(obj)
    }
    return result
}

function tokentype(p0) {
    p0 = String(p0)
    if (isString(p0)) {
        return "string"
    } else if (isOperator(p0)) {
        return "operator"
    } else if (isInt(p0)) {
        return "integer"
    } else if (isArray(p0)) {
        return "array"
    } else if (isObject(p0)) {
        return "object"
    } else if (isBoolean(p0)) {
        return "isBoolean"
    } else if (p0[p0.length - 1] === ")") {
        return "code"
    } else {
        return "variable"
    }
}

function isString(p0) {
    let thing = String(p0)
    return((thing[0] == '"' || thing[0] == "'") && thing[thing.length - 1] == thing[0])
}

function isInt(p0) {
    const str = String(p0);
    if (str.length === 0) {
      return false; 
    }
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      if ((charCode < 48 || charCode > 57) && !(charCode === 45 || charCode === 46)) {
        return false;
      }
    }
    return true;
}

function isArray(p0) {
    return(String(p0)[0] == "[")
}

function isObject(p0) {
    return(String(p0)[0] == "{")
}

function isOperator(p0) {
    return(["+","+=","-","-=","=","/","/=","*","*=","%","~","!==","==","==="].includes(p0))
}

function isBoolean(p0) {
    if (p0 === "true") {
        return true 
    }
    if (p0 === "false") {
        return true
    }
    return false
}

function tokenise(p0) {
    let brackets = 0
    let curlyBrackets = 0
    let squareBrackets = 0
    let string = 0
    let tokens = []
    let token = ""
    let char
    for (let i = 0; i < p0.length; i++) {
        char = p0[i]
        if (squareBrackets == 0 && curlyBrackets == 0 && brackets == 0) {
            if (char == '"') {
                if (string == 0) {
                    string = 1
                } else {
                    string = 0
                }
            }
        }
        if (string == 0 && curlyBrackets == 0 && brackets == 0) {
            if (char == "[") {
                squareBrackets += 1
            } else if (char == "]") {
                squareBrackets -= 1
            }
        }
        if (squareBrackets == 0 && string == 0 && brackets == 0) {
            if (char == "{") {
                curlyBrackets += 1
            } else if (char == "}") {
                curlyBrackets -= 1
            }
        }
        if (squareBrackets == 0 && curlyBrackets == 0 && string == 0) {
            if (char == "(") {
                brackets += 1
            } else if (char == ")") {
                brackets -= 1
            }
        }
        if (squareBrackets == 0 && curlyBrackets == 0 && brackets == 0 && string == 0) {
            if (char === " " || char === "\n" || char === ";") {
                tokens.push(token.replaceAll("\t",""))
                token = ""
            } else {
                token = token + char
            }
        } else {
            token = token + char
        }
      }
      tokens.push(token.replaceAll("\t",""))
      token = ""
      tokens = tokens.filter(token => token !== "" && token !== " ")
      return tokens
}

function init() {}