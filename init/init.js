const fs = require("fs");
const path = require("path");

const folderPath = path.join(__dirname, "public", "medias");
console.log(folderPath);

function getFileType(filename) {
  const extension = filename.split(".").pop().toLowerCase();

  if (extension === "jpg" || extension === "jpeg" || extension === "png") {
    return "image";
  } else if (extension === "mp4" || extension === "mov") {
    return "video";
  }

  return "unknown";
}

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error("Error reading folder:", err);
    return;
  }

  const fileNames = files.map((file) => {
    const filePath = path.join("./medias", file);
    const fileType = getFileType(file);

    return {
      type: fileType,
      url: filePath,
    };
  });

  const jsonContent = JSON.stringify(fileNames, null, 2);
  const destinationPath = path.join(__dirname, "public/data", "files.json");

  fs.writeFile(destinationPath, jsonContent, (err) => {
    if (err) {
      console.error("Error creating JSON file:", err);
      return;
    }

    console.log("JSON file created successfully.");
  });
});
