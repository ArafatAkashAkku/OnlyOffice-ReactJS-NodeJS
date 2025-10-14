# OnlyOffice Document Editor - React Integration

A complete implementation of OnlyOffice Document Editor integrated with React, featuring JWT-based authentication, real-time document editing, and secure document server communication.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [OnlyOffice Document Server Setup (Docker)](#onlyoffice-document-server-setup-docker)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Component Documentation](#component-documentation)
- [Troubleshooting](#troubleshooting)
- [Additional Resources](#additional-resources)

## Overview

This application provides a seamless integration of OnlyOffice Document Server with React, allowing users to view and edit documents (DOCX, XLSX, PPTX) directly in the browser with JWT-based security.

## Features

- **Real-time Document Editing** - Edit DOCX files in the browser
- **JWT Authentication** - Secure token-based authentication
- **Customizable UI** - Configurable editor theme and features
- **Document Permissions** - Granular control over edit, download, print, review, chat, and comments
- **Co-editing Support** - Strict mode collaborative editing
- **Lightweight Integration** - Simple React component integration

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.x or higher)
- **npm** (v9.x or higher)

## Installation

### 1. Create a new React project named onlyoffice-react using the Create React App package:

```bash
npx create-react-app onlyoffice-react
cd onlyoffice-react
```

### 2. Install ONLYOFFICE Docs React component from npm:

```bash
npm install @onlyoffice/document-editor-react
```

## OnlyOffice Document Server Setup (Docker)

### Quick Setup with Docker Run

#### Step 1: Pull the OnlyOffice Document Server Image

```bash
docker pull onlyoffice/documentserver:latest
```

#### Step 2: Run OnlyOffice Document Server for Development

**Basic Setup (No JWT):**

```bash
docker run -it -d -p 8080:80 -e JWT_ENABLED=false -e JWT_SECRET=your_jwt_secret onlyoffice/documentserver

```

**Production Setup (With JWT Security):**

```bash
docker run -it -d -p 8080:80 -e JWT_ENABLED=true -e JWT_SECRET=your_jwt_secret onlyoffice/documentserver

```

#### Step 3: Verify OnlyOffice is Running

Open your browser and navigate to:
```
http://localhost:8080
```

You should see the OnlyOffice welcome page.

## Configuration

### Update Document Server URL

In `src/App.js`, update the code:

```javascript
import { useState, useEffect } from "react";
import { DocumentEditor } from "@onlyoffice/document-editor-react";

export default function App() {
  const [token, setToken] = useState("");

  useEffect(() => {
    fetch(`http://example.com/api/token`) // api server
      .then(res => res.json())
      .then(data => setToken(data.token))
      .catch(err => console.error(err));
  }, []);
  
  return (
    <DocumentEditor
      id="docxEditor"
      documentServerUrl="http://documentserver/"
      config={{
        token,
        documentType: "word",
        document: {
          fileType: "docx",
          key: "RandomKey",
          title: "Example Document Title.docx",
          url: "https://example.com/url-to-example-document.docx",
        },
        editorConfig: {
          callbackUrl: "https://example.com/url-to-callback.ashx",
        },
      }}
      events_onDocumentReady={() => console.log("Document ready")}
      onLoadComponentError={(code, desc) => console.error(code, desc)}
    />
  )
}
```

**Important:** The document URL must be accessible from the OnlyOffice Document Server container. Replace the documentServerUrl in src/App.js as per your docker server url
```bash
documentServerUrl= http://localhost:8080/
```

## Running the Application

### Development Mode

```bash
npm start
```

The application will start on `http://localhost:3000`

### Access the Document Editor

Navigate to:
```
http://localhost:3000/
```

## API Documentation

### GET `/api/token`

Generates a JWT token for OnlyOffice Document Server authentication.

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```


### Create a server (Example: Express Server)

Ensure the JWT secret matches in both docker and server api:


```javascript
const express = require('express'); 
const jwt = require('jsonwebtoken'); 
const cors = require('cors');
const app = express(); 

app.use(cors()); // allow cors

