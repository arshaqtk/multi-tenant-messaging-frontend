import { useState } from 'react';

function LoginForm({
  onLogin,
  onRegister,
  loginError,
  loginLoading,
  registerError,
  registerLoading,
  lastOrgId,
}) {
  const [mode, setMode] = useState('login');
  const [orgId, setOrgId] = useState(lastOrgId || '');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [name, setName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  function handleLoginSubmit(event) {
    event.preventDefault();
    onLogin({ orgId: orgId.trim(), email: loginEmail.trim(), password: loginPassword });
  }

  function handleRegisterSubmit(event) {
    event.preventDefault();
    onRegister({
      organizationName: organizationName.trim(),
      name: name.trim(),
      email: registerEmail.trim(),
      password: registerPassword,
    });
  }

  return (
    <div className="card auth-card">
      <h1>Messaging App</h1>
      <p className="muted">Use your organization credentials, or create a new organization.</p>

      <div className="auth-switch">
        <button
          type="button"
          className={mode === 'login' ? 'switch-button active' : 'switch-button'}
          onClick={() => setMode('login')}
        >
          Login
        </button>
        <button
          type="button"
          className={mode === 'register' ? 'switch-button active' : 'switch-button'}
          onClick={() => setMode('register')}
        >
          Register Organization
        </button>
      </div>

      {mode === 'login' ? (
        <form onSubmit={handleLoginSubmit} className="form-grid">
          <label>
            Organization ID
            <input
              value={orgId}
              onChange={(event) => setOrgId(event.target.value)}
              placeholder="orgId"
              required
            />
          </label>
          <p className="muted">
            Ask your admin for your Organization ID.
            {lastOrgId ? ` Last used org: ${lastOrgId}` : ''}
          </p>

          <label>
            Email
            <input
              type="email"
              value={loginEmail}
              onChange={(event) => setLoginEmail(event.target.value)}
              placeholder="name@company.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={loginPassword}
              onChange={(event) => setLoginPassword(event.target.value)}
              placeholder="********"
              required
            />
          </label>

          {loginError ? <p className="error">{loginError}</p> : null}

          <button disabled={loginLoading} type="submit">
            {loginLoading ? 'Signing in...' : 'Login'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleRegisterSubmit} className="form-grid">
          <label>
            Organization Name
            <input
              value={organizationName}
              onChange={(event) => setOrganizationName(event.target.value)}
              placeholder="Acme Inc"
              required
            />
          </label>

          <label>
            Admin Name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Jane Doe"
              required
            />
          </label>

          <label>
            Admin Email
            <input
              type="email"
              value={registerEmail}
              onChange={(event) => setRegisterEmail(event.target.value)}
              placeholder="admin@company.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={registerPassword}
              onChange={(event) => setRegisterPassword(event.target.value)}
              placeholder="Minimum 8 characters"
              minLength={8}
              required
            />
          </label>

          {registerError ? <p className="error">{registerError}</p> : null}

          <button disabled={registerLoading} type="submit">
            {registerLoading ? 'Creating organization...' : 'Register & Continue'}
          </button>
        </form>
      )}
    </div>
  );
}

export default LoginForm;
