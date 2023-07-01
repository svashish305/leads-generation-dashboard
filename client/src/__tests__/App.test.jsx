import App from '../App';
import { it, describe } from 'vitest';
import { render } from '@testing-library/react';


describe('App', () => {
  it('Check if the App render well with login and signup', () => {
    render(<App />);
  });
});