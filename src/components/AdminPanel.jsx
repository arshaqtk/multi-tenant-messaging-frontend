import { useEffect, useMemo, useState } from 'react';
import {
  addUserToGroup,
  createGroup,
  createOrgUser,
  fetchGroups,
  fetchUsers,
  removeUserFromGroup,
} from '../services/api';
import AddUserForm from './AddUserForm';
import CreateGroup from './CreateGroup';
import GroupList from './GroupList';
import ManageGroupUsers from './ManageGroupUsers';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      let nextUsers = [];
      try {
        const usersData = await fetchUsers();
        nextUsers = usersData?.users || usersData?.data || [];
      } catch (usersError) {
        setError(usersError.message || 'Users route is not available');
      }

      const groupsData = await fetchGroups();
      const nextGroups = groupsData?.groups || groupsData?.data || [];

      setUsers(nextUsers);
      setGroups(nextGroups);
      setSelectedGroupId((current) => {
        if (!nextGroups.length) return '';
        const exists = nextGroups.some((group) => String(group._id) === String(current));
        return exists ? current : String(nextGroups[0]._id);
      });
    } catch (loadError) {
      setError(loadError.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const selectedGroup = useMemo(
    () => groups.find((group) => String(group._id) === String(selectedGroupId)) || null,
    [groups, selectedGroupId]
  );

  async function handleCreateGroup(payload) {
    if (!payload?.name) return;

    setLoading(true);
    setError('');
    try {
      const created = await createGroup({ name: payload.name });
      const newGroupId = created?.group?._id || created?._id;

      for (const userId of payload.memberIds || []) {
        await addUserToGroup(newGroupId, userId);
      }

      await loadData();
    } catch (createError) {
      setError(createError.message || 'Failed to create group');
      throw createError;
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateUser(payload) {
    setLoading(true);
    setError('');
    try {
      await createOrgUser(payload);
      await loadData();
    } catch (createError) {
      setError(createError.message || 'Failed to create user');
      throw createError;
    } finally {
      setLoading(false);
    }
  }

  async function handleAddUser(userId) {
    if (!selectedGroup?._id) return;
    setLoading(true);
    setError('');
    try {
      await addUserToGroup(selectedGroup._id, userId);
      await loadData();
    } catch (actionError) {
      setError(actionError.message || 'Failed to add user');
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveUser(userId) {
    if (!selectedGroup?._id) return;
    setLoading(true);
    setError('');
    try {
      await removeUserFromGroup(selectedGroup._id, userId);
      await loadData();
    } catch (actionError) {
      setError(actionError.message || 'Failed to remove user');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="content-grid">
      <div className="form-grid">
        <AddUserForm loading={loading} error={error} onCreateUser={handleCreateUser} />
        <CreateGroup users={users} loading={loading} error={error} onCreate={handleCreateGroup} />
        <GroupList
          groups={groups}
          loading={loading}
          error={error}
          selectedGroupId={selectedGroupId}
          onSelectGroup={setSelectedGroupId}
        />
      </div>

      <ManageGroupUsers
        group={selectedGroup}
        users={users}
        loading={loading}
        error={error}
        onAddUser={handleAddUser}
        onRemoveUser={handleRemoveUser}
      />
    </div>
  );
}

export default AdminPanel;
