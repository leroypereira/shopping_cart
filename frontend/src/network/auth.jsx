import {
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails
} from 'amazon-cognito-identity-js';
import userpool from './userpool';
import axiosPrivate from './axios_private';

const login = async (email, password) => {
  return await new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: userpool });
    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password
    });

    user.authenticateUser(authDetails, {
      onSuccess: (session) => resolve(session),
      onFailure: (err) => reject(err),
      newPasswordRequired: (data) => reject(new Error('New password required.'))
    });
  });
};

const logout = async () => {
  return await new Promise((resolve, reject) => {
    const user = userpool.getCurrentUser();
    if (user) {
      user.signOut();
      resolve(user);
    } else reject('No user is logged-in currently.');
  });
};

const signup = async ({ email, password, given_name, family_name, role }) => {
  return await new Promise((resolve, reject) => {
    const attributeList = [
      new CognitoUserAttribute({ Name: 'email', Value: email }),
      new CognitoUserAttribute({ Name: 'given_name', Value: given_name }),
      new CognitoUserAttribute({ Name: 'family_name', Value: family_name }),
      new CognitoUserAttribute({ Name: 'profile', Value: role })
    ];

    userpool.signUp(email, password, attributeList, [], (err, result) => {
      if (err) {
        console.error('Error signing up:', err);
        reject('Failed to register a user. Error ', err);
      }
      resolve(result);
    });
  });
};

const changePassword = async (email, password, newPassword) => {
  return await new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: userpool });
    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password
    });

    // Authenticate the user first.
    user.authenticateUser(authDetails, {
      onSuccess: (session) => {
        user.changePassword(password, newPassword, (err, result) => {
          if (err) {
            console.error(`Error changing password: ${err.message || JSON.stringify(err)}`);
            user.signOut();
            reject(err);
          }
          console.log(`Password changed successfully for user ${email}`);
          user.signOut();
          resolve(result);
        });
      },
      onFailure: (err) => {
        console.error(`Error authenticating user: ${err.message || JSON.stringify(err)}`);
        reject(err);
      }
    });
  });
};

// This goes via Lambda as the lambda updates the requested user.
const updateUser = async (userId, attributes) => {
  if (userId === undefined) return;

  const data = attributes;
  return axiosPrivate.patch(`/v1/users/${userId}`, { ...data });
};

// This goes via Lambda as the lambda deletes the requested user.
const deleteUser = async (userId) => {
  if (userId === undefined) return;

  return axiosPrivate.delete(`/v1/users/${userId}`);
};

const currentSession = async () => {
  return await new Promise((resolve, reject) => {
    let cognitoUser = userpool.getCurrentUser();
    if (!cognitoUser) resolve(null);

    // See if session is valid before resolving the promise.
    cognitoUser.getSession((error, session) => {
      if (error) reject(error);

      if (session) resolve(cognitoUser);
      return reject('Unexpected error while getting current session.');
    });
  });
};

const currentUser = async () => {
  return await new Promise((resolve, reject) => {
    let cognitoUser = userpool.getCurrentUser();
    if (!cognitoUser) reject('No user logged-in.');

    // See if session is valid.
    cognitoUser.getSession((error, session) => {
      if (error) reject(error);
      // Return only the user attributes.
      cognitoUser.getUserAttributes((err, attributes) => {
        if (err) reject('Error fetching user attributes:', err);

        const user = attributes.reduce((acc, curr) => {
          acc[curr.Name] = curr.Value;
          return acc;
        }, {});
        resolve(user);
      });
    });
  });
};

export {
  login,
  logout,
  signup,
  deleteUser,
  updateUser,
  changePassword,
  currentSession,
  currentUser
};