app.get('/api/token', (req, res) => { 
  const JWT_SECRET = 'your_secret_key'; // must match Document Server

  const payload = {
    document: {
      fileType: "docx",
      key: "RandomKey",
      title: "Example Document Title.docx",
      url: "https://example.com/url-to-example-document.docx",
    },
    editorConfig: {
      callbackUrl: "https://example.com/url-to-callback.ashx",
    },
  }

  const token = jwt.sign(payload, JWT_SECRET);

  res.json({ token });

});

app.listen(5000, () => {
    console.log(`Server is running on port http://localhost:5000`);
});
```

This is your customized API for token:

```
http://localhost:5000/api/token
```

## Component Documentation

### DocumentEditor Component

Located in `src/App.js`

**Props:**
- `id` - Unique identifier for the editor instance
- `documentServerUrl` - URL to your OnlyOffice Document Server
- `config` - Configuration object containing token and document settings
- `events_onDocumentReady` - Callback when document is loaded
- `onLoadComponentError` - Error handler callback

**Configuration Options:**
More options are added that can be useful for customizations

| Option | Type | Description |
|--------|------|-------------|
| `token` | string | JWT authentication token |
| `documentType` | string | Document type ('word', 'cell', 'slide') |
| `document.fileType` | string | File extension ('docx', 'xlsx', 'pptx') |
| `document.key` | string | Unique document identifier (must change when document changes) |
| `document.url` | string | Public URL to the document |
| `document.title` | string | Display title for the document |
| `document.permissions` | object | Granular permission controls |
| `document.permissions.edit` | boolean | Allow editing the document |
| `document.permissions.download` | boolean | Allow downloading the document |
| `document.permissions.print` | boolean | Allow printing the document |
| `document.permissions.review` | boolean | Allow reviewing/tracking changes |
| `document.permissions.chat` | boolean | Enable chat functionality |
| `document.permissions.comment` | boolean | Allow adding comments |
| `document.permissions.protect` | boolean | Allow protecting document sections |
| `document.info` | object | Additional document metadata |
| `document.info.folder` | string | Folder location of the document |
| `document.info.owner` | string | Document owner name |
| `editorConfig.mode` | string | Editor mode ('edit' or 'view') |
| `editorConfig.callbackUrl` | string | URL for document saving callbacks |
| `editorConfig.user` | object | User information |
| `editorConfig.user.id` | string | Unique user identifier |
| `editorConfig.user.name` | string | User display name |
| `editorConfig.coEditing` | object | Co-editing configuration |
| `editorConfig.coEditing.mode` | string | Co-editing mode ('strict' or 'fast') |
| `editorConfig.coEditing.change` | boolean | Track changes in co-editing |
| `editorConfig.customization.uiTheme` | string | UI theme ('theme-light', 'theme-dark') |
| `editorConfig.customization.chat` | boolean | Enable/disable chat interface |
| `editorConfig.customization.comments` | boolean | Enable/disable comments interface |
| `editorConfig.customization.plugins` | boolean | Enable/disable plugins |
| `editorConfig.customization.feedback` | boolean | Enable/disable feedback option |
| `editorConfig.customization.help` | boolean | Enable/disable help menu |
| `editorConfig.customization.autosave` | boolean | Enable/disable autosave functionality |
| `editorConfig.customization.zoom` | number | Default zoom level (e.g., 90 for 90%) |
| `editorConfig.customization.features` | object | Feature toggles for UI elements |
| `editorConfig.customization.features.saveAs` | boolean | Enable/disable 'Save As' option |
| `editorConfig.customization.features.open` | boolean | Enable/disable 'Open' option |
| `editorConfig.customization.features.fileMenu` | boolean | Enable/disable file menu |




## Advance Integration (Docx)

Install Angular-Expressions Docstemplater File-Saver Pizzip on Frontend
```
npm install angular-expressions docxtemplater file-saver pizzip 
```

### angular-expressions

A small library to evaluate expressions in templates, like {{firstName}} or {{age + 1}}.
Used with docxtemplater to dynamically calculate or replace values in a DOCX template.

### docxtemplater

A library to generate Word (.docx) documents from templates.
It reads a DOCX file with placeholders (e.g., {{name}}) and fills them with data programmatically.

### file-saver

A library to save files directly from the browser.
Used to let users download generated DOCX files after filling them with data.

### pizzip

Handles reading and writing ZIP files (DOCX files are ZIP under the hood), enabling docxtemplater to modify templates.

### New Integration Step by Step on Frontend
Located in `public/`

Create `public/plugins/insertdata`

Create `public/plugins/insertdata/config.json`

Create `public/plugins/insertdata/index.html`

Create `public/plugins/insertdata/resources`

Now in the `public/plugins/insertdata/config.json` file 
```
{
  "name": "Insert Data",
  "nameLocale": {
    "en": "Insert Data"
  },
  "guid": "asc.{insert-data-plugin-guid}",
  "version": "1.0.0",
  "variations": [
    {
      "description": "Insert data fields into document",
      "descriptionLocale": {
        "en": "Insert data fields into document"
      },
      "url": "index.html",
      "icons": ["resources/icon.svg", "resources/icon.svg"],
      "icons2": [
        {
          "style": "light",
          "100%": { "normal": "resources/icon.svg" },
          "125%": { "normal": "resources/icon.svg" },
          "150%": { "normal": "resources/icon.svg" },
          "175%": { "normal": "resources/icon.svg" },
          "200%": { "normal": "resources/icon.svg" }
        },
        {
          "style": "dark",
          "100%": { "normal": "resources/icon.svg" },
          "125%": { "normal": "resources/icon.svg" },
          "150%": { "normal": "resources/icon.svg" },
          "175%": { "normal": "resources/icon.svg" },
          "200%": { "normal": "resources/icon.svg" }
        }
      ],
      "isViewer": false,
      "EditorsSupport": ["word"],
      "isVisual": true,
      "isModal": false,
      "isInsideMode": true,
      "initDataType": "none",
      "initData": "",
      "isUpdateOleOnResize": false,
      "buttons": []
    }
  ]
}
```


Now in the `public/plugins/insertdata/index.html`

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Insert Data Plugin</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            padding: 16px;
            background: #fff;
            color: #333;
            font-size: 13px;
        }
        
        h3 {
            margin-bottom: 16px;
            font-size: 16px;
            font-weight: 600;
            color: #444;
        }
        
        .loading {
            text-align: center;
            padding: 20px;
            color: #666;
        }
        
        .error {
            padding: 12px;
            background: #fee;
            border: 1px solid #fcc;
            border-radius: 4px;
            color: #c33;
            margin-bottom: 12px;
        }
        
        .data-container {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        
        .data-item {
            display: flex;
            align-items: center;
            padding: 10px 12px;
            background: #f8f9fa;
            border: 1px solid #e1e4e8;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .data-item:hover {
            background: #e8f4ff;
            border-color: #0969da;
            transform: translateX(2px);
        }
        
        .data-item:active {
            transform: translateX(1px);
            background: #d0e8ff;
        }
        
        .data-label {
            font-weight: 500;
            color: #666;
            min-width: 90px;
            margin-right: 8px;
        }
        
        .data-value {
            color: #0969da;
            font-weight: 500;
            flex: 1;
        }
        
        .insert-icon {
            margin-left: auto;
            opacity: 0.6;
            font-size: 16px;
        }
        
        .data-item:hover .insert-icon {
            opacity: 1;
        }

    </style>
    <script src="https://onlyoffice.github.io/sdkjs-plugins/v1/plugins.js"></script>
</head>
<body>
    <h3>Insert Data Fields</h3>
    <div id="content">
        <div class="loading">Loading data...</div>
    </div>

    <script>
        (function(window, undefined) {
            let userData = null;

            // Initialize plugin
            window.Asc.plugin.init = function() {
                console.log('Plugin initialized');
                loadUserData();
            };

            // Fetch user data from API
            async function loadUserData() {
                const contentDiv = document.getElementById('content');
                try {
                    const response = await fetch('http://localhost:5000/api/data'); // api url
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    userData = await response.json();
                    console.log('User data loaded:', userData);
                    renderData();
                } catch (error) {
                    console.error('Error loading data:', error);
                    contentDiv.innerHTML = '<div class="error">Failed to load data. Please try again.</div>';
                }
            }

            // Render data items
            function renderData() {
                const contentDiv = document.getElementById('content');
                if (!userData) {
                    contentDiv.innerHTML = '<div class="error">No data available</div>';
                    return;
                }

                const container = document.createElement('div');
                container.className = 'data-container';

                // Create clickable items for each field
                for (const [key, value] of Object.entries(userData)) {
                    const item = document.createElement('div');
                    item.className = 'data-item';
                    
                    // Determine what to insert based on value
                    const isNull = value === null || value === undefined || value === '';
                    const textToInsert = isNull ? `{{${key}}}` : value;
                    
                    item.onclick = () => insertText(textToInsert);
                    
                    const label = document.createElement('span');
                    label.className = 'data-label';
                    label.textContent = formatLabel(key) + ':';
                    
                    const valueSpan = document.createElement('span');
                    valueSpan.className = 'data-value';
                    valueSpan.textContent = isNull ? `{{${key}}}` : value;
                    valueSpan.style.color = isNull ? '#999' : '#0969da';
                    valueSpan.style.fontStyle = isNull ? 'italic' : 'normal';
                    
                    const icon = document.createElement('span');
                    icon.className = 'insert-icon';
                    icon.textContent = '→';
                    
                    item.appendChild(label);
                    item.appendChild(valueSpan);
                    item.appendChild(icon);
                    container.appendChild(item);
                }

                contentDiv.innerHTML = '';
                contentDiv.appendChild(container);
                
                // Replace placeholders with actual values for non-null fields
                replacePlaceholders();
            }

            // Format field names for display
            function formatLabel(key) {
                return key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, str => str.toUpperCase())
                    .trim();
            }

            // Insert text at cursor position
            function insertText(text) {
                console.log('Inserting text:', text);
                
                // Use the OnlyOffice plugin API to insert text at cursor
                window.Asc.plugin.executeMethod('PasteText', [text]);
                
                // Optional: Show feedback
                console.log('Text inserted successfully');
            }

            // Replace placeholders in the document with actual values
            function replacePlaceholders() {
                if (!userData) return;
                
                console.log('Replacing placeholders with actual values...');
                
                // For each field in userData that has a non-null value
                for (const [key, value] of Object.entries(userData)) {
                    if (value !== null && value !== undefined) {
                        const placeholder = `{{${key}}}`;
                        console.log(`Searching for placeholder: ${placeholder}`);
                        
                        // Use Search and Replace API
                        window.Asc.plugin.executeMethod('SearchAndReplace', [
                            {
                                searchString: placeholder,
                                replaceString: String(value),
                                matchCase: true
                            }
                        ]);
                    }
                }
                
                console.log('Placeholder replacement complete');
            }

            // Plugin button handler (if needed)
            window.Asc.plugin.button = function(id) {
                this.executeCommand('close', '');
            };

        })(window, undefined);
    </script>
</body>
</html>
```

