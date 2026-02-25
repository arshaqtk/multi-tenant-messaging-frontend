import { Link } from 'react-router-dom';

function AppHeader({ user, role, onLogout }) {
  return (
    <header className="topbar card">
      <div>
        <strong>{user?.name}</strong>
        <p className="muted">
          {user?.email} | role: {role}
        </p>
      </div>
      <div>
        <Link to="/chat">Chat</Link>{' '}
        {role === 'admin' ? <Link to="/admin">Admin</Link> : null}{' '}
        <button onClick={onLogout}>Logout</button>
      </div>
    </header>
  );
}

export default AppHeader;
