var num_processes = 0;
var num_resources = 0;
var resources = [];
let selectedId;
let targetId;
let rag = [];
var wfg;
var bfg;
var visited;
var cycle;
var cycleNodes;

function createProcess() {
    const processesContainer = document.getElementsByClassName("processes")[0];
    
    // Generate circle
    const circle = document.createElement("div");
    circle.className = "circle";
    circle.id = "P" + (num_processes + 1);
    circle.draggable = "true";
    circle.innerText = "P" + (num_processes + 1);
    processesContainer.appendChild(circle);
    num_processes++;

    rag.push(new Array(num_resources));
    for(i = 0; i < num_resources; i++) {
        rag[num_processes - 1][i] = 0;
    }
}

function createResource() {
    const resourcesContainer = document.getElementsByClassName("resources")[0];
    
    // Generate rectangle
    const rect = document.createElement("div");
    rect.className = "rect";
    rect.id = "R" + (num_resources + 1);
    rect.draggable = "true";
    const rectContainer = document.createElement("div");
    rectContainer.className = "resource-container";

    // Generate dots
    const dot_row = document.createElement("div");
    dot_row.className = "dot-row";

    const num_instances = document.getElementById("num_res").value || 1;
    resources.push(num_instances);
    for(i = 0; i < num_instances; i++) {
        const dot = document.createElement("div");
        dot.className = "dot";
        dot.style.width = "10px";
        dot.style.height = "10px";
        dot.style.backgroundColor = "black";

        dot_row.appendChild(dot);
    }

    rectContainer.appendChild(dot_row);
    rectContainer.appendChild(document.createTextNode("R" + (num_resources + 1)));
    rect.appendChild(rectContainer);
    resourcesContainer.appendChild(rect);
    num_resources++;

    for(i = 0; i < num_processes; i++) {
        rag[i].push(0);
    }
}

function createRequestEdge() {
    const process = document.getElementById("rpro").value || 1;
    const resource = document.getElementById("rres").value || 1;

    rag[process - 1][resource - 1]++;
    drawLine("P" + process, "R" + resource, 1);
}

function createAllocationEdge() {
    const process = document.getElementById("apro").value || 1;
    const resource = document.getElementById("ares").value || 1;

    rag[process - 1][resource - 1]--;
    drawLine("P" + process, "R" + resource, 0);
}

function detectDeadlock() {
    disableInputs(true);

    wfg = new Array(num_processes);
    bfg = new Array(num_processes);
    for(i = 0; i < num_processes; i++) {
        wfg[i] = new Array(num_processes);
        bfg[i] = new Array(num_processes);
        for(j = 0; j < num_processes; j++) {
            wfg[i][j] = 0;
            bfg[i][j] = -1;
        }
    }

    for(i = 0; i < num_processes; i++) {
        for(j = 0; j < num_resources; j++) {
            if(rag[i][j] > 0) {
                for(k = 0; k < num_processes; k++) {
                    if(i != k) {
                        if(rag[k][j] < 0) {
                            bfg[i][k] = j;
                            wfg[i][k] = 1;
                        }
                    }
                }
            }
        }
    }

    detectCycle();
    if(cycle == 1) {
        var resourcesInCycle = []
        for(i = 0; i < cycleNodes.length; i++) {
            var j = (i + 1) % cycleNodes.length;
            const a = cycleNodes[i];
            const b = cycleNodes[j];
            resourcesInCycle.push(parseInt(bfg[a][b]));
        }

        var deadlock = 0;
        for(m = 0; m < resourcesInCycle.length; m++) {
            var i = resourcesInCycle[m];
            var requests = 0;
            var allocations = 0;
            
            for(j = 0; j < num_processes; j++) {
                if(parseInt(rag[j][i]) >= 1) requests += parseInt(rag[j][i]);
                else if(parseInt(rag[j][i]) <= -1) allocations -= parseInt(rag[j][i]);
            }

            if(parseInt(resources[i]) - allocations < requests) {
                deadlock = 1;
                break;
            }
        }

        if(deadlock == 0) {
            document.getElementById("result").innerText = "Deadlock may exist";
            document.getElementById("result").style.color = "yellow";
        }
        else {
            for(i = 0; i < cycleNodes.length; i++) {
                var j = (i + 1) % cycleNodes.length;
                const a = cycleNodes[i];
                const b = cycleNodes[j];
                const k = parseInt(bfg[a][b]);
    
                document.getElementById("LP" + (a + 1) + "Req" + "R" + (k + 1)).style.borderColor = "red";
                document.getElementById("MP" + (a + 1) + "Req" + "R" + (k + 1)).style.borderBottomColor = "red";
                document.getElementById("LR" + (k + 1) + "Aloc" + "P" + (b + 1)).style.borderColor = "red";
                document.getElementById("MR" + (k + 1) + "Aloc" + "P" + (b + 1)).style.borderBottomColor = "red";
                
                document.getElementById("result").innerText = "Deadlock detected";
                document.getElementById("result").style.color = "red";
            
            }
        }

    }
    else {
        document.getElementById("result").innerText = "The System is Deadlock Free";
        document.getElementById("result").style.color = "green";
    }

    disableInputs(false);

}

