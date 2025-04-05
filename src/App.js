import React, { useState, useEffect } from "react";
import axios from "axios";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup"; // formik yup for validation
import { Animation } from "./components/backgroundAnimation/Animation"; // Import the Animation component
import "./App.css";
import data from "./data.json"; // Import data from data.json

// Validation schema with Yup
const validationSchema = Yup.object({
  first_name: Yup.string()
    .required("First Name is required")
    .max(50, "First Name cannot be longer than 50 characters"),
  last_name: Yup.string()
    .required("Last Name is required")
    .max(50, "Last Name cannot be longer than 50 characters"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required")
    .max(100, "Email cannot be longer than 100 characters"),
  message: Yup.string().required("Message is required"),
  // Make the checkbox field required
  newsletter_signup: Yup.boolean().oneOf([true], "This is a required field"),
});

function App() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Load form data from JSON (directly from imported data.json)
  useEffect(() => {
    try {
      setForm(data); // Directly use the data from the imported JSON
      setLoading(false);
    } catch (error) {
      console.error("Error loading form data", error);
      setLoading(false);
    }
  }, []);

  const handleSubmit = (values) => {
    console.log("Form Submitted with data: ", values);

    axios
      .post("https://jsonplaceholder.typicode.com/posts", values)
      .then((response) => {
        console.log("Form submitted successfully: ", response);
        setFormSubmitted(true);
      })
      .catch((error) => {
        console.error("Error submitting form: ", error);
      });
  };

  const handleReset = () => {
    setFormSubmitted(false);
  };

  const goToNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 2));
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  if (loading) {
    return <div className="text-center">Loading form...</div>;
  }

  // Split the form fields into two parts: Step 1 and Step 2
  const step1Inputs = form?.inputs.slice(0, 3);
  const step2Inputs = form?.inputs.slice(3);

  return (
    <div>
      <Animation /> {/* Add the Animation component here */}
      {formSubmitted && (
        <div className="bg-green-500 text-white p-4 text-center rounded-lg mb-4">
          <h3>Thank you! Your message has been submitted successfully.</h3>
        </div>
      )}
      {/* Formik Form */}
      <Formik
        initialValues={{
          first_name: "",
          last_name: "",
          email: "",
          message: "",
          newsletter_signup: false,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className=" p-6 sm:p-8 max-w-md md:max-w-2xl mx-auto rounded-lg shadow-2xl relative z-10 mt-40">
          <h2 className="text-4xl font-semibold text-center text-white mb-6">
            {form?.form_name}
          </h2>
          {/* Step 1 */}
          {currentStep === 1 &&
            step1Inputs.map((input, index) => (
              <div key={input.input_name || index} className="mb-4">
                <label className="block text-white font-medium mb-2">
                  {input.label}
                </label>
                <Field
                  name={input.input_name}
                  type={input.input_type}
                  placeholder={input.placeholder}
                  maxLength={input.max_length}
                  rows={input.rows}
                  cols={input.cols}
                  className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                />
                <ErrorMessage
                  name={input.input_name}
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            ))}

          {/* Step 2 */}
          {currentStep === 2 &&
            step2Inputs.map((input, index) => (
              <div key={input.input_name || index} className="mb-4">
                <label className="block text-white font-medium mb-2">
                  {input.label}
                </label>
                <Field
                  name={input.input_name}
                  type={input.input_type}
                  placeholder={input.placeholder}
                  maxLength={input.max_length}
                  rows={input.rows}
                  cols={input.cols}
                  className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                />
                <ErrorMessage
                  name={input.input_name}
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            ))}

          <div className="flex justify-between gap-4">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={goToPreviousStep}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:bg-gradient-to-r hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 rounded-md text-white"
              >
                Back
              </button>
            )}

            {currentStep < 2 && (
              <button
                type="button"
                onClick={goToNextStep}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:bg-gradient-to-r hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 rounded-md text-white"
              >
                Next
              </button>
            )}

            {currentStep === 2 && (
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:bg-gradient-to-r hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 rounded-md text-white"
              >
                Submit
              </button>
            )}
          </div>
        </Form>
      </Formik>
    </div>
  );
}

export default App;
