import { useEffect, useMemo, useState } from 'react';
import { getGroups, getMessages, login, postMessage, registerOrgAdmin } from '../api';
import { createSocket } from '../socket';

const SESSION_KEY = 'chat_app_session';
const LAST_ORG_ID_KEY = 'chat_app_last_org_id';

export function useChatAppState() {
  const [session, setSession] = useState(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;

    try {
      return JSON.parse(stored);
    } catch (_error) {
      return null;
    }
  });

  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');

  const [groups, setGroups] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [activeGroup, setActiveGroup] = useState(null);

  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);

  const [socketStatus, setSocketStatus] = useState('disconnected');

  const socket = useMemo(() => {
    if (!session?.token) return null;
    return createSocket(session.token);
  }, [session?.token]);

  useEffect(() => {
    if (!session?.token) return;

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }, [session]);

  useEffect(() => {
    if (!socket) {
      setSocketStatus('disconnected');
      return;
    }

    function onConnect() {
      setSocketStatus('connected');
    }

    function onDisconnect() {
      setSocketStatus('disconnected');
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    if (!session?.token) return;

    let cancelled = false;

    async function loadGroups() {
      setGroupsLoading(true);
      try {
        const data = await getGroups(session.token);
        if (cancelled) return;

        const nextGroups = data.groups || [];
        setGroups(nextGroups);

        if (!nextGroups.length) {
          setActiveGroup(null);
          return;
        }

        setActiveGroup((current) => {
          if (!current) return nextGroups[0];
          const stillExists = nextGroups.find((group) => group._id === current._id);
          return stillExists || nextGroups[0];
        });
      } catch (_error) {
        if (!cancelled) {
          setGroups([]);
          setActiveGroup(null);
        }
      } finally {
        if (!cancelled) {
          setGroupsLoading(false);
        }
      }
    }

    loadGroups();

    return () => {
      cancelled = true;
    };
  }, [session?.token]);

  useEffect(() => {
    if (!session?.token || !activeGroup?._id) {
      setMessages([]);
      return;
    }

    let cancelled = false;

    async function loadMessages() {
      setMessagesLoading(true);
      try {
        const data = await getMessages(session.token, activeGroup._id);
        if (!cancelled) {
          setMessages(data.messages || []);
        }
      } catch (_error) {
        if (!cancelled) {
          setMessages([]);
        }
      } finally {
        if (!cancelled) {
          setMessagesLoading(false);
        }
      }
    }

    loadMessages();

    return () => {
      cancelled = true;
    };
  }, [session?.token, activeGroup?._id]);

  useEffect(() => {
    if (!socket || !activeGroup?._id) return;

    socket.emit('join_group', { groupId: activeGroup._id });

    function handleReceiveMessage(message) {
      if (String(message.groupId) !== String(activeGroup._id)) return;
      setMessages((current) => [...current, message]);
    }

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [socket, activeGroup?._id]);

  async function handleLogin(payload) {
    setLoginLoading(true);
    setLoginError('');
    setRegisterError('');

    try {
      const data = await login(payload);
      localStorage.setItem(LAST_ORG_ID_KEY, String(data.user?.orgId || payload.orgId).trim());
      setSession({ token: data.token, user: data.user });
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleRegister(payload) {
    setRegisterLoading(true);
    setRegisterError('');
    setLoginError('');

    try {
      const data = await registerOrgAdmin(payload);
      const orgId = String(data.organization?.id || data.user?.orgId || '').trim();
      if (orgId) {
        localStorage.setItem(LAST_ORG_ID_KEY, orgId);
      }
      setSession({ token: data.token, user: data.user });
    } catch (error) {
      setRegisterError(error.message);
    } finally {
      setRegisterLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
    setGroups([]);
    setActiveGroup(null);
    setMessages([]);
  }

  async function handleSendMessage(text) {
    if (!session?.token || !activeGroup?._id) return;

    setSendLoading(true);

    try {
      if (socket?.connected) {
        await new Promise((resolve, reject) => {
          socket.emit('send_message', { groupId: activeGroup._id, text }, (ack) => {
            if (!ack?.ok) {
              reject(new Error(ack?.error || 'Failed to send message'));
              return;
            }
            resolve(ack.message);
          });
        });
      } else {
        const data = await postMessage(session.token, activeGroup._id, text);
        setMessages((current) => [...current, data.message]);
      }
    } catch (_error) {
      // Keep UI minimal; no toast system in this evaluation build.
    } finally {
      setSendLoading(false);
    }
  }

  return {
    session,
    loginLoading,
    loginError,
    registerLoading,
    registerError,
    lastOrgId: localStorage.getItem(LAST_ORG_ID_KEY) || '',
    groups,
    groupsLoading,
    activeGroup,
    messages,
    messagesLoading,
    sendLoading,
    socketStatus,
    handleLogin,
    handleRegister,
    handleLogout,
    handleSendMessage,
    setActiveGroup,
  };
}
