import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignupPage = () => {
	const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
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

	const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/signup`,
        {
          ...form,
        }
      );
      const { success, message, token, userId } = data;
      if (success) {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        navigate(`/leads/${userId}`);
      } else {
        setErrorMessage(message);
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        setErrorMessage(data.message);
      } else if (error.request) {
        setErrorMessage('No response received from the server.'); 
      } else {
        setErrorMessage('An error occurred while making the request.');
      }
    }
    setForm({
      ...form,
      email: '',
      password: '',
    });
  };

	return (
		<div className='formContainer'>
      <h2>Signup Account</h2>
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
        {errorMessage && <div className='error'>{errorMessage}</div>}
        <button type='submit'>Signup</button>
        <span>
          Already have an account? <Link to={'/'}>Login</Link>
        </span>
      </form>
    </div>
	)
}

export default SignupPage