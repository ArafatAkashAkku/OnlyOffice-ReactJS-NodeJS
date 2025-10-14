import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useSearchParams } from "react-router-dom";
import { DocumentEditor } from "@onlyoffice/document-editor-react";
import { Form } from "./Form";
import "./App.css";

function EditorPage() {
  const [token, setToken] = useState("");
  const [searchParams] = useSearchParams();
  // Store query parameters in sessionStorage for the plugin to access
  useEffect(() => {
    const queryParams = {};
    for (let [key, value] of searchParams.entries()) {
      queryParams[key] = value;
    }
    sessionStorage.setItem('editorQueryParams', JSON.stringify(queryParams));
    console.log('Stored query params:', queryParams);
  }, [searchParams]);

  useEffect(() => {
    fetch(`http://192.168.1.157:5000/api/token`) // api server
      .then(res => res.json())
      .then(data => setToken(data.token))
      .catch(err => console.log(err));
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      <DocumentEditor
        id="docxEditor"
        documentServerUrl="http://192.168.1.157:8082/"

        config={{
          token, // added later
          documentType: 'word',
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
                `http://192.168.1.157:3000/plugins/insertdata/config.json`
              ]
            },
          },
        }}
        events_onDocumentReady={() => console.log("Document ready")}
        onLoadComponentError={(code, desc) => console.log(code, desc)}
      />
    </div>
  );
}

function HomePage() {
  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <h1>Document Management System</h1>
      <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
        <Link to="/editor?firstName=&lastName=&email=" style={{
          padding: "12px 24px",
          backgroundColor: "#0066cc",
          color: "white",
          textDecoration: "none",
          borderRadius: "6px",
          fontWeight: "500"
        }}>
          Go to Editor
        </Link>
        <Link to="/form" style={{
          padding: "12px 24px",
          backgroundColor: "#00aa55",
          color: "white",
          textDecoration: "none",
          borderRadius: "6px",
          fontWeight: "500"
        }}>
          Go to Form
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <nav style={{
        backgroundColor: "#f5f5f5",
        padding: "1rem",
        borderBottom: "1px solid #ddd"
      }}>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Link to="/" style={{ textDecoration: "none", fontWeight: "600", color: "#333" }}>
            Home
          </Link>
          <Link to="/editor" style={{ textDecoration: "none", color: "#0066cc" }}>
            Editor
          </Link>
          <Link to="/form" style={{ textDecoration: "none", color: "#00aa55" }}>
            Form
          </Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/form" element={<Form />} />
      </Routes>
    </Router>
  );
}