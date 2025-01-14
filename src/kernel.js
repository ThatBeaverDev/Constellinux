async function kernel() {
	let Name = "Kernel"

	system = {}
	system.processes = []
	system.procCount = 0
	system.dir = "/"

	system.inputText = ""
	logHTML = document.getElementById("termLOG")
	logsHTML = document.getElementById("logs")
	system.log = function log(str, origin) {
		let text = str
		if (typeof text !== "string") {
			try {
				text = JSON.stringify(text)
			} catch (e) {
				text = String(text)
			}
		}
		if (text == undefined) {
			text = ""
		}
		text = text.split("\n")
		if (text.length == 0) {
			text = ["yes"]
		}
		for (const line in text) {
			let element = document.createElement("p")
			element.id = "log"
            if (line == 0) {
                element.innerText = (origin || Name) + ": " + text[line];
            } else {
                element.innerText = text[line]
            }
			console.log(element.innerText)
			document.body.appendChild(element)
		}
	}

	system.post = function post(str, origin) {
		let text = str
		if (typeof text !== "string") {
			try {
				text = JSON.stringify(text)
			} catch (e) {
				text = String(text)
			}
		}
		if (text == undefined) {
			text = ""
		}
		text = text.split("\n")
		if (text.length == 0) {
			text = ["yes"]
		}
		for (const line in text) {
			let element = document.createElement("p")
			element.id = "log"
			element.innerText = text[line]
			console.log(element.innerText)
			document.body.appendChild(element)
		}
	}

	system.warn = function log(str, origin) {
		let text = str
		if (typeof text == "object") {
			text = JSON.stringify(text)
		}
		let element = document.createElement("p")
		element.id = "warn"
		element.innerText = "[" + Date.now() + "] - " + (origin || Name) + ": " + text;
		console.error(element.innerText)
		document.body.appendChild(element)
	}
	system.error = function log(str, origin) {
		let text = str
		if (typeof text == "object") {
			text = JSON.stringify(text)
		}
		let element = document.createElement("p")
		element.id = "error"
		element.innerText = "[" + Date.now() + "] - " + (origin || Name) + ": " + text;
		console.error(element.innerText)
		document.body.appendChild(element)
	}

	try {
		system.log("Starting JS Engine...")

		system.fetchURL = async function fetchURL(url) {
			const response = await fetch(url);
			const data = await response.text();
			return data;
		}
		system.startProcess = async function(name, dir, args) {
			system.preScript = "const PID = " + system.procCount + ";\n"
			system.preScript += "const Name = '" + name + "';\n"
			system.preScript += "const args = JSON.parse('" + JSON.stringify((args || [])) + "');\n"
			let obj = {}
			obj.code = system.preScript + system.files.get(dir)
			obj.args = args
			obj.PID = system.procCount
			obj.name = name
			system.processes[system.procCount] = obj
			system.procCount++
			eval(obj.code + "\ninit(args)")
			return system.procCount - 1
		}
		system.stopProcess = function stopProcess(PID) {
			delete system.processes[PID]
		}


		// START FILESYSTEM
		system.log("Registering Drive Functions.")
		system.folders = {}
		let obj = {}
		obj.children = {}
		system.folders["/"] = obj
		system.files = {}
		system.files.count = 0

		system.files.writeFile = function writeFile(dirOld, content) {
			try {
				let dir = dirOld // use to replace ~ with home dir in future
				let location = dir.substr(0, dir.lastIndexOf("/"))
				if (location == "") {
					location = "/"
				}
				let filename = dir.substr(dir.lastIndexOf("/") + 1)
				let obj = {}
				obj.id = system.files.count
				system.files.count += 1
				obj.content = content
				system.folders[location].children[filename] = obj.id
				system.files[obj.id] = obj
			} catch (e) {
				system.error("Error Writing to File at " + dirOld + ": " + e)
				return false
			}
			return true
		}

		system.folders.writeFolder = function writeFolder(dirOld) {
			try {
				let dir = dirOld // use to replace ~ with home dir in future
				let location = dir.substr(0, dir.lastIndexOf("/"))
				if (location == "") {
					location = "/"
				}
				let foldername = dir.substr(dir.lastIndexOf("/") + 1)
				let obj = {}
				obj.children = {}
				system.folders[dir] = obj
				obj = {}
				obj.id = system.files.count
				system.files.count += 1
				obj.type = "folder"
				obj.content = dir
				system.folders[location].children[foldername] = obj.id
				system.files[obj.id] = obj
				system.log("Created Directory " + dirOld + " Successfully.", "writeFolder")
			} catch (e) {
				system.error("Error Creating Folder at " + dirOld + ": " + e)
				return false
			}
			return true
		}

		system.files.get = function get(dirOld) {
			try {
				if (dirOld === "") {
					return ""
				}
				let dir = dirOld // use to replace ~ with home dir in future
				let location = dir.substr(0, dir.lastIndexOf("/"))
				if (location == "") {
					location = "/"
				}
				let filename = dir.substr(dir.lastIndexOf("/") + 1)
				try {
					return system.files[system.folders[location].children[filename]].content
				} catch (e) {
					return (undefined)
				}
			} catch (e) {
				system.error("Error Reading File at " + dirOld + ": " + e)
				return
			}
		}

		system.folders.listDirectory = function listDirectory(dirOld) {
			try {
				let dir = dirOld // use to replace ~ with home dir in future
				let location = dir.substr(0, dir.lastIndexOf("/"))
				if (location == "") {
					location = "/"
				}
                if (location[location.length - 1] !== "/") {
                    location += "/"
                }
				location += dir.substr(dir.lastIndexOf("/") + 1)
				return Object.keys(system.folders[location].children)
			} catch (e) {
				return []
			}
		}

		system.files.deleteFile = function deleteFile(dirOld) {
			try {
				let dir = dirOld // use to replace ~ with home dir in future
				let location = dir.substr(0, dir.lastIndexOf("/"));
				if (location == "") {
					location = "/"
				}
				let filename = dir.substr(dir.lastIndexOf("/") + 1);
				delete system.files[system.folders[location].children[filename]]
				delete system.folders[location].children[filename]
			} catch (e) {
				system.error("Error Deleting File File at " + dirOld + ": " + e)
				return
			}
		}

		system.log("Creating Basic Directories...")
		system.folders.writeFolder("/home")
		system.folders.writeFolder("/bin")
		let list = await system.fetchURL("./bin/index.json")
		list = JSON.parse(list)
		for (const item in list) {
			obj = await system.fetchURL("./bin/" + list[item])
			system.files.writeFile("/bin/" + list[item], obj)
		}
		system.folders.writeFolder("/etc")
		system.folders.writeFolder("/usr")
		system.folders.writeFolder("/usr/lib")
		system.folders.writeFolder("/usr/lib/systemc")
		obj = await system.fetchURL("./systemC.js")
		system.files.writeFile("/usr/lib/systemc/systemc.js", obj)
		system.folders.writeFolder("/home")

		system.log("Starting systemC...")
		system.startProcess("systemC", "/usr/lib/systemc/systemc.js").then()
		system.log("Beginning to run processes...")

		system.input = document.getElementById('inputBox');
		system.input.innerText = system.dir + " % " + system.inputText
		// INPUT
		document.addEventListener('keydown', (e) => {
			let temp = String(system.inputText)
			switch (e.key) {
				case "Backspace":
					temp = temp.slice(0, -1);
					break;
				case "Enter":
					system.eval(system.inputText,system.dir + " % ")
					temp = ""
					break;
				case " ":
					temp = temp + " s";
					temp = temp.slice(0, -1);
					break;
				default:
					let keys = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890!@£$%^&*()§±-_=+;:'\"\\|`~,~,<.>/?1234567890¡€#¢∞§¶•ªº–≠œ∑´®†¥¨^øπ“‘åƒ©˙∆˚¬…æ«`Ω≈ç√∫~µ≤≥÷⁄™‹›ﬁﬂ‡°·‚—±Œ„‰ÂÊÁËÈØ∏”’ÅÍÎÏÌÓÔÒÚÆ»ŸÛÙÇ◊ıˆ˜¯˘¿"
					if (keys.includes(e.key)) {
						temp += e.key;
					}
			};
			system.inputText = temp
			system.input.innerText = system.dir + " % " + system.inputText
		});

		system.eval = async function sysEval(code,pre) {
			system.post(pre + code)
			let segments = String(code).split(" ")
			if (system.files.get("/bin/" + segments[0] + ".js") == undefined) {
				system.log("command not found:  " + segments[0])
			} else {
				system.startProcess(segments[0], "/bin/" + segments[0] + ".js", segments.slice(1))
			}
		}


		var runtime = setInterval(function() {


			for (let i = 0; i < system.processes.length; i++) {
				if (system.processes[i] !== undefined) {
                    if (String(system.processes[i].code).includes("function frame(")) {
                        eval(system.processes[i].code + "\nframe(args)")
                    } else {
                        system.stopProcess(i)
                    }
				} else {}
			}
		}, 160);
	} catch (e) {
		system.error("KERNEL PANIC - " + e)
	}
}

kernel()