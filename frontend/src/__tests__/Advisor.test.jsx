import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Advisor from '../components/Advisor.jsx';

vi.mock('axios', () => ({
  default: { post: vi.fn() }
}));

import axios from 'axios';

describe('Advisor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sends transactions and renders suggestion on success', async () => {
    axios.post.mockResolvedValueOnce({ data: { suggestion: 'Balanced spending tip.' } });

    render(<Advisor transactions={[{ id: '1', type: 'expense', category: 'Decorations', amount: 100 }]} />);

    await userEvent.click(screen.getByRole('button', { name: /get ai budget advice/i }));

    expect(axios.post).toHaveBeenCalledWith('http://localhost:4000/advisor', [
      { id: '1', type: 'expense', category: 'Decorations', amount: 100 }
    ]);

    expect(await screen.findByText(/balanced spending tip\./i)).toBeInTheDocument();
  });

  it('shows error text on request failure', async () => {
    axios.post.mockRejectedValueOnce(new Error('Network error'));

    render(<Advisor transactions={[]} />);

    await userEvent.click(screen.getByRole('button', { name: /get ai budget advice/i }));

    expect(await screen.findByText(/error fetching advice/i)).toBeInTheDocument();
  });
});
