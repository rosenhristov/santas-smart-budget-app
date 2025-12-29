import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App.jsx';

vi.mock('axios', () => ({
  default: { post: vi.fn() }
}));
import axios from 'axios';

// Mock the chart to avoid Recharts internals in jsdom
vi.mock('../components/ExpenseChart.jsx', () => ({
  default: () => <div data-testid="chart" />
}));

describe('App integration', () => {
  it('adds a transaction and shows advisor suggestion', async () => {
    const user = userEvent.setup();
    axios.post.mockResolvedValueOnce({ data: { suggestion: 'Advice here.' } });

    render(<App />);

    // Fill and submit form
    await user.type(screen.getByPlaceholderText(/amount/i), '123');
    await user.selectOptions(screen.getByDisplayValue('Gifts'), 'Decorations');
    await user.type(screen.getByPlaceholderText(/description/i), 'Lights');
    await user.click(screen.getByRole('button', { name: /add/i }));

    // Expect to see in list
    expect(await screen.findByText(/expense \| decorations \| 123/i)).toBeInTheDocument();

    // Click advisor
    await user.click(screen.getByRole('button', { name: /get ai budget advice/i }));
    expect(await screen.findByText(/advice here\./i)).toBeInTheDocument();
  });
});
