import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

const SignupPage = () => {
	const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const { email, password } = form;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

	const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });
	
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-right",
    });

	const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/v1/auth/signup`,
        {
          ...form,
        },
        { withCredentials: true }
      );
      const { success, message, user } = data;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate(`/leads/${user.userId}`);
        }, 1000);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.error(error);
    }
    setForm({
      ...form,
      email: "",
      password: "",
    });
  };

	return (
		<div className="form_container">
      <h2>Signup Account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            placeholder="Enter your email"
            onChange={handleOnChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            placeholder="Enter your password"
            onChange={handleOnChange}
          />
        </div>
        <button type="submit">Submit</button>
        <span>
          Already have an account? <Link to={"/login"}>Login</Link>
        </span>
      </form>
			<ToastContainer />
    </div>
	)
}

export default SignupPage