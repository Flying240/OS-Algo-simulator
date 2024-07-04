document.addEventListener("DOMContentLoaded", function () {
    var memoryRequirementsContainer = document.getElementById("memoryRequirements");
    var memoryAllocationForm = document.getElementById("memoryAllocationForm");
    var memoryBlocksDiv = document.getElementById("memoryBlocks");
    var outputDiv = document.getElementById("output");

    memoryAllocationForm.addEventListener("submit", function (event) {
        event.preventDefault();

        var ms = parseInt(document.getElementById("totalMemorySize").value);
        var bs = parseInt(document.getElementById("blockSize").value);
        var np = parseInt(document.getElementById("numProcesses").value);
        var memoryRequirements = [];

        // Retrieve memory requirements for each process
        for (var i = 0; i < np; i++) {
            var memoryInput = document.getElementById("memoryInput_" + i);
            memoryRequirements.push(parseInt(memoryInput.value));
        }

        // Perform memory allocation simulation
        var nb = Math.floor(ms / bs);
        var ef = ms - nb * bs;
        var memoryBlocks = [];
        var visited = [];
        var p = 0;
        var tif = 0;

        // Initialize memory blocks and visited array
        for (var i = 0; i < nb; i++) {
            memoryBlocks.push(bs);
            visited.push(0);
        }

        // Allocate memory to processes
        var bno = 0;
        for (var j = 0; j < np && p < nb; j++) {
            if (visited[j] === 0) {
                if (memoryRequirements[j] > bs) {
                    continue;
                } else {
                    memoryBlocks[bno] -= memoryRequirements[j];
                    tif += memoryBlocks[bno];
                    p++;
                    visited[j] = 1;
                    bno++;
                }
            }
        }

        // Generate visual representation of memory allocation
        var output = "Number of blocks = " + nb + "<br>";
        for (var i = 0; i < nb; i++) {
            output += "<div class='block " + (memoryBlocks[i] === bs ? "empty" : "process") + "'>";
            output += i + "<br>" + memoryBlocks[i];
            output += "</div>";
        }

        for (var i = nb; i < memoryBlocks.length; i++) {
            output += "<div class='block empty'>" + i + "<br>" + memoryBlocks[i] + "</div>";
        }



        output += "<br>TIF: " + tif;
        output += "<br>TEF: " + ef;

        memoryBlocksDiv.innerHTML = output;
        outputDiv.innerHTML = "";
    });

    // Add dynamic input fields for memory requirements based on the number of processes
    document.getElementById("numProcesses").addEventListener("change", function () {
        var numProcesses = parseInt(this.value);
        var inputFields = "";

        for (var i = 0; i < numProcesses; i++) {
            inputFields += "<label for='memoryInput_" + i + "'>Enter memory requirement for P" + i + ":</label>";
            inputFields += "<input type='number' id='memoryInput_" + i + "' required><br>";
        }

        memoryRequirementsContainer.innerHTML = inputFields;
    });
});
