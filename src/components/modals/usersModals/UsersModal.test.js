import '@testing-library/jest-dom';
import React, { act } from 'react';
import { render, screen } from '@testing-library/react';
import UsersModal from './UsersModal';

// Mock dependencies
jest.mock('../../protected/ProtectedRoute', () => ({ children }) => <div>{children}</div>);
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

// Mock MobX observer
jest.mock('mobx-react', () => ({
  observer: (comp) => comp,
}));

jest.mock('../../../stores/UsersStore.js', () => ({
  get allUsers() { return []; },
  getAllUsers: jest.fn(),
}));
jest.mock('../../../stores/authStore', () => ({
  get token() { return 'fake-token'; },
}));

describe('UsersModal', () => {
  it('renders table headers and shows empty state when no users', () => {
    render(<UsersModal />);
    expect(screen.getByText('usersModal.table.headers.name')).toBeInTheDocument();
    expect(screen.getByText('usersModal.table.headers.userName')).toBeInTheDocument();
    expect(screen.getByText('usersModal.table.headers.email')).toBeInTheDocument();
    expect(screen.getByText('usersModal.table.headers.state')).toBeInTheDocument();
  });

  it('renders user rows when users exist', () => {
    const userStore = require('../../../stores/UsersStore.js');
    jest.spyOn(userStore, 'allUsers', 'get').mockReturnValue([
      { name: 'Test', userName: 'testuser', emailAddress: 'test@test.com', isActive: true }
    ]);
    render(<UsersModal />);
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('test@test.com')).toBeInTheDocument();
    expect(screen.getByText('usersModal.userStatus.active')).toBeInTheDocument();
  });
});