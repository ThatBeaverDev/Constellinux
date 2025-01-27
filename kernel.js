async function kernel() {
	let Name = "Kernel"

	system = {}
	system.safe = false
	system.forceSystemLog = true
	system.processes = []
	system.procCount = 0
	system.dir = "/"

	system.inputText = ""
	system.logsBox = document.getElementById("logsBox")
	logHTML = document.getElementById("termLOG")
	logsHTML = document.getElementById("logs")

	system.log = function(str, origin) {
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
			system.logsBox.appendChild(element)
		}
	}
	system.post = function(str, origin) {
		system.lastPost = str
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
			system.logsBox.appendChild(element)
		}
	}

	system.warn = function(str, origin) {
		let text = str
		if (typeof text == "object") {
			text = JSON.stringify(text)
		}
		let element = document.createElement("p")
		element.id = "warn"
		element.innerText = "[" + Date.now() + "] - " + (origin || Name) + ": " + text;
		console.warn(element.innerText)
		system.logsBox.appendChild(element)
	}
	system.error = function(str, origin) {
		let text = str
		if (typeof text == "object") {
			text = JSON.stringify(text)
		}
		let element = document.createElement("p")
		element.id = "error"
		element.innerText = "[" + Date.now() + "] - " + (origin || Name) + ": " + text;
		console.error(element.innerText)
		system.logsBox.appendChild(element)
	}

	system.fetchURL = async function fetchURL(url) {
		console.log("fetchURL request to " + url)
		const response = await fetch(url);
		const data = await response.text();
		return data;
	}

	try {

		system.cast = {}
		system.cast.Objectify = function Objectify(obj) {
			if (typeof obj === "object") {
				return obj;
			}
			try {
				return (JSON.parse(obj))
			} catch (e) {}
			try {
				return (obj)
			} catch (e) {}
		}

		system.cast.Stringify = function Stringify(str, beautify) {
			if (typeof str === "object") {
				if (beautify) {
					return JSON.stringify(str, null, 4);
				} else {
					return JSON.stringify(str);
				}
			}
			return (String(str))
		}

		// https://patorjk.com/software/taag/#p=display&h=0&f=Doom 
		system.post(String(" _____                     _          _  _  _                     \n/  __ \\                   | |        | || |(_)                    \n| /  \\/  ___   _ __   ___ | |_   ___ | || | _  _ __   _   _ __  __\n| |     / _ \\ | '_ \\ / __|| __| / _ \\| || || || '_ \\ | | | |\\ \\/ /\n| \\__/\\| (_) || | | |\\__ \\| |_ |  __/| || || || | | || |_| | >  < \n \\____/ \\___/ |_| |_||___/ \\__| \\___||_||_||_||_| |_| \\__,_|/_/\\_\\"))
		system.post(" ")

		system.log("Starting JS Engine...")

		system.startProcess = async function(dir, args) {
			if (system.files.get(dir) == undefined) {
				return
			}
			system.preScript = "const PID = " + system.procCount + ";\n"
			system.preScript += "const Name = '" + name + "';\n"
			system.preScript += "const args = JSON.parse('" + JSON.stringify((args || [])) + "');\n"
			let obj = {}
			let code
			let type = String(dir).substring(String(dir).indexOf(".") + 1)
			switch (type) {
				case "js":
					code = system.files.get(dir)
					if (system.forceSystemLog) {
						code = code.replaceAll("console.log(", "system.log(")
						code = code.replaceAll("console.warn(", "system.warn(")
						code = code.replaceAll("console.error(", "system.error(")
					}
					break;
				case "crl":
					if (system.crl !== undefined) {
						code = system.crl.compile(system.files.get(dir))
					} else {
						system.error("CRL system not initialised")
					}
					break;
			}
			code = system.preScript + code
			obj.code = code
			obj.args = args
			obj.variables = {}
			obj.variables.window = {}
			obj.PID = system.procCount
			obj.name = dir
			system.processes[system.procCount] = obj
			system.procCount++
			if (system.safe) {
				eval(obj.code + "\ntry {init(args) } catch(e) {  system.error(e, Name)  }")
			} else {
				eval(obj.code + "\ninit(args)")
			}
			return system.procCount - 1
		}
		system.stopProcess = function stopProcess(PID) {
			delete system.processes[PID]
		}

		system.toDir = function toDir(dir) {
			if (dir[0] == "/") {
				return (dir)
			} else {
				return (system.dir + "/" + dir)
			}
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
				console.log("Created Directory " + dirOld + " Successfully.", "writeFolder")
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

		let list = await system.fetchURL("./index.json")

		folders = JSON.parse(list).folders
		for (const item in folders) {
			system.folders.writeFolder(folders[item])
		}

		system.log("Writing Default Files...")

		files = JSON.parse(list).files
		for (const item in files) {
			obj = await system.fetchURL("." + files[item])
			system.files.writeFile(files[item], obj)
		}

		system.log("Starting systemC...")
		system.startProcess("/usr/bin/systemc/systemC.js").then()
		if (!system.systemC) {
			system.error("systemC not running.")
			return
		}
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
					system.eval(system.inputText, system.dir + " % ")
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

		system.eval = async function(code, pre) {
			system.post(pre + code)
			let segments = String(code).split(" ")
			if (system.files.get("/bin/" + segments[0] + ".js") == undefined) {
				system.log("command not found:  " + segments[0])
			} else {
				system.startProcess("/bin/" + segments[0] + ".js", segments.slice(1))
			}
		}



		var runtime = setInterval(function() {


			for (let i = 0; i < system.processes.length; i++) {
				if (system.processes[i] !== undefined) {
					if (String(system.processes[i].code).includes("frame()")) {
						if (system.safe) {
							eval(system.processes[i].code + "\ntry {frame() } catch(e) {  system.error(e, Name)  }")
						} else {
							eval(system.processes[i].code + "\nframe()")
						}
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

kernel().then()