import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import UsersRolesModal from './UsersRolesModal';

// Mock dependencies
jest.mock('../../../stores/AuthStore', () => ({
  get allRoles() { return null; },
  get token() { return 'fake-token'; },
  getAllRoles: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

jest.mock('mobx-react', () => ({
  observer: (comp) => comp,
}));

jest.mock('../../../stores/CreateModal', () => ({
  open: jest.fn(),
  close: jest.fn(),
}));

describe('UsersRolesModal', () => {
  it('renders loading state when roles are not loaded', () => {
    render(<UsersRolesModal />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('renders table header and roles when roles are available', () => {
    const authStore = require('../../../stores/AuthStore');
    jest.spyOn(authStore, 'allRoles', 'get').mockReturnValue([
      { id: '1', name: 'Admin' },
      { id: '2', name: 'User' },
    ]);

    render(<UsersRolesModal />);
    expect(screen.getByText('usersRolesModal.table.headers.roleName')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
  });

  it('calls createModal.open when edit button is clicked', () => {
    const authStore = require('../../../stores/AuthStore');
    const createModal = require('../../../stores/CreateModal');
    jest.spyOn(authStore, 'allRoles', 'get').mockReturnValue([
      { id: '1', name: 'Admin' },
    ]);

    render(<UsersRolesModal />);
    const editButton = screen.getByRole('button');
    editButton.click();
    expect(createModal.open).toHaveBeenCalled();
  });
});