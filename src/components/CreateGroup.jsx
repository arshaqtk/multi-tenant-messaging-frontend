import { useState } from 'react';

function CreateGroup({ users, loading, error, onCreate }) {
  const [name, setName] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [submitError, setSubmitError] = useState('');

  function toggleUser(userId) {
    setSelectedUserIds((current) => {
      if (current.includes(userId)) {
        return current.filter((id) => id !== userId);
      }
      return [...current, userId];
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError('');

    try {
      await onCreate({ name: name.trim(), memberIds: selectedUserIds });
      setName('');
      setSelectedUserIds([]);
    } catch (createError) {
      setSubmitError(createError.message || 'Failed to create group');
      return;
    }
  }

  return (
    <section className="card">
      <h3>Create Group</h3>
      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          Group Name
          <input value={name} onChange={(event) => setName(event.target.value)} required />
        </label>

        <fieldset>
          <legend>Initial Members (optional)</legend>
          {users.map((user) => (
            <label key={user._id}>
              <input
                type="checkbox"
                checked={selectedUserIds.includes(user._id)}
                onChange={() => toggleUser(user._id)}
              />
              {user.name} ({user.email})
            </label>
          ))}
        </fieldset>

        {error ? <p className="error">{error}</p> : null}
        {submitError ? <p className="error">{submitError}</p> : null}

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Group'}
        </button>
      </form>
    </section>
  );
}

export default CreateGroup;
