function GroupList({ groups, loading, error, selectedGroupId, onSelectGroup }) {
  return (
    <section className="card">
      <h3>Groups</h3>
      {loading ? <p className="muted">Loading groups...</p> : null}
      {error ? <p className="error">{error}</p> : null}

      {!loading && groups.length === 0 ? <p className="muted">No groups found.</p> : null}

      <ul className="group-list">
        {groups.map((group) => {
          const members = Array.isArray(group.members) ? group.members : [];
          return (
            <li key={group._id}>
              <button
                className={String(group._id) === String(selectedGroupId) ? 'group-button active' : 'group-button'}
                onClick={() => onSelectGroup(group._id)}
              >
                {group.name} ({members.length} members)
              </button>
              <p className="muted">
                {members.length
                  ? members
                      .map((member) => member?.name || member?.email || member?._id || String(member))
                      .join(', ')
                  : 'No members'}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default GroupList;
