import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';
import LoginPage from '../pages/LoginPage/LoginPage';
import SignupPage from '../pages/SignupPage/SignupPage';
import LeadPage from '../pages/LeadPage/LeadPage';

describe('App', () => {
  it('Check if the App render well', () => {
    render(<App />);
  });

  it('Check if Signup Page renders well', () => {
    render(
      <MemoryRouter initialEntries={['/signup']}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/leads/:userId" element={<LeadPage />} />
        </Routes>
      </MemoryRouter>
    );

    const emailInputSignup = screen.getByLabelText('Email');
    const passwordInputSignup = screen.getByLabelText('Password');
    const signupButton = screen.getByRole('button');
    const linkToLoginButton = screen.getByText('Login');
    expect(emailInputSignup).toBeInTheDocument();
    expect(passwordInputSignup).toBeInTheDocument();
    expect(signupButton).toBeInTheDocument();
    expect(linkToLoginButton).toBeInTheDocument();
  });

  it('Check if Login Page renders well', () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/leads/:userId" element={<LeadPage />} />
        </Routes>
      </MemoryRouter>
    );

    const emailInputSignup = screen.getByLabelText('Email');
    const passwordInputSignup = screen.getByLabelText('Password');
    const loginButton = screen.getByRole('button');
    const linkToSignupButton = screen.getByText('Signup');
    expect(emailInputSignup).toBeInTheDocument();
    expect(passwordInputSignup).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
    expect(linkToSignupButton).toBeInTheDocument();
  });

  it('Check if Lead Page renders well', () => {
    render(
      <MemoryRouter initialEntries={['/leads/1']}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/leads/:userId" element={<LeadPage />} />
        </Routes>
      </MemoryRouter>
    );
    
    const logoutButton = screen.getByText('Log Out');
    const webhookUrlHeading = screen.getByText('Your Webhook URL');
    expect(logoutButton).toBeInTheDocument();
    expect(webhookUrlHeading).toBeInTheDocument();
  });
});