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

      // 1️⃣ Fetch the .docx file (template) from your API
      const fileResponse = await fetch('http://192.168.1.157:5000/api/template'); // <-- your backend endpoint
      const fileArrayBuffer = await fileResponse.arrayBuffer();
      console.log(fileResponse);

      // 2️⃣ Load the binary data into PizZip
      const zip = new PizZip(fileArrayBuffer);

      // 3️⃣ Initialize Docxtemplater with better configuration
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
      const queryData = `firstName=${firstName}&lastName=${lastName}&email=${email}`;

      const dataResponse = await fetch(`http://192.168.1.157:5000/api/data?${queryData}`)

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
        alert(`Template Error:\n\n${errorMessages}\n\n⚠️ FIX: Open your Word template and retype each placeholder ({{firstName}}, {{lastName}}, {{email}}) without any formatting changes. Delete the old ones completely and type them fresh.`);
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
