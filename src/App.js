import React, { useState, useEffect } from "react";
import axios from "axios";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Animation } from "./components/backgroundAnimation/Animation";
import "./App.css";
import data from "./data.json";
import { QRCodeCanvas } from "qrcode.react";
import "./index.css";

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
  newsletter_signup: Yup.boolean().oneOf([true], "This is a required field"),
  color: Yup.string(),
  date: Yup.string(),
  file: Yup.mixed(),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long"),
  radio: Yup.string().required("Please select an option"),
  select: Yup.string().required("Please select an option"),
  telephone: Yup.string().required("Telephone number is required"),
  url: Yup.string().url("Invalid URL"),
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
        alert("Thank you for your response!");
      })
      .catch((error) => {
        console.error("Error submitting form: ", error);
      });
  };

  const goToNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5)); // Move to the next step
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1)); // Go to previous step
  };

  if (loading) {
    return <div className="text-center">Loading form...</div>;
  }

  // Step inputs
  const step1Inputs = form?.inputs.slice(0, 3);
  let step2Inputs = form?.inputs.slice(3, 6);
  const step3Inputs = form?.inputs.slice(6, 9);
  let step4Inputs = form?.inputs.slice(9, 12);
  let step5Inputs = form?.inputs.slice(12);

  // Move the second field from Step 2 and the first field from Step 4 to Step 5
  step5Inputs = [
    ...step5Inputs,
    step2Inputs[1], // Second field from Step 2
    step4Inputs[0], // First field from Step 4
  ];

  // Remove those fields from Step 2 and Step 4
  step2Inputs = step2Inputs.filter((_, index) => index !== 1);
  step4Inputs = step4Inputs.filter((_, index) => index !== 0);

  return (
    <div className="center-wrapper">
      <Animation />

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
          color: "",
          date: "",
          file: null,
          password: "",
          radio: "",
          select: "",
          telephone: "",
          url: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values }) => {
          return (
            <div className="absolute inset-0 flex justify-evenly items-center mx-auto container-fluid">
              <Form className="p-6 sm:p-8 rounded-lg shadow-2xl z-10 sm:max-w-l max-w-md w-full">
                <h2 className="text-4xl font-semibold text-center text-white mb-6 typing-slider ">
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

                {/* Step 3 */}
                {currentStep === 3 &&
                  step3Inputs.map((input, index) => (
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
                        className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none bg-white"
                      />
                      <ErrorMessage
                        name={input.input_name}
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  ))}

                {/* Step 4 - Add dropdown for both fields */}
                {currentStep === 4 &&
                  step4Inputs.map((input, index) => (
                    <div key={input.input_name || index} className="mb-4">
                      <label className="block text-white font-medium mb-2">
                        {input.label}
                      </label>
                      <Field
                        name={input.input_name}
                        as="select"
                        className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                      >
                        {input.options?.map((option, idx) => (
                          <option key={idx} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name={input.input_name}
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  ))}

                {/* Step 5 - Radio and Checkbox Inputs */}
                {currentStep === 5 &&
                  step5Inputs.map((input, index) => (
                    <div key={input.input_name || index} className="mb-4 flex">
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
                        className=" ml-2 align-baseline p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
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

                  {currentStep < 5 && (
                    <button
                      type="button"
                      onClick={goToNextStep}
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:bg-gradient-to-r hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 rounded-md text-white"
                    >
                      Next
                    </button>
                  )}

                  {currentStep === 5 && (
                    <button
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:bg-gradient-to-r hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 rounded-md text-white"
                    >
                      Submit
                    </button>
                  )}
                </div>
              </Form>

              {/* QR Code */}
              <div className="mt-6 flex-col justify-center items-center">
                <QRCodeCanvas
                  value={window.location.href}
                  className="sm:max-w-l max-w-md"
                />
                <p className="mt-2 text-sm text-grey-600 sm:flex-col flex">
                  Scan to see the filled form
                </p>
              </div>
            </div>
          );
        }}
      </Formik>
    </div>
  );
}

export default App;