Note: Add a `icon.svg` file into the `public/plugins/insertdata/resources/`


Create a new page `src/Form.js`

```
import React, { useState } from 'react';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { saveAs } from 'file-saver';
import expressionParser from 'docxtemplater/expressions';

export const Form = () => {
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const generateDocument = async () => {
    try {
      setLoading(true);

      // Fetch the .docx file (template) from your API
      const fileResponse = await fetch('http://localhost:5000/api/template'); // <-- your backend endpoint
      const fileArrayBuffer = await fileResponse.arrayBuffer();
      console.log(fileResponse);

      // Load the binary data into PizZip
      const zip = new PizZip(fileArrayBuffer);

      // Initialize Docxtemplater with better configuration
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        parser: expressionParser,
        delimiters: {
          start: '{{',
          end: '}}'
        },
        nullGetter() {
          return "";
        },
      });

      const dataResponse = await fetch(`http://lcalhost:5000/api/data?firstName=${firstName}&lastName=${lastName}&email=${email}`)

      const data = await dataResponse.json();
      console.log(data);
      
      doc.render(data);
      console.log(doc);
      
      const out = doc.getZip().generate({
        type: 'blob',
        mimeType:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

      saveAs(out, `${Date.now() || 'output'}.docx`);
      alert('Document generated successfully!');
    } catch (error) {
      console.error('Error generating document:', error);
      
      // Better error handling
      if (error.properties && error.properties.errors instanceof Array) {
        const errorMessages = error.properties.errors
          .map(err => `${err.properties.explanation} (in ${err.properties.file})`)
          .join('\n');
        alert(`Template Error:\n\n${errorMessages}\n\n FIX: Open your Word template and retype each placeholder ({{firstName}}, {{lastName}}, {{email}}) without any formatting changes. Delete the old ones completely and type them fresh.`);
      } else {
        alert(`Error: ${error.message || 'Failed to generate document'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1>Generate .docx from API</h1>
      <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
      <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button
        onClick={generateDocument}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        {loading ? 'Generating...' : 'Generate Document'}
      </button>
      <p>Template and data both come from API endpoints.</p>
    </div>
  );
};


```


### Add two more API in server (Example: Express Server)

```
app.get('/api/template', async (req, res) => {
  try {
    // doc link
    const fileUrl = 'http://localhost:3000/assets/template.docx'; // file live link

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
    // dynamic query from the frontend for both admin/user
    for (const key in req.query) {
      queryData[key] = req.query[key] || "";
    }
    return res.status(200).json(queryData);
  } catch (error) {
    console.log("Error in /api/data:", error);
    return res.status(500).json({ error: "Failed to fetch user data" });
  }
});

```

Important: In docx if you add {{firstName}}, {{lastName}}, {{email}} Then it will auto convert from dynamically add from the Frontend `From.js`

### Note: You can use the above steps to download docx including dynamic content

## Troubleshooting

### Common Issues

#### 1. Document Server not accessible

**Error:** "Cannot connect to Document Server"

**Solution:**
- Check if Docker container is running: `docker ps`
- Verify the port mapping: `docker port <CONTAINER_ID>`
- Ensure firewall allows port 8080
- Check the `documentServerUrl` in your component

#### 2. JWT Token Validation Failed

**Error:** "Error: JWT token validation failed"

**Solution:**
- Ensure `JWT_SECRET` matches in both API and Docker container
- Verify JWT is enabled in Docker: `-e JWT_ENABLED=true`
- Check that `JWT_SECRET=your_secret_key` is set in Docker environment

#### 3. Document URL not accessible

**Error:** "Error: Document URL is not accessible"

**Solution:**
- Document URL must be publicly accessible
- Ensure CORS is properly configured on your file server
- Check network connectivity from Docker container to document URL

#### 4. Component not rendering

**Error:** Blank screen or loading infinitely

**Solution:**
- Check browser console for errors
- Verify React version compatibility (19.1.0)
- Ensure token is being fetched successfully
- Check OnlyOffice Document Server logs: `docker logs <CONTAINER_ID>`


### Debug Mode

Enable detailed logging:

```javascript
// In src/App.js
console.log("Token:", token);
console.log("Document Server URL:", documentServerUrl);
```

### Check Docker Container Health

```bash
# Check container status
docker inspect onlyoffice/documentserver
```

## Additional Resources

- [OnlyOffice API Documentation](https://api.onlyoffice.com/editors/basic)
- [OnlyOffice React Integration](https://www.npmjs.com/package/@onlyoffice/document-editor-react)
- [JWT.io - JWT Debugger](https://jwt.io/)
- [Docker Documentation](https://docs.docker.com/)

## Key Points

- JWT Secret: Must match between application and Document Server
- Document Key: Must be unique and change when document content changes
- Document URL: Must be publicly accessible from Document Server container
- Network: Ensure Document Server can reach your application API
- CORS: Configure proper CORS headers if using external document URLs

---

## Document History

** Document Version:** 1.0.0

** Last Updated:** October 14, 2025   