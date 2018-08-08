import React from 'react';

const Profile = (props) => {

  console.log('profile ', props);
  
  return (
    <div>
      <h1>Welcome, {props.userStore.state.name}</h1>
    </div>

  )
}
  ;

export default Profile;
