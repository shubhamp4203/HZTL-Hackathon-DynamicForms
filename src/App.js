import React, { useState, useEffect } from "react";
import axios from "axios";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup"; // formik yup for validation
import { Animation } from "./components/backgroundAnimation/Animation"; // Import the Animation component
import "./App.css";
import { QRCodeCanvas } from "qrcode.react"; // Correct import

function App() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  useEffect(() => {
    const fetchForm = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("formID", "{47F1DD3E-7DB0-4CC9-907B-100E20A9E4BE}");
      const resp = await axios.get(
        `/api/sitecore/DynamicForm/GetForm?${params.toString()}`
      );
      setForm(resp?.data?.item);
      console.log(resp?.data?.item);
      setLoading(false);
    };
    fetchForm();
  }, []);

  // Handle form submission
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
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // If the form is still loading
  if (loading) {
    return <div className="text-center">Loading form...</div>;
  }

  // Split the form fields into two parts: Step 1 and Step 2
  const step1Inputs = form?.inputs.slice(0, 3);
  const step2Inputs = form?.inputs.slice(3, 6);
  const step3Inputs = form?.inputs.slice(6, 9);
  const step4Inputs = form?.inputs.slice(9, 12);
  const step5Inputs = form?.inputs.slice(12);

  // Generate initial values from query params or set empty
  const getQueryParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const params = {};
    urlParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  };

  const queryParams = getQueryParams();
  let initialValues = {};
  form?.inputs?.forEach((input) => {
    // Check if the input type is Checkbox and assign an empty array
    if (input.input_type === "Checkbox") {
      initialValues = { ...initialValues, [input.input_name]: [] };
    } else {
      // For other input types, keep the original logic
      initialValues = {
        ...initialValues,
        [input.input_name]: queryParams[input?.input_name] || "",
      };
    }
  });

  // Dynamically create the Yup validation schema
  const validationSchema = Yup.object(
    form?.inputs.reduce((acc, input) => {
      if (input.validations.length > 0) {
        const validations = input.validations.reduce(
          (validationsAcc, validation) => {
            if (validation.title === "Min") {
              validationsAcc = validationsAcc.min(
                parseInt(validation.validation_regex, 10),
                validation.error_message
              );
            }
            if (validation.title === "Max") {
              validationsAcc = validationsAcc.max(
                parseInt(validation.validation_regex, 10),
                validation.error_message
              );
            }
            if (validation.title === "isRequired") {
              // For checkbox, we'll need to validate that at least one checkbox is selected
              if (input.input_type === "Checkbox") {
                validationsAcc = validationsAcc.test(
                  "at-least-one",
                  validation.error_message,
                  (value) => Array.isArray(value) && value.length > 0
                );
              } else if (input.input_type === "File") {
                validationsAcc = validationsAcc.required(
                  validation.error_message
                );
              } else {
                validationsAcc = validationsAcc.required(
                  validation.error_message
                );
              }
            }
            if (validation.title === "Email") {
              // Email validation with optional regex
              if (validation.validation_regex) {
                validationsAcc = validationsAcc.matches(
                  new RegExp(validation.validation_regex),
                  validation.error_message
                );
              } else {
                validationsAcc = validationsAcc.email(validation.error_message);
              }
            }
            if (validation.title === "File") {
              // Check if validation is for a file input
              if (input.input_type === "File") {
                // For file type validation (mime types)
                if (validation.validation_regex) {
                  validationsAcc = validationsAcc.test(
                    "file-type",
                    validation.error_message,
                    (value) => {
                      const fileTypes = validation.validation_regex.split(","); // Assuming comma-separated file types
                      const fileType = value?.type;
                      return fileTypes.includes(fileType);
                    }
                  );
                }
              }
            }
            return validationsAcc;
          },
          input.input_type === "Checkbox" ? Yup.array() : Yup.string() // Use Yup.array() for checkbox fields
        );
        acc[input.input_name] = validations;
      }

      return acc;
    }, {})
  );

  return (
    <div className="center-wrapper">
      <Animation />
      {formSubmitted && (
        <div className="bg-green-500 text-white p-4 text-center rounded-lg mb-4">
          <h3>Thank you! Your message has been submitted successfully.</h3>
        </div>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values }) => {
          // Generate the URL to encode the form values in the QR code
          const queryString = new URLSearchParams(values).toString();
          const fullUrl = `${window.location.origin}${window.location.pathname}?${queryString}`;
          console.log("Generated URL: ", fullUrl);

          return (
            <div className="absolute inset-0 flex justify-evenly items-center mx-auto container-fluid">
              <Form className="p-6 sm:p-8 rounded-lg shadow-2xl z-10 sm:max-w-l max-w-md w-full">
                <h2 className="text-4xl font-semibold text-center text-white mb-6v typing-slider">
                  {form?.form_name}
                </h2>

                {/* Step 1 */}
                {currentStep === 1 &&
                  step1Inputs.map((input, index) => (
                    <div key={input.input_name || index} className="mb-4">
                      <label className="block text-white font-medium mb-2">
                        {input.label}
                      </label>
                      {/* Switch for different input types */}
                      {(() => {
                        switch (input.input_type) {
                          case "Text":
                          case "Email":
                          case "Date":
                          case "Url":
                          case "Password":
                          case "Tel":
                          case "Color":
                          case "File":
                            return (
                              <Field
                                name={input.input_name}
                                type={input.input_type.toLowerCase()}
                                placeholder={input.placeholder}
                                className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                              />
                            );
                          case "Select":
                            return (
                              <Field
                                as="select"
                                name={input.input_name}
                                className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                              >
                                {input.select_items.map((item, idx) => (
                                  <option key={idx} value={item.option_value}>
                                    {item.option_text}
                                  </option>
                                ))}
                              </Field>
                            );
                          case "Radio":
                            return (
                              <div>
                                {input.radio_items.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center mb-2"
                                  >
                                    <Field
                                      type="radio"
                                      name={input.input_name}
                                      value={item}
                                      id={`${input.input_name}_${idx}`}
                                      className="mr-2"
                                    />
                                    <label
                                      htmlFor={`${input.input_name}_${idx}`}
                                      className="text-white"
                                    >
                                      {item}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            );
                          case "Checkbox":
                            return (
                              <div>
                                {input.checkbox_items.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center mb-2"
                                  >
                                    <Field
                                      type="checkbox"
                                      name={input.input_name}
                                      value={item}
                                      id={`${input.input_name}_${idx}`}
                                      className="mr-2"
                                    />
                                    <label
                                      htmlFor={`${input.input_name}_${idx}`}
                                      className="text-white"
                                    >
                                      {item}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            );
                          default:
                            return null;
                        }
                      })()}
                      <ErrorMessage
                        name={input.input_name}
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  ))}

                {/* Step 2 */}
                {currentStep === 2 && (
                  <>
                    {step2Inputs.map((input, index) => (
                      <div key={input.input_name || index} className="mb-4">
                        <label className="block text-white font-medium mb-2">
                          {input.label}
                        </label>
                        {/* Switch for different input types */}
                        {(() => {
                          switch (input.input_type) {
                            case "Text":
                            case "Email":
                            case "Date":
                            case "Url":
                            case "Password":
                            case "Tel":
                            case "Color":
                            case "File":
                              return (
                                <Field
                                  name={input.input_name}
                                  type={input.input_type.toLowerCase()}
                                  placeholder={input.placeholder}
                                  className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                                />
                              );
                            case "Select":
                              return (
                                <Field
                                  as="select"
                                  name={input.input_name}
                                  className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                                >
                                  {input.select_items.map((item, idx) => (
                                    <option key={idx} value={item.option_value}>
                                      {item.option_text}
                                    </option>
                                  ))}
                                </Field>
                              );
                            case "Radio":
                              return (
                                <div>
                                  {input.radio_items.map((item, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center mb-2"
                                    >
                                      <Field
                                        type="radio"
                                        name={input.input_name}
                                        value={item}
                                        id={`${input.input_name}_${idx}`}
                                        className="mr-2"
                                      />
                                      <label
                                        htmlFor={`${input.input_name}_${idx}`}
                                        className="text-white"
                                      >
                                        {item}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              );
                            case "Checkbox":
                              return (
                                <div>
                                  {input.checkbox_items.map((item, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center mb-2"
                                    >
                                      <Field
                                        type="checkbox"
                                        name={input.input_name}
                                        value={item}
                                        id={`${input.input_name}_${idx}`}
                                        className="mr-2"
                                      />
                                      <label
                                        htmlFor={`${input.input_name}_${idx}`}
                                        className="text-white"
                                      >
                                        {item}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              );
                            default:
                              return null;
                          }
                        })()}
                        <ErrorMessage
                          name={input.input_name}
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    ))}
                  </>
                )}

                {/* Step 3 */}
                {currentStep === 3 &&
                  step3Inputs.map((input, index) => (
                    <div key={input.input_name || index} className="mb-4">
                      <label className="block text-white font-medium mb-2">
                        {input.label}
                      </label>
                      {/* Switch for different input types */}
                      {(() => {
                        switch (input.input_type) {
                          case "Text":
                          case "Email":
                          case "Date":
                          case "Url":
                          case "Password":
                          case "Tel":
                          case "Color":
                          case "File":
                            return (
                              <Field
                                name={input.input_name}
                                type={input.input_type.toLowerCase()}
                                placeholder={input.placeholder}
                                className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                              />
                            );
                          case "Select":
                            return (
                              <Field
                                as="select"
                                name={input.input_name}
                                className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                              >
                                {input.select_items.map((item, idx) => (
                                  <option key={idx} value={item.option_value}>
                                    {item.option_text}
                                  </option>
                                ))}
                              </Field>
                            );
                          case "Radio":
                            return (
                              <div>
                                {input.radio_items.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center mb-2"
                                  >
                                    <Field
                                      type="radio"
                                      name={input.input_name}
                                      value={item}
                                      id={`${input.input_name}_${idx}`}
                                      className="mr-2"
                                    />
                                    <label
                                      htmlFor={`${input.input_name}_${idx}`}
                                      className="text-white"
                                    >
                                      {item}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            );
                          case "Checkbox":
                            return (
                              <div>
                                {input.checkbox_items.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center mb-2"
                                  >
                                    <Field
                                      type="checkbox"
                                      name={input.input_name}
                                      value={item}
                                      id={`${input.input_name}_${idx}`}
                                      className="mr-2"
                                    />
                                    <label
                                      htmlFor={`${input.input_name}_${idx}`}
                                      className="text-white"
                                    >
                                      {item}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            );
                          default:
                            return null;
                        }
                      })()}
                      <ErrorMessage
                        name={input.input_name}
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  ))}

                {/* Step 4 */}
                {currentStep === 4 &&
                  step4Inputs.map((input, index) => (
                    <div key={input.input_name || index} className="mb-4">
                      <label className="block text-white font-medium mb-2">
                        {input.label}
                      </label>
                      {/* Switch for different input types */}
                      {(() => {
                        switch (input.input_type) {
                          case "Text":
                          case "Email":
                          case "Date":
                          case "Url":
                          case "Password":
                          case "Tel":
                          case "Color":
                          case "File":
                            return (
                              <Field
                                name={input.input_name}
                                type={input.input_type.toLowerCase()}
                                placeholder={input.placeholder}
                                className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                              />
                            );
                          case "Select":
                            return (
                              <Field
                                as="select"
                                name={input.input_name}
                                className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                              >
                                {input.select_items.map((item, idx) => (
                                  <option key={idx} value={item.option_value}>
                                    {item.option_text}
                                  </option>
                                ))}
                              </Field>
                            );
                          case "Radio":
                            return (
                              <div>
                                {input.radio_items.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center mb-2"
                                  >
                                    <Field
                                      type="radio"
                                      name={input.input_name}
                                      value={item}
                                      id={`${input.input_name}_${idx}`}
                                      className="mr-2"
                                    />
                                    <label
                                      htmlFor={`${input.input_name}_${idx}`}
                                      className="text-white"
                                    >
                                      {item}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            );
                          case "Checkbox":
                            return (
                              <div>
                                {input.checkbox_items.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center mb-2"
                                  >
                                    <Field
                                      type="checkbox"
                                      name={input.input_name}
                                      value={item}
                                      id={`${input.input_name}_${idx}`}
                                      className="mr-2"
                                    />
                                    <label
                                      htmlFor={`${input.input_name}_${idx}`}
                                      className="text-white"
                                    >
                                      {item}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            );
                          default:
                            return null;
                        }
                      })()}
                      <ErrorMessage
                        name={input.input_name}
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  ))}

                {/* Step 5 */}
                {currentStep === 5 &&
                  step5Inputs.map((input, index) => (
                    <div key={input.input_name || index} className="mb-4">
                      <label className="block text-white font-medium mb-2">
                        {input.label}
                      </label>
                      {/* Switch for different input types */}
                      {(() => {
                        switch (input.input_type) {
                          case "Text":
                          case "Email":
                          case "Date":
                          case "Url":
                          case "Password":
                          case "Tel":
                          case "Color":
                          case "File":
                            return (
                              <Field
                                name={input.input_name}
                                type={input.input_type.toLowerCase()}
                                placeholder={input.placeholder}
                                className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                              />
                            );
                          case "Select":
                            return (
                              <Field
                                as="select"
                                name={input.input_name}
                                className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                              >
                                {input.select_items.map((item, idx) => (
                                  <option key={idx} value={item.option_value}>
                                    {item.option_text}
                                  </option>
                                ))}
                              </Field>
                            );
                          case "Radio":
                            return (
                              <div>
                                {input.radio_items.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center mb-2"
                                  >
                                    <Field
                                      type="radio"
                                      name={input.input_name}
                                      value={item}
                                      id={`${input.input_name}_${idx}`}
                                      className="mr-2"
                                    />
                                    <label
                                      htmlFor={`${input.input_name}_${idx}`}
                                      className="text-white"
                                    >
                                      {item}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            );
                          case "Checkbox":
                            return (
                              <div>
                                {input.checkbox_items.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center mb-2"
                                  >
                                    <Field
                                      type="checkbox"
                                      name={input.input_name}
                                      value={item}
                                      id={`${input.input_name}_${idx}`}
                                      className="mr-2"
                                    />
                                    <label
                                      htmlFor={`${input.input_name}_${idx}`}
                                      className="text-white"
                                    >
                                      {item}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            );
                          default:
                            return null;
                        }
                      })()}
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

              <div className="mt-6 flex flex-col justify-center item-center">
                <QRCodeCanvas
                  value={fullUrl}
                  size={256}
                  className="sm:max-w-l max-w-md"
                />
                <p className="mt-2 text-sm text-gray-600">
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
