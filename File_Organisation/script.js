const singleLevelDirectory = [];
const twoLevelDirectory = {};
const hierarchicalDirectory = {};

// Helper function to update the output display
function updateOutput(message) {
    const outputElement = document.getElementById("output");
    outputElement.textContent = message;
}

// Single Level Directory functions

function createSingleFile() {
    const fileName = prompt("Enter file name:");
    const fileSize = prompt("Enter file size:");
    singleLevelDirectory.push({ name: fileName, size: fileSize });
    updateOutput(`Created file "${fileName}" with size ${fileSize} in the Single Level Directory.`);
}

function deleteSingleFile() {
    const fileName = prompt("Enter file name to delete:");
    const index = singleLevelDirectory.findIndex(file => file.name === fileName);
    if (index !== -1) {
        singleLevelDirectory.splice(index, 1);
        updateOutput(`Deleted file "${fileName}" from the Single Level Directory.`);
    } else {
        updateOutput(`File "${fileName}" not found in the Single Level Directory.`);
    }
}

function searchSingleFile() {
    const fileName = prompt("Enter file name to search:");
    const file = singleLevelDirectory.find(file => file.name === fileName);
    if (file) {
        updateOutput(`File "${fileName}" found in the Single Level Directory.`);
    } else {
        updateOutput(`File "${fileName}" not found in the Single Level Directory.`);
    }
}

function listSingleFiles() {
    let outputMessage = "Single Level Directory Files:\n";
    singleLevelDirectory.forEach(file => {
        outputMessage += `Name: ${file.name}, Size: ${file.size}\n`;
    });
    updateOutput(outputMessage);
}

// Two Level Directory functions

function createTwoLevelFile() {
    const directoryName = prompt("Enter directory name:");
    if (!twoLevelDirectory.hasOwnProperty(directoryName)) {
        twoLevelDirectory[directoryName] = [];
    }
    const fileName = prompt("Enter file name:");
    const fileSize = prompt("Enter file size:");
    twoLevelDirectory[directoryName].push({ name: fileName, size: fileSize });
    updateOutput(`Created file "${fileName}" with size ${fileSize} in the Two Level Directory under directory "${directoryName}".`);
}

function deleteTwoLevelFile() {
    const directoryName = prompt("Enter directory name:");
    const fileName = prompt("Enter file name to delete:");
    if (twoLevelDirectory.hasOwnProperty(directoryName)) {
        const directory = twoLevelDirectory[directoryName];
        const index = directory.findIndex(file => file.name === fileName);
        if (index !== -1) {
            directory.splice(index, 1);
            updateOutput(`Deleted file "${fileName}" from the Two Level Directory under directory "${directoryName}".`);
        } else {
            updateOutput(`File "${fileName}" not found in the Two Level Directory under directory "${directoryName}".`);
        }
    } else {
        updateOutput(`Directory "${directoryName}" not found in the Two Level Directory.`);
    }
}

function searchTwoLevelFile() {
    const directoryName = prompt("Enter directory name:");
    const fileName = prompt("Enter file name to search:");
    if (twoLevelDirectory.hasOwnProperty(directoryName)) {
        const directory = twoLevelDirectory[directoryName];
        const file = directory.find(file => file.name === fileName);
        if (file) {
            updateOutput(`File "${fileName}" found in the Two Level Directory under directory "${directoryName}".`);
        } else {
            updateOutput(`File "${fileName}" not found in the Two Level Directory under directory "${directoryName}".`);
        }
    } else {
        updateOutput(`Directory "${directoryName}" not found in the Two Level Directory.`);
    }
}

function listTwoLevelFiles() {
    let outputMessage = "Two Level Directory Files:\n";
    for (const directoryName in twoLevelDirectory) {
        outputMessage += `Directory: ${directoryName}\n`;
        const directory = twoLevelDirectory[directoryName];
        directory.forEach(file => {
            outputMessage += `Name: ${file.name}, Size: ${file.size}\n`;
        });
    }
    updateOutput(outputMessage);
}

// Hierarchical Directory functions

function createHierarchicalFile() {
    const filePath = prompt("Enter file path (e.g., /dir1/dir2/):");
    const directories = filePath.split("/").filter(dir => dir !== "");
    let currentDirectory = hierarchicalDirectory;
    for (let i = 0; i < directories.length - 1; i++) {
        const directoryName = directories[i];
        if (!currentDirectory.hasOwnProperty(directoryName)) {
            currentDirectory[directoryName] = {};
        }
        currentDirectory = currentDirectory[directoryName];
    }
    const directoryName = directories[directories.length - 1];
    if (!currentDirectory.hasOwnProperty(directoryName)) {
        currentDirectory[directoryName] = [];
    }
    const fileName = prompt("Enter file name:");
    const fileSize = prompt("Enter file size:");
    currentDirectory[directoryName].push({ name: fileName, size: fileSize });
    updateOutput(`Created file "${fileName}" with size ${fileSize} in the Hierarchical Directory at path "${filePath}".`);
}

function deleteHierarchicalFile() {
    const filePath = prompt("Enter file path (e.g., /dir1/dir2/):");
    const fileName = prompt("Enter file name to delete:");
    const directories = filePath.split("/").filter(dir => dir !== "");
    let currentDirectory = hierarchicalDirectory;
    for (let i = 0; i < directories.length; i++) {
        const directoryName = directories[i];
        if (!currentDirectory.hasOwnProperty(directoryName)) {
            updateOutput(`Directory "${directoryName}" not found in the Hierarchical Directory at path "${filePath}".`);
            return;
        }
        currentDirectory = currentDirectory[directoryName];
    }
    const directory = currentDirectory;
    const index = directory.findIndex(file => file.name === fileName);
    if (index !== -1) {
        directory.splice(index, 1);
        updateOutput(`Deleted file "${fileName}" from the Hierarchical Directory at path "${filePath}".`);
    } else {
        updateOutput(`File "${fileName}" not found in the Hierarchical Directory at path "${filePath}".`);
    }
}

function searchHierarchicalFile() {
    const filePath = prompt("Enter file path (e.g., /dir1/dir2/):");
    const fileName = prompt("Enter file name to search:");
    const directories = filePath.split("/").filter(dir => dir !== "");
    let currentDirectory = hierarchicalDirectory;
    for (let i = 0; i < directories.length; i++) {
        const directoryName = directories[i];
        if (!currentDirectory.hasOwnProperty(directoryName)) {
            updateOutput(`Directory "${directoryName}" not found in the Hierarchical Directory at path "${filePath}".`);
            return;
        }
        currentDirectory = currentDirectory[directoryName];
    }
    const directory = currentDirectory;
    const file = directory.find(file => file.name === fileName);
    if (file) {
        updateOutput(`File "${fileName}" found in the Hierarchical Directory at path "${filePath}".`);
    } else {
        updateOutput(`File "${fileName}" not found in the Hierarchical Directory at path "${filePath}".`);
    }
}

function listHierarchicalFiles() {
    let outputMessage = "Hierarchical Directory Files:\n";
    listHierarchicalFilesRecursively(hierarchicalDirectory, "", outputMessage);
    updateOutput(outputMessage);
}

function listHierarchicalFilesRecursively(directory, currentPath, output) {
    for (const directoryName in directory) {
        const newPath = currentPath + "/" + directoryName;
        const files = directory[directoryName];
        files.forEach(file => {
            output += `Path: ${newPath}, Name: ${file.name}, Size: ${file.size}\n`;
        });
        listHierarchicalFilesRecursively(directory[directoryName], newPath, output);
    }
}