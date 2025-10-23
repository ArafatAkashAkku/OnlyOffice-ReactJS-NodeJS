import React, { useState } from 'react';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { saveAs } from 'file-saver';

export const Form = () => {
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const generateDocument = async () => {
    try {
      setLoading(true);

      // 1️⃣ Fetch the .docx file (template) from your API
      const fileResponse = await fetch('http://192.168.1.162:5000/api/template'); // <-- your backend endpoint
      const fileArrayBuffer = await fileResponse.arrayBuffer();
      console.log(fileResponse);

      // 2️⃣ Load the binary data into PizZip
      const zip = new PizZip(fileArrayBuffer);

      // 3️⃣ Initialize Docxtemplater with better configuration
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        delimiters: {
          start: '{{',
          end: '}}'
        },
        nullGetter() {
          return "";
        },
      });
      const queryData = `firstName=${firstName}&lastName=${lastName}&email=${email}`;
      // const queryData = `firstName=firstName&Firstname=Firstname&firstname=firstname&FirstName=FirstName&first-name=first-name&First-Name=First-Name&first-Name=first-Name&First-name=First-name`;

      const dataResponse = await fetch(`http://192.168.1.162:5000/api/data?${queryData}`)

      const rawData = await dataResponse.json();
      console.log(rawData);
      
      // Support all naming conventions for each field
      const data = {};
      Object.keys(rawData).forEach(key => {
        const value = rawData[key];
        const lowerKey = key.toLowerCase();
        
        // Add all variations
        data[lowerKey] = value;                           // firstname
        data[key] = value;                                 // firstName (original)
        data[key.charAt(0).toUpperCase() + key.slice(1)] = value;  // FirstName
        data[lowerKey.charAt(0).toUpperCase() + lowerKey.slice(1)] = value; // Firstname
        
        // Add hyphenated versions
        const hyphenated = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        data[hyphenated] = value;                          // first-name
        data[hyphenated.charAt(0).toUpperCase() + hyphenated.slice(1)] = value; // First-name
        data[hyphenated.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-')] = value; // First-Name
        
        // Handle first-Name pattern
        const parts = hyphenated.split('-');
        if (parts.length > 1) {
          data[parts[0] + '-' + parts[1].charAt(0).toUpperCase() + parts[1].slice(1)] = value; // first-Name
        }
        
        // Add underscore versions
        const underscored = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        data[underscored] = value;                         // first_name
        data[underscored.toUpperCase()] = value;           // FIRST_NAME
        data[underscored.charAt(0).toUpperCase() + underscored.slice(1)] = value; // First_name
        data[underscored.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('_')] = value; // First_Name
        
        // Handle first_Name pattern
        const uParts = underscored.split('_');
        if (uParts.length > 1) {
          data[uParts[0] + '_' + uParts[1].charAt(0).toUpperCase() + uParts[1].slice(1)] = value; // first_Name
        }
      });
      
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
