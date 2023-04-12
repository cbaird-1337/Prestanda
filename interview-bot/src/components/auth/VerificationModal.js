import React, { useState } from 'react';

const VerificationModal = ({ isOpen, onSubmit, onClose }) => {
  const [code, setCode] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(code);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div>
      <div>
        <h2>Email Verification</h2>
        <div>
          <label htmlFor="code">Verification Code</label>
          <input
            value={code}
            onChange={(event) => setCode(event.target.value)}
          ></input>
        </div>
        <button onClick={handleSubmit}>Verify</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default VerificationModal;
