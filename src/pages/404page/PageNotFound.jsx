import React from 'react';
import './pageNotFound.css';

const PageNotFound = () => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
  return (
    <div className="page-not-found">
      <div className="content">
        <h1>404</h1>
        <h2>Oops! Page Not Found</h2>
        <p>The page you're looking for doesn't exist.</p>
        <button onClick={() => window.location.href = '/'}>Go to Home</button>
      </div>
      <div className="image-container">
        <img src={PF+"404-img.png"} alt="Page not found" />
      </div>
    </div>
  );
};

export default PageNotFound;
