import React from "react";
import Upload from "./Upload";
import "../styles/Home.css"; // Import the CSS file

const Home = () => {
  return (
    <div className="home-container">
      <div className="heading">
        <h1>UPI Fraud Detection</h1>
      </div>
      <div className="content">
        <img
          src="https://entrackr.com/storage/2020/01/upi-payments.jpg"
          alt="UPI Payments"
          className="content-image"
        />
      </div>
      <Upload />
    </div>
  );
};

export default Home;
