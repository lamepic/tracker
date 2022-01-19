import React from "react";
import "./LoginForm.css";

import axios from "../../utility/axios";
// import { showNotification } from "../../utility/utility";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

function VerificationForm({
  setSentVerificationToken,
  setVerifiedEmail,
  setLoading,
}) {
  return (
    <Formik
      initialValues={{ id: "" }}
      validationSchema={Yup.object({
        id: Yup.string().trim().required("Staff ID is required"),
      })}
      onSubmit={async (values, options) => {
        setLoading(true);
        setSentVerificationToken(false);
        await axios
          .post("/api/auth/login/", {
            employee_id: values.id,
          })
          .then((res) => {
            setSentVerificationToken(true);
            setVerifiedEmail(res.data.email);
            setLoading(false);
          })
          .catch((err) => {
            // show erorr in form
            // showNotification("Error", "Invalid Staff ID", "danger");
            setLoading(false);
            setSentVerificationToken(false);
          });
        options.resetForm({ values: "" });
        options.setSubmitting(false);
      }}
    >
      <Form className="form">
        <Field
          name="id"
          type="text"
          placeholder="Enter Staff ID"
          className="verificationInput"
        />
        <ErrorMessage name="email" component="small" className="error__label" />
        <button type="submit" className="btn verification__btn">
          Get Verification Code
        </button>
      </Form>
    </Formik>
  );
}

export default VerificationForm;
