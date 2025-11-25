import React, { useState } from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import objFormValidator from "../../utils/formValidator";
// import { IoPersonCircleOutline } from "react-icons/io5";
// import { FaFingerprint, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { IdentificationIcon, UserCircleIcon, EyeIcon, EyeSlashIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
// import { CiLogin } from "react-icons/ci";
import useRerender from "../../Hooks/useReRender";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from "react";
import { LoginAPI } from '../../Api/Auth/AuthApi';
import { useUser } from './UserContext';

const objValidator = { ...objFormValidator };

objValidator.default = {
  required: (_, obj) => `${obj.label} is required`,
  email: (_, obj) => "email should be a valid email",
  numeric: (_, obj) => `${obj.label} should be a number`,
};

objValidator.fields = {
  employee_id: { required: true, label: "Employee ID", inputType: "employee_id", numeric: true, type: "text", placeHolder: "Enter your Employee ID" },
  password: { required: true, label: "Password", inputType: "password", type: "password", placeHolder: "Enter your Password" },
};

const initialData = {
  employee_id: "",
  password: "",
};

const iconMap = {
  employee_id: <UserCircleIcon className="h-8 w-8 text-gray-600" />,
  password: <IdentificationIcon className="h-8 w-8 text-gray-600" />,
};

const Login = () => {
    const { setUser } = useUser();
    const [objFormData, setFormData] = useState(initialData);
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const Render = useRerender();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        if (token) {
        console.log(location);
        const from = location.state?.from || "/dashboard"; // Fallback if no previous route
        console.log("Navigating to:", from);  // Debugging log
        navigate(from, { replace: true });
        }
    }, [navigate, location]);

    const handleSubmitLogin = async () => {
        if (objValidator.validateFields(objFormData)) {
            Render();
            return false;
        }
        
        try {
            const data = await LoginAPI(objFormData);
            const urlToken = data.data.token;
            localStorage.setItem('auth_token', urlToken);
            setUser(data.data.user);
            navigate('/dashboard');
            toast.success(data.data.message || 'Login successful!');
            console.log(data.data);
        } catch (error) {
            console.error('Login failed:', error);
            const errorMessage = 
              error.response?.data?.error || 
              error.response?.data?.message || 
              error.message || 
              'Login failed!';

            toast.error(errorMessage);
        }
    }
    
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-900 to-black">
        <div className="w-[90%] max-w-sm md:max-w-md p-6 bg-white/10 backdrop-blur-lg flex flex-col items-center gap-4 rounded-2xl shadow-xl border border-white/20">
          {/* Logo */}
          <img src="/" alt="logo" className="w-14 md:w-16" />

          {/* Title */}
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">
            Global Command Center Hub
          </h1>

          {/* Subtitle */}
          <p className="text-sm text-gray-300 text-center">
            Welcome Back!
          </p>

          {/* Form Fields */}
          <div className="w-full flex flex-col gap-4">
            {Object.entries(objValidator.fields).map(([key, value], index) => (
              <div key={index} className="relative flex items-center bg-gray-900/60 p-3 rounded-xl gap-2 text-white border border-gray-700 focus-within:border-blue-500 transition">
                <div className="flex items-center gap-2 w-full">
                  {iconMap[value.inputType]}
                  {(value.type === "text" || value.type === "password") && (
                    <>
                      <input
                        type={value.type === "password" ? (showPassword ? "text" : "password") : value.type}
                        value={objFormData[key]}
                        onChange={(e) => setFormData({ ...objFormData, [key]: e.target.value })}
                        placeholder={value.placeHolder}
                        className="bg-transparent border-0 w-full outline-none text-sm md:text-base placeholder-gray-400 text-white"
                      />
                      {value.type === "password" && (
                        <div className="absolute right-3 top-3 cursor-pointer">
                          {showPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-white transition" onClick={togglePasswordVisibility} />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400 hover:text-white transition" onClick={togglePasswordVisibility} />
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
                {objValidator.getErrorType(key) && (
                  <p className="text-red-500 text-xs mt-1 absolute -bottom-5 left-2">
                    {objValidator.getError(key, objValidator.fields[key])}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Login Button */}
          <button
            className="flex items-center justify-center gap-2 px-4 py-2 mt-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg shadow-blue-500/20 transition w-full"
            onClick={handleSubmitLogin}
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span>Login</span>
          </button>
          <div className="text-center text-[12px] text-gray-300 tracking-wide mt-6">
              v1.0.0 • © 2025 <span className="font-medium">Global Command Center Hub</span>
          </div>
        </div>
      </div>
    )
}

export default Login
