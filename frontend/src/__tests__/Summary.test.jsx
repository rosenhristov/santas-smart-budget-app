import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Summary from '../components/Summary.jsx';

describe('Summary', () => {
  it('computes and displays income, expenses, and balance', () => {
    const transactions = [
      { id: '1', type: 'income', amount: 1000 },
      { id: '2', type: 'expense', amount: 300 },
      { id: '3', type: 'expense', amount: 200 },
      { id: '4', type: 'income', amount: 50 },
    ];

    render(<Summary transactions={transactions} />);

    expect(screen.getByText(/total income:\s*1050/i)).toBeInTheDocument();
    expect(screen.getByText(/total expenses:\s*500/i)).toBeInTheDocument();
    expect(screen.getByText(/balance:\s*550/i)).toBeInTheDocument();
  });
});
