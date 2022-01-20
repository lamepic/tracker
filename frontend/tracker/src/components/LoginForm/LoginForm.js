import React from "react";
import "./LoginForm.css";

import { useStateValue } from "../../store/StateProvider";
import * as actionTypes from "../../store/actionTypes";

import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";

import { login } from "../../http/auth";
import { showNotification } from "../../utility/helper";

function LoginForm({ verifiedEmail }) {
  const [_, dispatch] = useStateValue();

  const loginUser = async (email, token) => {
    try {
      const res = await login(email, token);
      dispatch({
        type: actionTypes.LOGIN_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: actionTypes.LOGIN_FAIL,
      });
      showNotification("Error", "Incorrect Token", "danger");
    }
  };

  return (
    <Formik
      initialValues={{ loginToken: "" }}
      validationSchema={Yup.object({
        loginToken: Yup.string().required("Token is required").length(6).trim(),
      })}
      onSubmit={async (values, options) => {
        await loginUser(verifiedEmail, values.loginToken);
        // options.setSubmitting(false);
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
