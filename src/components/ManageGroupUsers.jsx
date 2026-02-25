function ManageGroupUsers({ group, users, loading, error, onAddUser, onRemoveUser }) {
  if (!group) {
    return (
      <section className="card">
        <h3>Manage Group Users</h3>
        <p className="muted">Select a group to manage users.</p>
      </section>
    );
  }

  const members = Array.isArray(group.members) ? group.members : [];
  const memberIds = new Set(
    members.map((member) => (member && typeof member === 'object' ? String(member._id) : String(member)))
  );
  const availableUsers = users.filter((user) => !memberIds.has(String(user._id)));

  return (
    <section className="card">
      <h3>Manage Group Users</h3>
      <p>
        <strong>{group.name}</strong>
      </p>

      {error ? <p className="error">{error}</p> : null}

      <h4>Members</h4>
      {members.length === 0 ? <p className="muted">No members yet.</p> : null}
      <ul className="group-list">
        {members.map((member) => {
          const id = member && typeof member === 'object' ? member._id : member;
          const name = member && typeof member === 'object' ? member.name || member.email : String(member);
          return (
            <li key={String(id)}>
              <span>{name}</span>{' '}
              <button type="button" onClick={() => onRemoveUser(String(id))} disabled={loading}>
                Remove
              </button>
            </li>
          );
        })}
      </ul>

      <h4>Available Users</h4>
      {availableUsers.length === 0 ? <p className="muted">No users available to add.</p> : null}
      <ul className="group-list">
        {availableUsers.map((user) => (
          <li key={user._id}>
            <span>
              {user.name} ({user.email})
            </span>{' '}
            <button type="button" onClick={() => onAddUser(user._id)} disabled={loading}>
              Add
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ManageGroupUsers;
