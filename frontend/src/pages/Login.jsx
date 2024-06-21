import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { MdLogin, MdOutlineHttps } from "react-icons/md";
import {userLogin} from '../api'

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(""); // State to handle login errors
	const [user_name, setUsername] = useState('');
	const [password, setPassword] = useState('');

  const {
    handleSubmit,
    formState: { errors },
    register,
    reset
  } = useForm({defaultValues: {
    user_name: "",
    password: "",
  },});

  const onSubmit = async (data) => {
		 handleLogin(data);
	};

  const handleLogin = async (data) => {
    try {
        const res = await userLogin(data);
        if (res && res.token) {
            // Store token in local storage
            localStorage.setItem('token', res.token);

            const userRole = res.role
            switch (userRole) {
                case "admin":
                    navigate("/admin");
                    alert("Logged in successfully")
                    break;
                case "lecturer":
                    navigate("/lecturer");
                    break;
                case "student":
                    navigate("/student");
                    break;
                default:
                    navigate("/login"); // Redirect to login page if role is unknown
            }
        }
    } catch (error) {
        console.error("Error logging in", error.message);
        alert("Username or password is incorrect. Kindly check and try again ");
        reset()
    } finally {
    }
};


  return (
    <div className="flex min-h-screen justify-center items-center">
      <div className="bg-dark-green w-[400px] p-5 pt-2 rounded-box ">
        <div className="bg-dark-orange text-white rounded-box p-3 flex items-center justify-center mt-5 gap-5">
          <MdOutlineHttps />
          <h4 className="text-center font-bold capitalize">Welcome Back</h4>
        </div>
        <hr className="opacity-30 my-5" />
        <form action="" onSubmit={handleSubmit(onSubmit)} className="flex flex-col mt-6">
          <div className="my-3">
            <input
              type="user_name"
              id="user_name"
              label="user_name "
              className="w-full py-2 px-4 bg-light-gray rounded-btn"
              error={!!errors.user_name}
              {...register("user_name", {
                required: {
                  value: true,
                  message: "Username is required",
                },
              })}
              placeholder="Enter your Username"
              value={user_name}
							onChange={(e) => setUsername(e.target.value)}
						/>
          </div>
          <div className="my-3">
            <input
              id="password"
              type="password"
              label="Password"
              error={!!errors.password}
              className="w-full py-2 px-4 bg-light-gray rounded-btn"
              {...register("password", {
                required: {
                  value: true,
                  message: "Password is required",
                },
              })}
              placeholder="Enter your password"
              value={password}
							onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mt-2 text-red-500">{error}</div> {/* Display login error */}
          <div className="mt-8 flex justify-between items-center flex-1 w-full">
            <Link className="text-sm font-semibold hover:text-light-gray w-2/3" to="/forgot-password">
              Forgot your password?
            </Link>
            <button type="submit" className="bg-dark-orange hover:bg-dark-orange/95 font-semibold text-light-gray py-2 px-4 rounded inline-flex gap-2.5 items-center">
              <MdLogin />
              <span>Continue</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
