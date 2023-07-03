import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
	const [form, setForm] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userId = localStorage.getItem('userId');
      navigate(`/leads/${userId}`);
    }
  }, [navigate]);

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
        `${import.meta.env.VITE_API_URL}/api/v1/auth/login`,
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
    <>
      <div className='formContainer'>
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
          {errorMessage && <div className='error'>{errorMessage}</div>}
          <button type='submit'>Login</button>
          <span>
            Already have an account? <Link to={'/signup'}>Signup</Link>
          </span>
        </form>
      </div>
      <div className='imageAttribution'>
        Image by{' '}
        <Link to='https://www.freepik.com/free-vector/abstract-realistic-technology-particle-background_6881076.htm#query=technology%20abstract%20purple%20background&position=10&from_view=search&track=ais'>
          Freepik
        </Link>
      </div>
    </>
		
	)
}

export default LoginPage