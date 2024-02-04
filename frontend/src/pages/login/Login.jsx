import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import styles from "./Login.module.css";
import { loginUser, reset } from "../../redux/auth/authSlice";
import { IoArrowBack } from "react-icons/io5";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isError } = useSelector((state) => state?.auth);
  const message = useSelector((state) => state?.auth?.message);

  // const userRole = user?.responseData?.user?.role;
  const userRole = user?.user?.role;

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (user) {
      navigate("/");
    }

    dispatch(reset());
  }, [user, isError, message, navigate, dispatch]);

  const handleInputChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const credentials = {
      email,
      password,
    };

    dispatch(loginUser(credentials));
  };

  const handleNavigateToForgotPasswordPage = () => {
    navigate("/auth/forgotpassword");
  };

  useEffect(() => {
    if (userRole === "admin") {
      navigate("/admin/destinations");
    }
  });

  return (
    <div className={styles.container}>
      <div className={styles.backButton}>
        <Link to="/">
          {" "}
          <IoArrowBack size={32} color="#d8e1ec" />
        </Link>
      </div>
      <img
        src="../images/logo.png"
        alt="Travelist logo"
        className={styles.logo}
      />
      <h2 className={styles.title}>Log In</h2>
      <p className={styles.text}>
        New user?{" "}
        <span>
          {" "}
          <Link to="/auth/register">Register</Link>
        </span>
      </p>

      <form onSubmit={handleLogin} className={styles.form}>
        <input
          type="email"
          name="email"
          placeholder="Email address"
          onChange={handleInputChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleInputChange}
        />
        <p
          className={styles.forgotPassword}
          onClick={handleNavigateToForgotPasswordPage}
        >
          Forgot your password?
        </p>
        <button type="submit" className={styles.submitButton}>
          Log in
        </button>
      </form>
    </div>
  );
};

export default Login;
