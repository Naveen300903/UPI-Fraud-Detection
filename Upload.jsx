// import React, { useState } from "react";
// import axios from "axios";
// import "../styles/Upload.css"; // Import the CSS file

// const Upload = () => {
//   const [csvData, setCsvData] = useState([]);
//   const [showTrainBtn, setShowTrainBtn] = useState(false);

//   // const handleFileChange = (e) => {
//   //   const file = e.target.files[0];
//   //   if (file) {
//   //     const reader = new FileReader();
//   //     reader.onload = (e) => {
//   //       const content = e.target.result;
//   //       // Assuming CSV data has headers in the first row
//   //       const rows = content.split(/\r\n|\n/);
//   //       const headers = rows[0].split(",");
//   //       const data = [];
//   //       for (let i = 1; i < rows.length; i++) {
//   //         const values = rows[i].split(",");
//   //         if (values.length === headers.length) {
//   //           const rowObject = {};
//   //           for (let j = 0; j < headers.length; j++) {
//   //             rowObject[headers[j]] = values[j];
//   //           }
//   //           data.push(rowObject);
//   //         }
//   //       }
//   //       setCsvData(data);
//   //       setShowTrainBtn(true); // Set showTrainBtn to true when data is loaded
//   //     };
//   //     reader.readAsText(file);
//   //   }
//   // };
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const content = e.target.result;
//         // Assuming CSV data has headers in the first row
//         const rows = content.split(/\r\n|\n/);
//         const headers = rows[0].split(",");
//         const data = [];
//         for (let i = 1; i < rows.length; i++) {
//           const values = rows[i].split(",");
//           if (values.length === headers.length) {
//             const rowObject = {};
//             for (let j = 0; j < headers.length; j++) {
//               rowObject[headers[j]] = values[j];
//             }
//             data.push(rowObject);
//           }
//         }
//         setCsvData(data);
//         console.log("csvData==>", csvData);
//         setShowTrainBtn(true); // Set showTrainBtn to true when data is loaded

//         // Send the CSV data to the server for training
//         axios
//           .post("http://localhost:3001/train-model", { csvData: data })
//           .then((response) => {
//             console.log("Training completed:", response.data.message);
//           })
//           .catch((error) => {
//             console.error("Error training the model:", error);
//           });
//       };
//       reader.readAsText(file);
//     }
//   };

//   // const handlePredict=()=>{}
//   const handlePredict = () => {
//     // Define a dummy payload for testing
//     const dummyData = [
//       {
//         feature1: 0.5,
//         feature2: 0.6,
//         feature3: 0.7,
//       },
//       {
//         feature1: 0.2,
//         feature2: 0.3,
//         feature3: 0.4,
//       },
//       // Add more data as needed
//     ];

//     // Send the dummy data to the server for prediction
//     axios
//       .post("http://localhost:3001/train-model", dummyData)
//       .then((response) => {
//         const prediction = response.data.prediction;
//         // Handle the prediction data as needed, e.g., update state or display it
//         console.log("Prediction:", prediction);
//       })
//       .catch((error) => {
//         console.error("Error predicting:", error);
//       });
//   };

//   return (
//     <div className="upload-container">
//       <label className="upload-label">
//         Upload CSV File
//         <input
//           type="file"
//           accept=".csv"
//           onChange={handleFileChange}
//           className="upload-input"
//         />
//       </label>
//       {csvData.length > 0 && (
//         <table className="upload-table">
//           <thead>
//             <tr>
//               {Object.keys(csvData[0]).map((header) => (
//                 <th key={header}>{header}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {csvData.map((row, index) => (
//               <tr key={index}>
//                 {Object.values(row).map((value, idx) => (
//                   <td key={idx}>{value}</td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//       {showTrainBtn && (
//         <button
//           className="train-button"
//           onClick={(data) => handlePredict(data)}
//         >
//           {/* Click to Train */}
//           click
//         </button>
//       )}
//     </div>
//   );
// };

// export default Upload;

import React, { useState } from "react";
import axios from "axios";
import "../styles/Upload.css"; // Import the CSS file

const Upload = () => {
  const [csvData, setCsvData] = useState([]);
  const [showTrainBtn, setShowTrainBtn] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        // Assuming CSV data has headers in the first row
        const rows = content.split(/\r\n|\n/);
        const headers = rows[0].split(",");
        const data = [];
        for (let i = 1; i < rows.length; i++) {
          const values = rows[i].split(",");
          if (values.length === headers.length) {
            const rowObject = {};
            for (let j = 0; j < headers.length; j++) {
              rowObject[headers[j]] = values[j];
            }
            data.push(rowObject);
          }
        }
        setCsvData(data);
        setShowTrainBtn(true); // Set showTrainBtn to true when data is loaded
      };
      reader.readAsText(file);
    }
  };

  const handlePredict = () => {
    if (!selectedFile) {
      console.error("No file selected.");
      return;
    }

    // Send the CSV file as a payload to the server
    const formData = new FormData();
    formData.append("csvFile", selectedFile);

    axios
      .post("http://localhost:3001/train-model", formData)
      .then((response) => {
        console.log("Training completed:", response.data.message);
      })
      .catch((error) => {
        console.error("Error training the model:", error);
      });
  };

  return (
    <div className="upload-container">
      <label className="upload-label">
        Upload CSV File
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="upload-input"
        />
      </label>
      {csvData.length > 0 && (
        <table className="upload-table">
          <thead>
            <tr>
              {Object.keys(csvData[0]).map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {csvData.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, idx) => (
                  <td key={idx}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showTrainBtn && (
        <button className="train-button" onClick={handlePredict}>
          Train Model
        </button>
      )}
    </div>
  );
};

export default Upload;
