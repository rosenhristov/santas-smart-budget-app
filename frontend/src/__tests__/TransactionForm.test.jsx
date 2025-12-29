import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TransactionForm from '../components/TransactionForm.jsx';

vi.mock('uuid', () => ({ v4: () => 'fixed-uuid' }));

describe('TransactionForm', () => {
  it('submits a new transaction and resets inputs', async () => {
    const onAdd = vi.fn();
    const user = userEvent.setup();

    render(<TransactionForm onAdd={onAdd} />);

    // Select element is a combobox; default is expense. Ensure we can interact if needed.
    const [typeSelect] = screen.getAllByRole('combobox');
    // Toggle to income then back to expense by value to verify control works
    await user.selectOptions(typeSelect, 'income');
    await user.selectOptions(typeSelect, 'expense');

    await user.type(screen.getByPlaceholderText(/amount/i), '123');
    await user.selectOptions(screen.getByDisplayValue('Gifts'), 'Decorations');
    await user.type(screen.getByPlaceholderText(/description/i), 'Lights');

    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(onAdd).toHaveBeenCalledTimes(1);
    const arg = onAdd.mock.calls[0][0];
    expect(arg).toMatchObject({
      id: 'fixed-uuid',
      type: 'expense',
      amount: 123,
      category: 'Decorations',
      description: 'Lights'
    });
    expect(typeof arg.date).toBe('string');

    // amount and description reset
    expect(screen.getByPlaceholderText(/amount/i)).toHaveValue(null);
    expect(screen.getByPlaceholderText(/description/i)).toHaveValue('');
  });
});
