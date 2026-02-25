function ChatGroupList({ groups, activeGroupId, onSelectGroup, loading }) {
  return (
    <aside className="sidebar card">
      <h2>Groups</h2>
      {loading ? <p className="muted">Loading groups...</p> : null}

      {!loading && groups.length === 0 ? <p className="muted">No groups found.</p> : null}

      <ul className="group-list">
        {groups.map((group) => (
          <li key={group._id}>
            <button
              className={group._id === activeGroupId ? 'group-button active' : 'group-button'}
              onClick={() => onSelectGroup(group)}
            >
              # {group.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default ChatGroupList;
