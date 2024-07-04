document.addEventListener("DOMContentLoaded", function () {
  var memoryRequirementsContainer = document.getElementById("memoryRequirements");
  var memoryAllocationForm = document.getElementById("memoryAllocationForm");
  var memoryBlocksDiv = document.getElementById("memoryBlocks");
  var outputDiv = document.getElementById("output");

  memoryAllocationForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var ms = parseInt(document.getElementById("totalMemorySize").value);
    var np = parseInt(document.getElementById("numProcesses").value);
    var memoryRequirements = [];

    // Retrieve memory requirements for each process
    for (var i = 0; i < np; i++) {
      var memoryInput = document.getElementById("memoryInput_" + i);
      memoryRequirements.push(parseInt(memoryInput.value));
    }

    // Perform memory allocation simulation
    var memoryBlocks = [];
    var visited = [];
    var tif = 0;

    // Initialize memory blocks and visited array
    for (var i = 0; i < np; i++) {
      memoryBlocks.push(memoryRequirements[i]);
      visited.push(0);
      tif += memoryRequirements[i];
    }``

    // Calculate left memory
    var leftMemory = ms - tif;

    // Generate visual representation of memory allocation
    var output = "";
    var allocationPossible = true; // Flag to track if memory allocation is possible

    // Check if left memory is negative
    if (leftMemory >= 0) {
      for (var i = 0; i < np; i++) {
        output += "<div class='block process'>";
        output += "P" + i + "<br>" + memoryBlocks[i];
        output += "</div>";
      }

      // Add left memory block
      output += "<div class='block empty'>";
      output += "Left<br>" + leftMemory;
      output += "</div>";

      output += "<br>TIF: " + tif;
      output += "<br>TEF: " + leftMemory;
    } else {
      allocationPossible = false;
      output = "<p>Memory Full</p>";
    }

    memoryBlocksDiv.innerHTML = output;

    // Display allocation result
    if (allocationPossible) {
      outputDiv.innerHTML = "<p>Memory allocation successful.</p>";
    } else {
      outputDiv.innerHTML = "<p>Memory allocation failed.</p>";
    }
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
