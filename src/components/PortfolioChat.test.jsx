import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PortfolioChat from './PortfolioChat.jsx';

describe('PortfolioChat', () => {
  it('answers portfolio questions and declines unrelated topics', async () => {
    const user = userEvent.setup();
    render(<PortfolioChat />);

    await user.click(screen.getByRole('button', { name: 'Ask the portfolio assistant' }));
    await user.type(screen.getByRole('textbox', { name: 'Ask a question about this portfolio' }), 'What projects are featured?{enter}');
    expect(screen.getByText(/Discover Andhra Pradesh/)).toBeInTheDocument();

    await user.type(screen.getByRole('textbox', { name: 'Ask a question about this portfolio' }), 'Tell me a joke{enter}');
    expect(screen.getByText(/only answer questions about information on this portfolio/i)).toBeInTheDocument();
  });
});
