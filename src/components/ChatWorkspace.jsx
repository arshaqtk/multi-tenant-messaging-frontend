import ChatGroupList from './ChatGroupList';
import ChatPanel from './ChatPanel';

function ChatWorkspace({
  groups,
  groupsLoading,
  activeGroup,
  onSelectGroup,
  messages,
  messagesLoading,
  onSendMessage,
  sendLoading,
  socketStatus,
}) {
  return (
    <div className="content-grid">
      <ChatGroupList
        groups={groups}
        loading={groupsLoading}
        activeGroupId={activeGroup?._id}
        onSelectGroup={onSelectGroup}
      />

      <ChatPanel
        activeGroup={activeGroup}
        messages={messages}
        loadingMessages={messagesLoading}
        onSendMessage={onSendMessage}
        sending={sendLoading}
        socketStatus={socketStatus}
      />
    </div>
  );
}

export default ChatWorkspace;
