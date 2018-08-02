import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => (
  <div>
    <h1>This is the Landing Page</h1>
    <Link to="/Profile">Profile</Link>
    <br />
    <Link to="/Test">Test</Link>
  </div>
);

export default Landing;
