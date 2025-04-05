import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { Animation } from "./components/backgroundAnimation/Animation";


function App() {
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Fetch form fields (using dummy data from API)
  useEffect(() => {
    

    const fetchFormFields = async () => {
      try {
        // Simulated form structure
        const formData = {
          form_name: "Contact Us",
          form_id: "contact_form_123",
          action_url: "/submit-form",
          method: "POST",
          inputs: [
            {
              input_name: "first_name",
              label: "First Name",
              input_type: "text",
              required: true,
              placeholder: "Enter your first name",
              max_length: 50,
            },
            {
              input_name: "last_name",
              label: "Last Name",
              input_type: "text",
              required: true,
              placeholder: "Enter your last name",
              max_length: 50,
            },
            {
              input_name: "email",
              label: "Email Address",
              input_type: "email",
              required: true,
              placeholder: "Enter your email",
              max_length: 100,
            },
            {
              input_name: "message",
              label: "Message",
              input_type: "textarea",
              required: true,
              placeholder: "Write your message here",
              rows: 5,
              cols: 40,
            },
            {
              input_name: "newsletter_signup",
              label: "Sign up for newsletter",
              input_type: "checkbox",
              required: false,
              checked: false,
            },
          ],
          buttons: [
            {
              button_type: "submit",
              button_label: "Send Message",
              button_id: "submit_button",
            },
            {
              button_type: "reset",
              button_label: "Reset Form",
              button_id: "reset_button",
            },
          ],
        };

        setForm(formData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching form fields", error);
        setLoading(false);
      }
    };

    fetchFormFields();
  }, []);

  const handleChange = (e, fieldName) => {
    const { value, type, checked } = e.target;
    setFormData({
      ...formData,
      [fieldName]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted with data: ", formData);

    axios
      .post("https://jsonplaceholder.typicode.com/posts", formData)
      .then((response) => {
        console.log("Form submitted successfully: ", response);
        setFormSubmitted(true);
        setFormData({});
      })
      .catch((error) => {
        console.error("Error submitting form: ", error);
      });
  };

  const handleReset = () => {
    setFormData({});
    setFormSubmitted(false);
  };

  // Render dynamic fields based on the input type
  const renderField = (input) => {
    switch (input.input_type) {
      case "text":
        return (
          <input
            type="text"
            name={input.input_name}
            value={formData[input.input_name] || ""}
            onChange={(e) => handleChange(e, input.input_name)}
            placeholder={input.placeholder}
            maxLength={input.max_length}
            required={input.required}
            className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
          />
        );
      case "email":
        return (
          <input
            type="email"
            name={input.input_name}
            value={formData[input.input_name] || ""}
            onChange={(e) => handleChange(e, input.input_name)}
            placeholder={input.placeholder}
            maxLength={input.max_length}
            required={input.required}
            className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
          />
        );
      case "textarea":
        return (
          <textarea
            name={input.input_name}
            value={formData[input.input_name] || ""}
            onChange={(e) => handleChange(e, input.input_name)}
            placeholder={input.placeholder}
            rows={input.rows}
            cols={input.cols}
            required={input.required}
            className="w-full p-2 border border-gray-300 rounded-md resize-y focus:border-blue-500 focus:outline-none"
          />
        );
      case "checkbox":
        return (
          <input
            type="checkbox"
            name={input.input_name}
            checked={formData[input.input_name] || false}
            onChange={(e) => handleChange(e, input.input_name)}
            required={input.required}
            className="mr-2"
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="text-center">Loading form...</div>;
  }

  return (
    <div className="h-screen w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-background">
      {formSubmitted && (
        <div className="bg-green-500 text-white p-4 text-center rounded-lg mb-4">
          <h3>Thank you! Your message has been submitted successfully.</h3>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        action={form?.action_url}
        method={form?.method}
        className="bg-white p-6 sm:p-8 max-w-lg mx-auto rounded-lg shadow-lg relative z-10"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          {form?.form_name}
        </h2>
        {form?.inputs.map((input, index) => (
          <div key={input.input_name || index} className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              {input.label}
            </label>
            {renderField(input)}
          </div>
        ))}
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0">
          {form?.buttons.map((button, index) => (
            <button
              key={button.button_id}
              type={button.button_type}
              onClick={button.button_type === "reset" ? handleReset : null}
              className={`px-6 py-2 rounded-md text-white ${
                button.button_type === "submit"
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {button.button_label}
            </button>
          ))}
        </div>
      </form>
      <Animation/>
    </div>
  );
}

export default App;
