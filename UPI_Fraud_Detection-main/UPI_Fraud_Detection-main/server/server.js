const express = require("express");
const cors = require("cors");
const multer = require("multer");
const bodyParser = require("body-parser");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "60mb" }));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/train-model", upload.single("csvFile"), (req, res) => {
  console.log("file==>", req.file);

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  try {
    const tempFilePath = path.join(__dirname, "temp", `${Date.now()}.csv`);
    fs.writeFileSync(tempFilePath, req.file.buffer);

    const pythonProcess = spawn("python", ["fraud_detection.py", tempFilePath]);

    pythonProcess.stdout.on("data", (data) => {
      const message = data.toString();
      res.json({ message }); // Send the message from the Python script as a response
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(data.toString());
      res
        .status(500)
        .json({ error: "An error occurred while training the model." });
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the request." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
