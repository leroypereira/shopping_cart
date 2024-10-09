import React, { useEffect, useState } from 'react'
import { Button, TextField,Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { login } from '../../network/auth';

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signin = () => {
  const Navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [loginErr, setLoginErr] = useState("");

  useEffect(()=>{
    if(loginErr)
        toast.error(loginErr);
  },[loginErr])

  const validation = () => {
    return new Promise((resolve, reject) => {
      if (email === "" && password === "") {
        toast.error("Email and Password missing");
        setEmailErr("Email is Required");
        setPasswordErr("Password is required");
        reject({
          email: "Email is Required",
          password: "Password is required",
        });
      } else if (email === "") {
        setEmailErr("Email is Required");
        toast.error("Password missing");

        reject({ email: "Email is Required", password: "" });
      } else if (password === "") {
        setPasswordErr("Password is required");
        toast.error("Password missing");
        reject({ email: "", password: "Password is required" });
      } else if (password.length < 6) {
        setPasswordErr("must be 6 character");
        toast.error("Password must be greater than 6 characters");
        reject({ email: "", password: "must be 6 character" });
      } else {
        resolve({ email: "", password: "" });
      }
    });
  };

  const handleClick = () => {
    setEmailErr("");
    setPasswordErr("");
    validation()
      .then(
        (res) => {
            login(email, password)
              .then((data) => {
                setLoginErr("");
                Navigate("/dashboard");
              })
              .catch((err) => setLoginErr(err.message));
        },
      )
      .catch((err) => {
        setLoginErr(err.message);
      })
  };

  return (
    <div className="login">
      <div className="form">
        <div className="formfield">
          <TextField
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email"
            helperText={emailErr}
          />
        </div>
        <div className="formfield">
          <TextField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            label="Password"
            helperText={passwordErr}
          />
        </div>
        <div className="formfield">
          <Button type="submit" variant="contained" onClick={handleClick}>
            Login
          </Button>
        </div>
        <Typography variant="body">{loginErr}</Typography>
      </div>
    </div>
  );
};

export default Signin