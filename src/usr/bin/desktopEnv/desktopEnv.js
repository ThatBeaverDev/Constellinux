// Desktop Environment.

// Standard Functions are system.gui.newWindow(PID), system.gui.moveWindow(PID, x, y, wid, hei), system.gui.renameWindow(PID, name) and system.gui.windowInnerText(PID, innerHTML)
// you will have to define system.gui yourself.
// good look, competition

function init() {
    // Code to make windows draggable
    
    function dragElement(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById(elmnt.id + "header")) {
          // if present, the header is where you move the DIV from:
          document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
        } else {
          // otherwise, move the DIV from anywhere inside the DIV:
          elmnt.onmousedown = dragMouseDown;
        }
      
        function dragMouseDown(e) {
          e = e || window.event;
          e.preventDefault();
          // get the mouse cursor position at startup:
          pos3 = e.clientX;
          pos4 = e.clientY;
          document.onmouseup = closeDragElement;
          // call a function whenever the cursor moves:
          document.onmousemove = elementDrag;
        }
      
        function elementDrag(e) {
          e = e || window.event;
          e.preventDefault();
          // calculate the new cursor position:
          pos1 = pos3 - e.clientX;
          pos2 = pos4 - e.clientY;
          pos3 = e.clientX;
          pos4 = e.clientY;
          // set the element's new position:
          elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
          elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }
      
        function closeDragElement() {
          // stop moving when mouse button is released:
          document.onmouseup = null;
          document.onmousemove = null;
        }
      }

      
    // rest of INIT
    system.gui = {}
    system.gui.element = document.getElementById("gui")
    system.gui.windows = []
    
    system.gui.newWindow = function newWindow(PID) {
        let element = document.createElement("div")
        element.id = "windowForPid:" + PID
        element.style = "background-color: orange; width: 10vw; height: 10vw; position: absolute;"
        system.gui.element.appendChild(element)
        element = document.getElementById("windowForPid:" + PID)
        let top = document.createElement("div")
        top.id = "windowForPid:" + PID + "top"
        top.style = "height: 25px; background-color: grey; overflow: hidden;"
        top.innerHTML = "<p>Window For " + PID + "</p>"
        element.appendChild(top)
        let internals = document.createElement("div")
        internals.id = "windowForPid:" + PID + "contents"
        internals.style = "width: max-content; height: max-content; overflow: hidden;"
        element.appendChild(internals)
        dragElement(element)
        system.gui.windows.push(element)
    }

    system.gui.windowInnerText = function windowInnerText(PID, innerHTML) {
        let window = document.getElementById("windowForPid:" + PID + "contents")
        window.innerHTML = innerHTML
    }
}

function frame() {
}