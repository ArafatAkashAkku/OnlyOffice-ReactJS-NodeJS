const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();

// allow cors
app.use(cors());

app.get('/api/token', (req, res) => {

  const JWT_SECRET = 'onlyoffice'; // must match Document Server

  const payload = {
    document: {
        fileType: 'docx',
        key: 'Khirz6zTPdfd7',
        title: 'Untitled Document.docx',
        url: 'http://farid-staging-yluxk8.flywp.xyz/wp-content/uploads/2025/10/sample.docx',
        permissions: {
          edit: true,
          download: false,
          print: true,
          review: false,
          chat: false,
          comment: false,
          protect: false,
        },
        info: {
          folder: "Downloads",
          owner: "John Doe", 
        },
    },
    editorConfig: {
        mode: 'edit',
        // callbackUrl: "http://192.168.1.157:3000/api/save",
        user: {
          id: "78e1e841",
          name: "Sigmative",
        },
        coEditing: { mode: "strict", change: false },
        customization: {
          chat: false,
          comments: false,
          plugins: true,
          feedback: false,
          help: false,
          autosave: false,
          uiTheme: "theme-light",
          features: {
            saveAs: true,
            open: true,
            fileMenu: false,
          },
          zoom: 90,
        },
        plugins: {
          autostart: ["asc.{insert-data-plugin-guid}"],
          pluginsData: [
            "http://192.168.1.157:3000/plugins/insertdata/config.json"
          ]
        },
    },
  };

  const token = jwt.sign(payload, JWT_SECRET);
  res.json({ token });
});

app.get('/api/template', async (req, res) => {
  try {
    // Remote .docx file URL (from S3, GitHub, etc.)
    const fileUrl = 'http://192.168.1.157:3000/assets/output.docx';

    // Fetch the file from the URL
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    // Convert response to buffer
    const fileBuffer = await response.arrayBuffer();

    // Send the file as response
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    res.setHeader('Content-Disposition', 'attachment; filename=offer-letter.docx');
    res.send(Buffer.from(fileBuffer));
  } catch (err) {
    console.error('Error fetching template:', err);
    res.status(500).json({ error: 'Failed to fetch remote DOCX template' });
  }
});


app.get('/api/data', async (req, res) => {
  try {
    const queryData = {};
    for (const key in req.query) {
      queryData[key] = req.query[key] || "";
    }
    return res.status(200).json(queryData);
  } catch (error) {
    console.error("Error in /api/data:", error);
    return res.status(500).json({ error: "Failed to fetch user data" });
  }
});

app.listen(5000, () => {
  console.log(`Server is running on port http://localhost:5000`);
});