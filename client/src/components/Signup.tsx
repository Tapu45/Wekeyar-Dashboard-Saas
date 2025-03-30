import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api, { API_ROUTES } from "../utils/api";
import { motion, AnimatePresence } from "framer-motion";

const Signup: React.FC = () => {
  // Form data state
  const [formData, setFormData] = useState({
    organizationName: "",
    mainOfficeAddress: "",
    employeeSize: "",
    numberOfStores: "",
    logo: null as File | null,
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  // UI state
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState("");
  const [bgPosition, setBgPosition] = useState({ x: 0, y: 0 });
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const totalSteps = 4;

  // Update background position based on mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 25;
      const y = (e.clientY / window.innerHeight) * 25;
      setBgPosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    
    // Set typing state to trigger animations
    setIsTyping(true);
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set timeout to reset typing state
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  // Handle logo upload
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFormData({ ...formData, logo: file });
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Logo upload function
  const handleLogoUpload = async (): Promise<string> => {
    if (!formData.logo) return "";
    const logoFormData = new FormData();
    logoFormData.append("file", formData.logo);
    logoFormData.append("upload_preset", "Wekeyar-Saas");

    const response = await fetch("https://api.cloudinary.com/v1_1/dooemh4qb/image/upload", {
      method: "POST",
      body: logoFormData,
    });

    const data = await response.json();
    return data.secure_url;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    setError("");
    setIsLoading(true);

    try {
      const logoUrl = await handleLogoUpload();

      const response = await api.post(API_ROUTES.SIGNUP_ORGANIZATION, {
        organizationName: formData.organizationName,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        logo: logoUrl,
        employeeSize: formData.employeeSize,
        numberOfStores: parseInt(formData.numberOfStores, 10) || 0,
        mainOfficeAddress: formData.mainOfficeAddress,
      });

      if (response.status === 201) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Signup failed, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation between steps
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Validate current step to enable/disable Next button
  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return formData.organizationName && formData.mainOfficeAddress;
      case 2:
        return formData.employeeSize && formData.numberOfStores;
      case 3:
        return !!formData.logo;
      case 4:
        return formData.email && formData.username && formData.password && formData.confirmPassword;
      default:
        return false;
    }
  };

  // Get appropriate background patterns based on current step
  const getBackgroundPattern = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <motion.circle 
              cx="10%" cy="85%" r="80" 
              fill="url(#pattern1Gradient)"
              initial={{ scale: 0.8, opacity: 0.3 }}
              animate={{ scale: isTyping ? 1.1 : 1, opacity: isTyping ? 0.6 : 0.3 }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            />
            <motion.path 
              d="M80,20 Q100,50 80,80 Q60,110 80,140 Q100,170 80,200" 
              stroke="url(#blueGradient)" 
              strokeWidth="20" 
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0.2 }}
              animate={{ pathLength: 1, opacity: 0.5 }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            />
            <motion.rect 
              x="70%" y="10%" width="100" height="100" rx="20" 
              fill="url(#pattern1Gradient)" 
              opacity="0.2"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
          </>
        );
      case 2:
        return (
          <>
            <motion.path 
              d="M600,100 Q500,300 300,200 Q100,100 0,300" 
              stroke="url(#purpleGradient)" 
              strokeWidth="15" 
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0.2 }}
              animate={{ pathLength: 1, opacity: 0.5 }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
            />
            <motion.circle 
              cx="85%" cy="20%" r="60" 
              fill="url(#pattern2Gradient)"
              initial={{ scale: 0.9, opacity: 0.3 }}
              animate={{ scale: isTyping ? 1.2 : 1, opacity: isTyping ? 0.6 : 0.3 }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            />
            <motion.polygon 
              points="100,300 150,200 200,300" 
              fill="url(#blueGradient)" 
              opacity="0.3"
              initial={{ y: 0 }}
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        );
      case 3:
        return (
          <>
            <motion.circle 
              cx="15%" cy="25%" r="70" 
              fill="url(#pattern3Gradient)"
              initial={{ scale: 0.8, opacity: 0.3 }}
              animate={{ scale: isTyping ? 1.1 : 1, opacity: isTyping ? 0.6 : 0.3 }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            />
            <motion.path 
              d="M400,50 Q450,100 400,150 Q350,200 400,250 Q450,300 400,350" 
              stroke="url(#purpleGradient)" 
              strokeWidth="15" 
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0.2 }}
              animate={{ pathLength: 1, opacity: 0.5 }}
              transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse" }}
            />
            <motion.rect 
              x="70%" y="70%" width="80" height="80" rx="15" 
              fill="url(#blueGradient)" 
              opacity="0.3"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
          </>
        );
      case 4:
        return (
          <>
            <motion.circle 
              cx="80%" cy="85%" r="90" 
              fill="url(#pattern4Gradient)"
              initial={{ scale: 0.8, opacity: 0.3 }}
              animate={{ scale: isTyping ? 1.1 : 1, opacity: isTyping ? 0.7 : 0.3 }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            />
            <motion.path 
              d="M100,100 Q200,50 300,100 Q400,150 500,100" 
              stroke="url(#blueGradient)" 
              strokeWidth="20" 
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0.2 }}
              animate={{ pathLength: 1, opacity: 0.5 }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            />
            <motion.polygon 
              points="150,50 200,150 100,150" 
              fill="url(#purpleGradient)" 
              opacity="0.3"
              initial={{ y: 0, rotate: 0 }}
              animate={{ y: [0, -30, 0], rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        );
      default:
        return null;
    }
  };

  // Render progress bar
  const renderProgressBar = () => {
    return (
      <div className="w-full mb-8">
        <div className="w-full h-2 bg-gray-200 rounded-full mb-2">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="flex justify-between">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              <motion.div 
                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium mb-1
                  ${currentStep > index + 1 
                    ? "bg-blue-600 text-white" 
                    : currentStep === index + 1 
                      ? "bg-white border-2 border-blue-600 text-blue-600" 
                      : "bg-white border-2 border-gray-300 text-gray-400"
                  }`}
                whileHover={{ scale: 1.1 }}
              >
                {index + 1}
              </motion.div>
              <span className="text-xs text-gray-500">
                {index === 0 && "Organization"}
                {index === 1 && "Business"}
                {index === 2 && "Branding"}
                {index === 3 && "Account"}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Form steps components
  const renderStepOne = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h3 className="text-xl font-semibold text-gray-800">Tell us about your organization</h3>
      
      <div>
        <label htmlFor="organizationName" className="block text-gray-700 font-medium mb-2">
          Organization Name
        </label>
        <motion.div
          whileTap={{ scale: 0.99 }}
        >
          <input
            id="organizationName"
            type="text"
            value={formData.organizationName}
            onChange={handleChange}
            placeholder="Enter your organization name"
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
          />
        </motion.div>
      </div>

      <div>
        <label htmlFor="mainOfficeAddress" className="block text-gray-700 font-medium mb-2">
          Main Office Address
        </label>
        <motion.div
          whileTap={{ scale: 0.99 }}
        >
          <textarea
            id="mainOfficeAddress"
            value={formData.mainOfficeAddress}
            onChange={handleChange}
            placeholder="Enter main office address"
            rows={4}
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
          />
        </motion.div>
      </div>
    </motion.div>
  );

  const renderStepTwo = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h3 className="text-xl font-semibold text-gray-800">Business information</h3>
      
      <div>
        <label htmlFor="employeeSize" className="block text-gray-700 font-medium mb-2">
          Employee Size
        </label>
        <motion.div
          whileTap={{ scale: 0.99 }}
        >
          <select
            id="employeeSize"
            value={formData.employeeSize}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
          >
            <option value="">Select employee size</option>
            <option value="1-10">1-10</option>
            <option value="11-50">11-50</option>
            <option value="51-200">51-200</option>
            <option value="201-500">201-500</option>
            <option value="500+">500+</option>
          </select>
        </motion.div>
      </div>

      <div>
        <label htmlFor="numberOfStores" className="block text-gray-700 font-medium mb-2">
          Number of Stores
        </label>
        <motion.div
          whileTap={{ scale: 0.99 }}
        >
          <input
            id="numberOfStores"
            type="number"
            value={formData.numberOfStores}
            onChange={handleChange}
            placeholder="Enter number of stores"
            min="0"
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
          />
        </motion.div>
      </div>
    </motion.div>
  );

  const renderStepThree = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h3 className="text-xl font-semibold text-gray-800">Upload your brand identity</h3>
      
      <div className="flex flex-col items-center space-y-4">
        <motion.div 
          className="w-full max-w-xs aspect-square rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-blue-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {logoPreview ? (
            <img 
              src={logoPreview} 
              alt="Logo preview" 
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <div className="text-center p-6">
              <svg className="mx-auto h-12 w-12 text-blue-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4h-4m-12-4h.02M24 32c-2.105 0-4.02-.84-5.415-2.197C17.187 28.447 16 26.23 16 24c0-4.416 3.584-8 8-8s8 3.584 8 8-3.584 8-8 8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="mt-2 text-sm text-gray-600">Click to upload your organization logo</p>
              <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
            </div>
          )}
          <input
            id="logo"
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </motion.div>
        
        {logoPreview && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-red-500 hover:text-red-700 font-medium"
            onClick={() => {
              setFormData({ ...formData, logo: null });
              setLogoPreview("");
            }}
          >
            Remove logo
          </motion.button>
        )}
      </div>
    </motion.div>
  );

  const renderStepFour = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h3 className="text-xl font-semibold text-gray-800">Create your account</h3>
      
      <div>
        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
          Email
        </label>
        <motion.div
          whileTap={{ scale: 0.99 }}
        >
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
          />
        </motion.div>
      </div>

      <div>
        <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
          Username
        </label>
        <motion.div
          whileTap={{ scale: 0.99 }}
        >
          <input
            id="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
          />
        </motion.div>
      </div>

      <div>
        <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
          Password
        </label>
        <motion.div
          whileTap={{ scale: 0.99 }}
        >
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a secure password"
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
          />
        </motion.div>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
          Confirm Password
        </label>
        <motion.div
          whileTap={{ scale: 0.99 }}
        >
          <input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
          />
        </motion.div>
      </div>
    </motion.div>
  );

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return renderStepOne();
      case 2: return renderStepTwo();
      case 3: return renderStepThree();
      case 4: return renderStepFour();
      default: return null;
    }
  };

  // Main component render
  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center overflow-hidden relative"
      style={{
        background: `linear-gradient(135deg, rgba(237, 242, 255, 0.8) 0%, rgba(219, 228, 255, 0.8) 100%)`,
      }}
    >
      {/* SVG Background */}
      <div className="absolute inset-0 overflow-hidden">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#EC4899" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="pattern1Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id="pattern2Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id="pattern3Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F472B6" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#EC4899" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id="pattern4Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34D399" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.7" />
            </linearGradient>
          </defs>
          
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            style={{ transform: `translate(${bgPosition.x}px, ${bgPosition.y}px)` }}
          >
            {getBackgroundPattern()}
          </motion.g>
        </svg>
      </div>

      {/* Dynamic floating elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <AnimatePresence>
          <motion.div
            key={`floatingElement-${currentStep}-1`}
            className="absolute"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 0.4, 
              scale: 1,
              left: `${10 + (currentStep * 10)}%`,
              top: `${30 - (currentStep * 5)}%` 
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.8 }}
            style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'linear-gradient(135deg, #60A5FA, #3B82F6)' }}
          />
          <motion.div
            key={`floatingElement-${currentStep}-2`}
            className="absolute"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 0.3, 
              scale: 1,
              right: `${15 + (currentStep * 8)}%`,
              top: `${60 - (currentStep * 4)}%` 
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.6 }}
            style={{ width: '30px', height: '30px', borderRadius: '6px', background: 'linear-gradient(135deg, #A78BFA, #8B5CF6)' }}
          />
          <motion.div
            key={`floatingElement-${currentStep}-3`}
            className="absolute"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 0.2, 
              scale: 1,
              left: `${50 - (currentStep * 8)}%`,
              bottom: `${20 + (currentStep * 5)}%` 
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.7 }}
            style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #F472B6, #EC4899)' }}
          />
        </AnimatePresence>
      </div>

      {/* Typing effect particles */}
      {isTyping && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 8 }).map((_, index) => (
            <motion.div
              key={`typing-particle-${index}`}
              className="absolute"
              initial={{ 
                opacity: 0.7, 
                scale: 0.3,
                x: '-50%',
                y: '-50%',
                left: `${50 + (Math.random() * 40 - 20)}%`,
                top: `${50 + (Math.random() * 40 - 20)}%`
              }}
              animate={{ 
                opacity: 0,
                scale: 1.5,
                left: `${50 + (Math.random() * 80 - 40)}%`,
                top: `${50 + (Math.random() * 80 - 40)}%`
              }}
              transition={{ duration: 0.8 }}
              style={{ 
                width: `${5 + Math.random() * 10}px`, 
                height: `${5 + Math.random() * 10}px`, 
                borderRadius: '50%', 
                background: `rgba(${99 + Math.random() * 50}, ${102 + Math.random() * 50}, ${241 + Math.random() * 14}, ${0.3 + Math.random() * 0.4})` 
              }}
            />
          ))}
        </div>
      )}

      {/* Form container */}
      <motion.div 
        className="w-full max-w-2xl bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <motion.h2 
            className="text-3xl font-bold text-gray-800 mb-2"
            >
              Create your organization
            </motion.h2>
            <motion.p 
              className="text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Complete the steps below to get started
            </motion.p>
          </div>
  
          {renderProgressBar()}
  
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>
  
            {error && (
              <motion.div 
                className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}
  
            <motion.div 
              className="mt-8 flex justify-between items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {currentStep > 1 ? (
                <motion.button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 text-blue-600 font-medium rounded-xl hover:bg-blue-50 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Back
                </motion.button>
              ) : (
                <div></div> // Empty div to maintain layout when back button is not shown
              )}
  
              {currentStep < totalSteps ? (
                <motion.button
                  type="button"
                  onClick={nextStep}
                  disabled={!validateStep()}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    validateStep() 
                      ? "bg-blue-600 text-white hover:bg-blue-700" 
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  whileHover={validateStep() ? { scale: 1.05 } : { scale: 1 }}
                  whileTap={validateStep() ? { scale: 0.95 } : { scale: 1 }}
                >
                  Next
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  disabled={isLoading || !validateStep()}
                  className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isLoading 
                      ? "bg-gray-400 text-white cursor-wait" 
                      : validateStep() 
                        ? "bg-blue-600 text-white hover:bg-blue-700" 
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  whileHover={!isLoading && validateStep() ? { scale: 1.05 } : { scale: 1 }}
                  whileTap={!isLoading && validateStep() ? { scale: 0.95 } : { scale: 1 }}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </span>
                  ) : "Create Organization"}
                </motion.button>
              )}
            </motion.div>
          </form>
  
          <motion.div 
            className="mt-6 text-center text-gray-600 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Already have an account?{" "}
            <motion.a 
              href="/login" 
              className="text-blue-600 font-medium hover:underline"
              whileHover={{ scale: 1.05 }}
            >
              Sign in
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    );
  };
  
  export default Signup;