function detectCycle() {
    visited = new Array(num_processes);
    parents = new Array(num_processes);
    cycle = 0;
    cycleNodes = [];
    for(i = 0; i < num_processes; i++) {
        visited[i] = 0;
        parents[i] = -1;
    }

    recursiveDFS(0, 0, parents);
}

function recursiveDFS(node, parent, parents) {
    node = parseInt(node);
    if(visited[node] == -1) {
        return;
    }

    if(visited[node] == 1) {
        var cur = parseInt(parent);
        cycleNodes.push(cur);

        while(cur != node) {
            cur = parents[cur];
            cycleNodes.push(cur);
        }
        cycleNodes.reverse();

        cycle = 1;
        return;
    }
    parents[node] = parent;
    visited[node] = 1;

    for(i = 0; i < num_processes; i++) {
        if(wfg[node][i] == 1) {
            recursiveDFS(i, node, parents);
        }

        if(cycle == 1) break;
    }

    visited[node] = -1;
}

function disableInputs(value) {
    document.getElementById("cprocess").disabled = value;
    document.getElementById("cres").disabled = value;
    document.getElementById("start").disabled = value;
    document.getElementById("creqedge").disabled = value;
    document.getElementById("calocedge").disabled = value;
}

function drawLine(a, b, rqe) {
    var a1 = document.getElementById(a);
    var coords1 = cumulativeOffset(a1);
    var x1 = coords1.left + 40;
    var y1 = coords1.top + 30;

    var a2 = document.getElementById(b);
    var coords2 = cumulativeOffset(a2);
    var x2 = coords2.left + 60;
    var y2 = coords2.top - 60;
    
    var lineElement = document.createElement('div');
    lineElement.style.top = y1 + 'px';
    lineElement.style.left = x1 + 'px';
    lineElement.style.width = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) + 'px';
    lineElement.style.transformOrigin = 'left center';
    lineElement.style.transform = 'rotate(' + Math.atan2(y2 - y1, x2 - x1) + 'rad)';
    lineElement.className = 'line';
    if(rqe == 1) {
        lineElement.id = "L" + a + "Req" + b;
    }
    else {
        lineElement.id = "L" + b + "Aloc" + a;
    }
    document.getElementsByClassName("dead-lock-container")[0].appendChild(lineElement);

    var marker = document.createElement('div');
    marker.className = 'triangle-marker';
    if(rqe == 1) {
        marker.style.top = (y2 - 10) + 'px';
        marker.style.left = (x2 - 10) + 'px';
        marker.style.transformOrigin = 'left center';
        marker.style.transform = 'rotate(' + 3.14 - Math.atan2(y2 - y1, x2 - x1) + 'rad)';
        marker.id = "M" + a + "Req" + b;
    }
    else {
        marker.style.top = (y1 - 10) + 'px';
        marker.style.left = (x1 - 10) + 'px';
        marker.style.transformOrigin = 'center';
        marker.style.transform = 'rotate(' + Math.atan2(y2 - y1, x2 - x1)+ 'rad)';
        marker.id = "M" + b + "Aloc" + a;
    }
    document.getElementsByClassName("dead-lock-container")[0].appendChild(marker);
}

var cumulativeOffset = function(element) {
    var top = 0, left = 0;
    do {
        top += element.offsetTop  || 0;
        left += element.offsetLeft || 0;
        element = element.offsetParent;
    } while(element);

    return {
        top: top,
        left: left
    };
}