import { useEffect, useMemo, useState } from 'react';
import { fetchGroupMessages, fetchGroups, sendGroupMessage } from '../services/api';
import { createSocket } from '../socket';
import { useAuth } from '../context/AuthContext';
import ChatWorkspace from './ChatWorkspace';

function ChatPage() {
  const { token } = useAuth();
  const [groups, setGroups] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [groupsError, setGroupsError] = useState('');
  const [activeGroup, setActiveGroup] = useState(null);

  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [socketStatus, setSocketStatus] = useState('disconnected');
  const [socketError, setSocketError] = useState('');

  const socket = useMemo(() => {
    if (!token) return null;
    return createSocket(token);
  }, [token]);

  function appendUniqueMessage(message) {
    setMessages((current) => {
      if (!message?._id) return [...current, message];
      if (current.some((item) => String(item?._id) === String(message._id))) {
        return current;
      }
      return [...current, message];
    });
  }

  useEffect(() => {
    let cancelled = false;

    async function loadGroups() {
      setGroupsLoading(true);
      setGroupsError('');
      try {
        const data = await fetchGroups();
        if (cancelled) return;
        const nextGroups = data?.groups || data?.data || [];
        setGroups(nextGroups);
        setActiveGroup((current) => {
          if (!nextGroups.length) return null;
          if (!current) return nextGroups[0];
          const exists = nextGroups.find((group) => String(group._id) === String(current._id));
          return exists || nextGroups[0];
        });
      } catch (error) {
        if (!cancelled) {
          setGroupsError(error.message || 'Failed to load groups');
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
  }, []);

  useEffect(() => {
    if (!socket) return;

    setSocketStatus(socket.connected ? 'connected' : 'connecting');

    function onConnect() {
      setSocketStatus('connected');
      setSocketError('');
    }

    function onDisconnect() {
      setSocketStatus('disconnected');
    }

    function onConnectError(error) {
      setSocketStatus('disconnected');
      setSocketError(error?.message || 'Socket connection failed');
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.connect();

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    if (!activeGroup?._id) {
      setMessages([]);
      return;
    }

    let cancelled = false;

    setMessagesLoading(true);
    setSocketError('');

    async function loadMessages() {
      try {
        const data = await fetchGroupMessages(activeGroup._id);
        if (cancelled) return;
        setMessages(data?.messages || []);
      } catch (error) {
        if (!cancelled) {
          setSocketError(error.message || 'Failed to load messages');
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
  }, [activeGroup?._id]);

  useEffect(() => {
    if (!socket || !activeGroup?._id) return;

    socket.emit('join_group', { groupId: activeGroup._id });

    function onReceive(message) {
      if (String(message?.groupId) !== String(activeGroup._id)) return;
      appendUniqueMessage(message);
    }

    socket.on('receive_message', onReceive);

    return () => {
      socket.off('receive_message', onReceive);
    };
  }, [socket, activeGroup?._id]);

  async function handleSendMessage(text) {
    if (!activeGroup?._id) return;
    setSendLoading(true);
    setSocketError('');
    try {
      if (socket?.connected) {
        await new Promise((resolve, reject) => {
          socket.emit('send_message', { groupId: activeGroup._id, text }, (ack) => {
            if (!ack?.ok) {
              reject(new Error(ack?.error || 'Failed to send message'));
              return;
            }
            appendUniqueMessage(ack?.message);
            resolve();
          });
        });
      } else {
        const data = await sendGroupMessage(activeGroup._id, text);
        appendUniqueMessage(data?.message);
      }
    } catch (error) {
      setSocketError(error.message || 'Failed to send message');
    } finally {
      setSendLoading(false);
    }
  }

  return (
    <>
      {groupsError ? <p className="error">{groupsError}</p> : null}
      {socketError ? <p className="error">Socket: {socketError}</p> : null}
      <ChatWorkspace
        groups={groups}
        groupsLoading={groupsLoading}
        activeGroup={activeGroup}
        onSelectGroup={setActiveGroup}
        messages={messages}
        messagesLoading={messagesLoading}
        onSendMessage={handleSendMessage}
        sendLoading={sendLoading}
        socketStatus={socketStatus}
      />
    </>
  );
}

export default ChatPage;
