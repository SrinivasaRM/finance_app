import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect } from 'vitest';

describe('App', () => {
    it('renders the main heading', () => {
        render(<App />);
        const headingElement = screen.getByText(/Personal Finance Tracker/i);
        expect(headingElement).toBeInTheDocument();
    });
});
