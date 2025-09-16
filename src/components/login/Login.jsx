import { React, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faTriangleExclamation,
  faSpinner,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import { observer } from "mobx-react";
import authStore from "../../stores/AuthStore";
import { Button } from "flowbite-react";
import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "../../i18n";

const Login = observer(() => {
  const { t, i18n } = useTranslation();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [logInf, setLogInf] = useState({
    userNameOrEmailAddress: "",
    password: "",
  });

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "zh" : "en";
    changeLanguage(newLang);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true);
    await authStore.login(logInf);
    if (authStore.token || authStore.error) {
      setIsLoading(false);
    }

  };

  useEffect(() => {
    authStore.error = null;
    return()=>{
      authStore.error = null;
    }
  }, []);
  
  if (authStore.token) {
  
    return <Navigate to="/home" />
  }

  return (
    <div className="login-page text-slate-50">
      
      <div className="z-10 relative flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        {/* Language Toggle Button */}
        <div className="mt-4 flex justify-center">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              title={t("login.languageToggle")}
            >
              <FontAwesomeIcon icon={faGlobe} className="text-white" />
              <span>{i18n.language === "en" ? "中文" : "English"}</span>
            </button>
          </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-4xl md:text-5xl/9  font-bold tracking-tight">
            {t("login.header")}
          </h2>
          
          
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6 border p-3 rounded border-red-200 bg-black bg-opacity-50" onSubmit={(e) => handleSubmit(e)}>
            
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium ">
                {t("login.userName")}
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="text"
                  required
                  autoComplete="email"
                  className="block w-full text-black rounded-md bg-white px-3 py-1.5 text-base  outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(event) =>
                    setLogInf((prev) => ({
                      ...prev,
                      userNameOrEmailAddress: event.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium "
                >
                  {t("login.password")}
                </label>
              </div>

              <div className="mt-2 flex items-center">
                <input
                  onChange={(event) =>
                    setLogInf((prev) => ({
                      ...prev,
                      password: event.target.value,
                    }))
                  }
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  className="block w-full text-black rounded-md bg-white px-3 py-1.5 text-base  outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
                <span
                  className="hover:cursor-pointer ms-1"
                  onClick={() => {
                    togglePasswordVisibility();
                  }}
                >
                  <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                </span>
              </div>
            </div>

              {/* btns */}
             
            <div className="flex gap-11">

              <div
                className="flex w-full justify-center items-center rounded-md border border-red-500 px-3 py-1.5 text-sm/6 font-semibold reset text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"               
              >
                {t("login.forgetPassword")}
              </div>
              
              <Button
                className="flex w-full justify-center items-center rounded-md bg-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-blue-500 hover:cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                type = "submit"
              >
                {isLoading ? (
                  <FontAwesomeIcon
                    className="text-xl font-bold"
                    icon={faSpinner}
                    spin
                  />
                ) : (
                  `${t("login.login")}`
                )}
              </Button>
            </div>
             {/* ==== btns ====*/}
            <div className="error">
              {authStore.error ? (
                <div className="font-bold text-red-600 mt-5  text-center">
                  <FontAwesomeIcon
                    icon={faTriangleExclamation}
                    beat
                    style={{ color: "#c70000" }}
                  />{" "}
                  {authStore.error} !
                </div>
              ) : (
                <div className="font-bold text-red-600 mt-2"></div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

export default Login;
