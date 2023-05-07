import React from 'react';
import './loader.css';

const Luminaire = () => {
  const handleLuminaireClick = (event) => {
    event.target.classList.toggle('lum-on');
  };

  return (
    <div className="lum-loader-container">
      <div className="lum-loader" onClick={handleLuminaireClick}>
        <div className="lum-luminaire lum-on" onClick={handleLuminaireClick}></div>
        <div className="lum-luminaire" onClick={handleLuminaireClick}></div>
        <div className="lum-luminaire" onClick={handleLuminaireClick}></div>
      </div>
    </div>
  );
};

export default Luminaire;
