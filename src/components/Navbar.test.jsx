import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from './Navbar.jsx';
import { ThemeProvider } from '../context/ThemeContext.jsx';

afterEach(cleanup);

describe('Navbar', () => {
  it('opens its menu and closes it on Escape with focus returned to the toggle', async () => {
    const user = userEvent.setup();
    render(<ThemeProvider><Navbar /></ThemeProvider>);
    const toggle = screen.getByRole('button', { name: 'Open navigation menu' });

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard('{Escape}');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveFocus();
  });
});
