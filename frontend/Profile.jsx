import React from 'react';

const Profile = (props) => (
    <div>
      <h1>Welcome, {props.userStore.name}</h1>
    </div>
  )
;

export default Profile;
