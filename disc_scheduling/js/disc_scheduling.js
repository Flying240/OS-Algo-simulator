var algorithm = "";

function createChart(markers) {
    const chartContainer = document.getElementById("chart");

    // Clear existing markers
    while (chartContainer.firstChild) {
        chartContainer.removeChild(chartContainer.firstChild);
    }

    // Calculate the width for each marker
    const chartWidth = chartContainer.offsetWidth;
    const max_value = document.getElementById("max_input").value || 200;
    const markerWidth = chartWidth / max_value;
    
    // Generate the markers and labels
    markers.forEach((marker, index) => {
        const markerEl = document.createElement("div");
        markerEl.className = "marker";
        markerEl.style.left = `${marker * markerWidth}px`;
        chartContainer.appendChild(markerEl);

        const labelEl = document.createElement("div");
        labelEl.className = "label";
        labelEl.style.left = `${marker * markerWidth}px`;
        labelEl.textContent = marker;
        chartContainer.appendChild(labelEl);
    });
}

function setAlgorithm(event) {
    algorithm = event.target.innerText;
    document.getElementsByClassName("dropbtn")[0].innerText = algorithm;

}

function changeMaximum(event) {
    if(event.key === 'Enter') {
        var sequence = document.getElementById("string_input").value;
        var seqArray = sequence.split(' ').map(Number);

        if(seqArray.find((num) => num == 0) == undefined) {
            seqArray.push(0);
        }

        if(seqArray.find((num) => num == parseInt(event.target.value || 200)) == undefined) {
            seqArray.push(event.target.value || 200);
        }

        const head_pos = document.getElementById("head_input").value || 0;
        if(seqArray.find((num) => num == head_pos) == undefined) {
            seqArray.push(head_pos);
        }

        const chartWidth = document.getElementById("chart").offsetWidth;
        const markerWidth = chartWidth / (event.target.value || 200);
        document.getElementById("head").style.left = head_pos * markerWidth + 'px';

        const userMarkers = seqArray.sort((a, b) => a - b);
        createChart(userMarkers);
    }
}

function updateMarkers(event) {
    if(event.key == 'Enter') {
        var sequence = event.target.value;
        var seqArray = sequence.split(' ').map(Number);

        if(seqArray.find((num) => num == 0) == undefined) {
            seqArray.push(0);
        }

        const max_value = document.getElementById("max_input").value || 200;
        if(seqArray.find((num) => num == max_value) == undefined) {
            seqArray.push(max_value);
        }

        const head_pos = document.getElementById("head_input").value || 0;
        if(seqArray.find((num) => num == head_pos) == undefined) {
            seqArray.push(head_pos);
        }
        
        const userMarkers = seqArray.sort((a, b) => a - b);
        createChart(userMarkers);
    }
}

function initHead(event) {
    if(event.key == 'Enter') {
        var sequence = document.getElementById("string_input").value;
        var seqArray = sequence.split(' ').map(Number);

        if(seqArray.find((num) => num == 0) == undefined) {
            seqArray.push(0);
        }

        const max_value = document.getElementById("max_input").value || 200;
        if(seqArray.find((num) => num == max_value) == undefined) {
            seqArray.push(max_value);
        }

        const chartWidth = document.getElementById("chart").offsetWidth;
        const markerWidth = chartWidth / max_value;
        document.getElementById("head").style.left = (event.target.value || 0) * markerWidth + 'px';
        
        if(seqArray.find((num) => num == parseInt(event.target.value)) == undefined) {
            seqArray.push(event.target.value);
        }
        
        const userMarkers = seqArray.sort((a, b) => a - b);
        createChart(userMarkers);
    }
}

var markerIndex = 0;
var seeks = 0;
function beginAnimation() {
    disableInputs(true);

    const chartWidth = document.getElementById("chart").offsetWidth;
    const max_value = document.getElementById("max_input").value || 200;
    const markerWidth = chartWidth / max_value;
    
    var seqArray = getInputArray();
    clearOutputs();
    const head_pos = document.getElementById("head_input").value || 0;
    document.getElementById("head").style.left = head_pos * markerWidth + 'px';

    markerIndex = 0;
    seeks = 0;
    moveThruMarkers(seqArray, markerWidth);
}

