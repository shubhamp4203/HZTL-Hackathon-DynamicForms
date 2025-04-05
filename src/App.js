// src/App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { Animation } from "./components/backgroundAnimation/Animation";


function App() {
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // dummy api data endpoint
  const apiEndpoint = "https://jsonplaceholder.typicode.com/posts";

  useEffect(() => {
    

    const fetchFormFields = async () => {
      try {
        const response = await axios.get(apiEndpoint);

        // dummy API data written for testing on UI
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
          additional_info: {
            captcha_enabled: true,
            success_redirect_url: "/thank-you",
            error_message: "Please fill out all required fields.",
          },
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

    // Simulate form submission
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

  // ClearS form data when reset button is clicked
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
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <div>Loading form...</div>;
  }

  return (
    <div>
      {formSubmitted && (
        <div className="submission-message">
          <h3>Thank you! Your message has been submitted successfully.</h3>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        action={form?.action_url}
        method={form?.method}
      >
        <h2>{form?.form_name}</h2>
        {form?.inputs.map((input, index) => (
          <div key={input.input_name || index} className="form-group">
            <label>{input.label}</label>
            {renderField(input)}
          </div>
        ))}
        <div className="form-buttons">
          {form?.buttons.map((button, index) => (
            <button
              key={button.button_id}
              type={button.button_type}
              onClick={button.button_type === "reset" ? handleReset : null}
              className="form-button"
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
