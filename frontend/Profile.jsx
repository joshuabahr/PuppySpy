import React from 'react';

const Profile = ({ userStore }) => (
    <div>
      <h1>Welcome, {userStore.name}</h1>
    </div>
  )
;

export default Profile;
