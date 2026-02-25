import { useState } from 'react';

function AddUserForm({ loading, error, onCreateUser }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitError, setSubmitError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError('');

    try {
      await onCreateUser({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      setName('');
      setEmail('');
      setPassword('');
    } catch (createError) {
      setSubmitError(createError.message || 'Failed to create user');
    }
  }

  return (
    <section className="card">
      <h3>Add User</h3>
      <form className="form-grid" onSubmit={handleSubmit}>
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
        {submitError ? <p className="error">{submitError}</p> : null}

        <button type="submit" disabled={loading}>
          {loading ? 'Adding user...' : 'Add User'}
        </button>
      </form>
    </section>
  );
}

export default AddUserForm;
