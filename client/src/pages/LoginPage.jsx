import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

const LoginPage = () => {
  const navigate = useNavigate();
	const [form, setForm] = useState({
    email: '',
    password: '',
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
      position: 'bottom-left',
    });

	const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/login`,
        {
          ...form,
        },
        { withCredentials: true }
      );
      const { success, message, userId } = data;
      console.log('>>>data ', data);
      if (success) {
        console.log('>>> loggedin, navigating to dashboard', userId);
        navigate(`/leads/${userId}`);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.error(error);
    }
    setForm({
      ...form,
      email: '',
      password: '',
    });
  };

	return (
		<div className='form_container'>
      <h2>Login Account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            id='email'
            name='email'
            value={email}
            placeholder='Enter your email'
            onChange={handleOnChange}
          />
        </div>
        <div>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            name='password'
            value={password}
            placeholder='Enter your password'
            onChange={handleOnChange}
          />
        </div>
        <button type='submit'>Login</button>
        <span>
          Already have an account? <Link to={'/signup'}>Signup</Link>
        </span>
      </form>
      <ToastContainer />
    </div>
	)
}

export default LoginPage