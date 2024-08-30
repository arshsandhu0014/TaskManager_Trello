import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const GoogleAuth = () => {
  const clientId = '493906680508-07evjgesmlano1r3rsnb4sac6bgfgk6g.apps.googleusercontent.com'; 
  const handleSuccess = async (response) => {
    try {
      const res = await axios.post('http://localhost:3000/auth/google', {
        id_token: response.credential
      });
      // Handle successful response (e.g., store token, redirect)
      console.log('Google auth successful:', res.data);
      localStorage.setItem('token', res.data.token);
      // Redirect or update state as needed
    } catch (error) {
      console.error('Google authentication error:', error);
    }
  };

  return (
    <GoogleLogin
      clientId={clientId}
      onSuccess={handleSuccess}
      onFailure={(error) => {
        console.error('Google login error:', error);
      }}
    />
  );
};

export default GoogleAuth;
