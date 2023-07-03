import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import LoginPage from '../pages/LoginPage/LoginPage';
import SignupPage from '../pages/SignupPage/SignupPage';
import LeadPage from '../pages/LeadPage/LeadPage';

vi.mock('axios');

describe('App', () => {
  it('Check if the App render well', () => {
    render(<App />);
  });

  it('Check if all Auth Pages render well', () => {
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
    const loginButton = screen.getByText('Login');
    const linkToSignupButton = screen.getByText('Signup');
    expect(loginButton).toBeInTheDocument();
    expect(linkToSignupButton).toBeInTheDocument();
    expect(emailInputSignup).toBeInTheDocument();
    expect(passwordInputSignup).toBeInTheDocument();

    userEvent.click(linkToSignupButton);
    const signupButton = screen.getByRole('button');
    expect(emailInputSignup).toBeInTheDocument();
    expect(passwordInputSignup).toBeInTheDocument();
    expect(signupButton).toBeInTheDocument();
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

    const webhookUrlHeading = screen.getByText('Your Webhook URL');
    expect(webhookUrlHeading).toBeInTheDocument();
  });
});