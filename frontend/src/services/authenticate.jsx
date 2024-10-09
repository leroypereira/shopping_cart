import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import userpool from '../network/userpool';

export const authenticate=(Email,Password, setIDToken, setAccessToken, setRefreshToken)=>{

    return new Promise((resolve,reject)=>{
        const user=new CognitoUser({
            Username:Email,
            Pool:userpool
        });

        const authDetails= new AuthenticationDetails({
            Username:Email,
            Password
        });

        user.authenticateUser(authDetails,{
            onSuccess:(result)=>{
                console.log("login successful");
                setIDToken(result.getIdToken())
                setAccessToken(result.getAccessToken())
                setRefreshToken(result.getRefreshToken())
                resolve(result);
            },
            onFailure:(err)=>{
                console.log("login failed",err);
                reject(err);
            }
        });
    });
};

export const logout = () => {
    const user = userpool.getCurrentUser();
    user.signOut();
    window.location.href = '/';
};

