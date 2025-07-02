import React, { useState } from "react";
import { Link } from "react-router-dom";

const inputFields = [
  {
    id: "email",
    label: "Email",
    type: "email",
    placeholder: "email",
  },
  {
    id: "password",
    label: "Password",
    type: "password",
    placeholder: "**********",
  },
];

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id || e.target.name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen p-8">
      <div className="max-w-lg mx-auto p-8 border-2 border-amber-200 bg-white rounded-xl shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-center text-black mb-8">Login</h2>
        </div>
        <form onSubmit={handleSubmit}>
          {inputFields.map(({ id, label, type, placeholder }) => (
            <div className="mb-6" key={id}>
              <label className="block mb-2 font-semibold" htmlFor={id}>
                {label}
              </label>
              <input
                id={id}
                type={type}
                placeholder={placeholder}
                value={formData[id]}
                onChange={handleChange}
                className="inline-block w-full p-4 leading-6 text-lg  bg-white shadow border border-gray-200 rounded-lg"
              />
            </div>
          ))}

          <div className="flex flex-wrap -mx-4 mb-6 items-center justify-between">
            <div className="w-full lg:w-auto px-4 mb-4 lg:mb-0">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="font-semibold">Remember me</span>
              </label>
            </div>
            <div className="w-full lg:w-auto px-4">
              <a className="inline-block font-semibold hover:underline" href="#">
                Forgot your password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            className="inline-block w-full py-4 px-6 mb-6 text-center text-lg leading-6 text-white bg-[#D4AF37] hover:bg-yellow-400 font-semibold shadow rounded transition duration-200 cursor-pointer"
          >
            login
          </button>

          <p className="text-center font-semibold">
            Don&rsquo;t have an account?{" "}
            <Link to="/signup" className="text-[#D4AF37] hover:text-yellow-500 hover:underline" >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