function getInputArray() {
    var sequence = document.getElementById("string_input").value;
    var seqArray = sequence.split(' ').map(Number);

    switch(algorithm) {
        case "FCFS":
            seqArray.unshift(Number(document.getElementById("head_input").value || 0));
            break;
        case "SCAN":
        {
            const headPos = Number(document.getElementById("head_input").value || 0);
            const maxPos = Number(document.getElementById("max_input").value || 200);
            var lArray = new Array();
            var rArray = new Array();
            seqArray.forEach((value, index) => {
                if(parseInt(value) < headPos) {
                    lArray.push(parseInt(value));
                }
                else {
                    rArray.push(parseInt(value));
                }
            });

            lArray.sort((a, b) => b - a);
            rArray.sort((a, b) => a - b);

            var finalArray = new Array();
            finalArray.push(headPos);
            finalArray.push(...rArray);
            if(lArray.length != 0) {
                finalArray.push(maxPos);
                finalArray.push(...lArray);
            }
            seqArray = finalArray;
            break;
        }
        case "C-SCAN":
        {
            const headPos = Number(document.getElementById("head_input").value || 0);
            const maxPos = Number(document.getElementById("max_input").value || 200);
            var lArray = new Array();
            var rArray = new Array();
            seqArray.forEach((value, index) => {
                if(parseInt(value) < headPos) {
                    lArray.push(parseInt(value));
                }
                else {
                    rArray.push(parseInt(value));
                }
            });

            lArray.sort((a, b) => a - b);
            rArray.sort((a, b) => a - b);

            var finalArray = new Array();
            finalArray.push(headPos);
            finalArray.push(...rArray);
            if(lArray.length != 0) {
                finalArray.push(maxPos);
                finalArray.push(0);
                finalArray.push(...lArray);
            }
            seqArray = finalArray;
            break;
        }
        case "SSTF":
        {
            const headPos = Number(document.getElementById("head_input").value || 0);
            const maxPos = Number(document.getElementById("max_input").value || 200);
            var seeked = new Array(seqArray.length).fill(0);
            var finalArray = new Array();

            var getClosestSeek = function (head) {
                var min = -1;
                var ind;
                seqArray.forEach((value, index) => {
                    if(min < 0 && seeked[index] == 0) {
                        min = Math.abs(value - head);
                        ind = index;
                    }
                    else if(seeked[index] == 0 && Math.abs(value - head) < min) {
                        min = Math.abs(value - head);
                        ind = index;
                    }
                });
                seeked[ind] = 1;
                return seqArray[ind];
            }

            finalArray.push(headPos);
            var head = headPos;
            for(i = 0; i < seqArray.length; i++) {
                finalArray.push(getClosestSeek(head));
                head = finalArray[i + 1];
            }
            seqArray = finalArray;
            break;
        }
    }

    return seqArray;
}

var headId = null;
function moveThruMarkers(markers, markerWidth) {

    var elem = document.getElementById("head");
    var pos = elem.style.left.substring(0, elem.style.left.indexOf('p'));

    clearInterval(headId);
    headId = setInterval(frame, 10);
    function frame() {
        if(markerIndex >= markers.length) {
            clearInterval(headId);
            disableInputs(false);
            elem.style.left = pos + 'px';
        }
        else if (Math.abs(parseFloat(pos) - parseFloat(markers[markerIndex] * markerWidth)) <= 1.0) {
            appendsPointMarker(markers[markerIndex] * markerWidth);
            if(markerIndex != 0) {
                drawLine();

                seeks += Math.abs(markers[markerIndex] - markers[markerIndex - 1]);
                document.getElementById("total_seek").innerText = "Total Seek = " + seeks;
            }
            elem.style.left = markers[markerIndex] + 'px';
            markerIndex++;
        }
        else {
            if(markerIndex < markers.length) {
                if(parseFloat(pos) < parseFloat(markers[markerIndex] * markerWidth)) {
                    pos++;
                }
                else {
                    pos--;
                }
                elem.style.left = pos + 'px';
            }
        }
    }
}

function disableInputs(value) {
    document.getElementById("max_input").disabled = value;
    document.getElementById("string_input").disabled = value;
    document.getElementById("head_input").disabled = value;
    document.getElementById("go_button").disabled = value;
}

function appendsPointMarker(posx) {
    const group = document.getElementsByClassName("chart-container")[0];

    const markerDot = document.createElement("div");
    markerDot.className = "dot";
    markerDot.style.left = posx + 'px';
    group.appendChild(markerDot);
}

function drawLine() {
    const childNodes = document.getElementsByClassName("chart-container")[0].children;
    var dots = new Array();
    for(var i = 0; i < childNodes.length; i++) {
        var ele = childNodes[i];
        if(ele.classList.contains("dot")) {
            dots.push(ele);
        }
    }
    const num_dots = dots.length;

    if(num_dots <= 1) return;
    
    var coords1 = cumulativeOffset(dots[num_dots - 1]);
    var x1 = coords1.left + 2.5;
    var y1 = coords1.top + 2.5;

    var coords2 = cumulativeOffset(dots[num_dots - 2]);
    var x2 = coords2.left + 2.5;
    var y2 = coords2.top + 2.5;
    
    var lineElement = document.createElement('div');
    console.log(y1);
    lineElement.style.top = y1 + 'px';
    lineElement.style.left = x1 + 'px';
    lineElement.style.width = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) + 'px';
    lineElement.style.transformOrigin = 'left center';
    lineElement.style.transform = 'rotate(' + Math.atan2(y2 - y1, x2 - x1) + 'rad)';
    lineElement.className = 'line';
    document.getElementsByClassName("chart-container")[0].appendChild(lineElement);
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

function clearOutputs() {
    const node = document.getElementsByClassName("chart-container")[0];

    for(var i = 0; i < node.children.length; i++) {
        var ele = node.children[i];
        if(ele.classList.contains("dot") || ele.classList.contains("line")) {
            node.removeChild(ele);
            i--;
        }
    }
}