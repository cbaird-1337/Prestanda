import React from 'react';
import Protected from '../components/Protected';
 
function AccountPage() {
  return (
    <div className="account-page">
      <h1>Account Page</h1>
    </div>
  );
}

export default Protected(AccountPage);
