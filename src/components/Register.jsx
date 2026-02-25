import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
  const { register, loading, error } = useAuth();
  const [organizationName, setOrganizationName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    const result = await register({
      organizationName: organizationName.trim(),
      name: name.trim(),
      email: email.trim(),
      password,
    });
    if (result.ok) {
      navigate('/login');
    }
  }

  return (
    <main className="app auth-layout">
      <section className="card auth-card">
        <h1>Register</h1>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Organization Name
            <input
              value={organizationName}
              onChange={(event) => setOrganizationName(event.target.value)}
              required
            />
          </label>
          <label>
            Name
            <input value={name} onChange={(event) => setName(event.target.value)} required />
          </label>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              required
            />
          </label>
          {error ? <p className="error">{error}</p> : null}
          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="muted">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </section>
    </main>
  );
}

export default Register;
