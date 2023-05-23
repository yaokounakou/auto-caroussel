const fs = require("fs");
const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const port = 3000;

function getFileType(filename) {
  const extension = filename.split(".").pop().toLowerCase();

  if (extension === "jpg" || extension === "jpeg" || extension === "png") {
    return "image";
  } else if (extension === "mp4" || extension === "mov") {
    return "video";
  }

  return "unknown";
}

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/folder-content", (req, res) => {
  const folderPath = path.join(__dirname, "public", "medias");

  try {
    const files = fs.readdirSync(folderPath);

    const content = files.map((file) => {
      const filePath = `/medias/${file}`;
      const fileType = getFileType(file);

      return {
        type: fileType,
        url: filePath,
      };
    });

    res.json(content);
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running: http://localhost:${port}\n`);
});
