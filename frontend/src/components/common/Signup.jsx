import React, { useState } from 'react';
import { Link } from "react-router-dom";


export default function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required.';
    }

    if (!formData.email.trim() || !emailPattern.test(formData.email)) {
      newErrors.email = 'Please enter a valid email.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.id]: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Form Data:', formData); // ✅ Log filled form data
      alert('Form submitted successfully!');
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 ">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full  border-2 border-amber-200">
        <h2 className="text-2xl font-bold text-center text-black mb-8">
          Create an Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {['username', 'email', 'password', 'confirmPassword'].map((field) => (
            <div key={field}>
              <label
                htmlFor={field}
                className="block text-black font-semibold mb-2 capitalize"
              >
                {field === 'confirmPassword' ? 'Confirm Password' : field}
              </label>
              <input
                type={field.includes('password') ? 'password' : field}
                id={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={
                  field === 'confirmPassword'
                    ? 'Confirm your password'
                    : `Enter your ${field}`
                }
                className={`w-full px-4 py-2 border ${
                  errors[field] ? 'border-red-500' : 'border-gray-200'
                } rounded-lg  transition-all duration-300`}
                required
              />
              {errors[field] && (
                <p className="text-red-500 text-sm mt-2">{errors[field]}</p>
              )}
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-[#D4AF37] text-white py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
          >
            Register
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-[#D4AF37] hover:text-yellow-500 hover:underline font-semibold  transition-colors duration-300"
          >
            Login 
          </Link>
        </p>
      </div>
    </div>
  );
}
