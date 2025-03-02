// import React from 'react';
// import userpool from '../network/aws/userpool';
// import { Navigate } from 'react-router-dom';

// const isLoggedIn = () => {
//   const session = JSON.parse(localStorage.getItem('session'));
//   return session?.accessToken;
// };

// const PrivateRoute = ({ children }) => {
//   const loggedIn = isLoggedIn();
//   if (!loggedIn) {
//     return <Navigate to="/signin" replace />;
//   }

//   return children;
// };

// export default PrivateRoute;

import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { currentSession } from '../network/auth';

const PrivateRoute = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedInAsync = async () => {
      try {
        const session = await currentSession();
        if (session === null) {
          setLoggedIn(false);
          return;
        }

        setLoggedIn(session?.signInUserSession?.isValid());
      } catch (error) {
        console.error(error);
        setLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedInAsync();
  }, []);

  if (isLoading) return <></>;

  if (!loggedIn) {
    // Redirect to the sign-in page if not logged in
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default PrivateRoute;
