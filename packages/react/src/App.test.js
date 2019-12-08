import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders csv-to-javascript', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/csv-to-javascript/i);
  expect(linkElement).toBeInTheDocument();
});
