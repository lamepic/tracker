import React from "react";
import "./LoginForm.css";

import axios from "../../utility/axios";
import { useStateValue } from "../../store/StateProvider";
import * as actionTypes from "../../store/actionTypes";

import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";

// import { showNotification } from "../../utility/utility";

function LoginForm({ verifiedEmail }) {
  const [{}, dispatch] = useStateValue();

  return (
    <Formik
      initialValues={{ loginToken: "" }}
      validationSchema={Yup.object({
        loginToken: Yup.string().required("Token is required").length(6).trim(),
      })}
      onSubmit={(values, options) => {
        const body = JSON.stringify({
          email: verifiedEmail,
          token: values.loginToken,
        });
        axios
          .post("/auth/token/", body)
          .then((res) => {
            dispatch({
              type: actionTypes.LOGIN_SUCCESS,
              payload: res.data,
            });
          })
          .catch((error) => {
            dispatch({
              type: actionTypes.LOGIN_FAIL,
            });
            // showNotification("Error", "Incorrect Token", "danger");
          });
        options.setSubmitting(false);
      }}
    >
      <Form className="form">
        <Field
          name="loginToken"
          type="text"
          placeholder="Enter Verification token"
          className="verificationInput"
        />
        <ErrorMessage
          name="loginToken"
          component="small"
          className="error__label"
        />
        <button type="submit" className="btn login__btn">
          Login
        </button>
      </Form>
    </Formik>
  );
}

export default LoginForm;
