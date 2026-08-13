import { Send, CheckCircle2, Clock, DollarSign, FileText } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectCurrentToken } from '../features/auth/authSlice';
import { 
  useGetConversationsQuery, 
  useGetMessagesQuery, 
  useGetOrCreateConversationMutation,
  useProposeTermsMutation,
  useToggleConfirmationMutation
} from '../features/chat/chatApiSlice';
import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSocket } from '../hooks/useSocket';

export default function ChatPage() {
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);
  const isProvider = user?.role === 'provider';
  
  const [searchParams, setSearchParams] = useSearchParams();
  const initialJobId = searchParams.get('jobId');
  const initialClientId = searchParams.get('clientId');

  const { data: conversationsData, isLoading: isLoadingConversations, refetch: refetchConversations } = useGetConversationsQuery(undefined);
  const conversations = conversationsData?.conversations || [];

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  
  const { data: messagesData, isLoading: isLoadingMessages } = useGetMessagesQuery(activeConversationId, {
    skip: !activeConversationId,
  });
  
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  
  const [createConversation] = useGetOrCreateConversationMutation();
  const [proposeTerms] = useProposeTermsMutation();
  const [toggleConfirm] = useToggleConfirmationMutation();
  
  const { socket, isConnected } = useSocket(token);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConvDetails = conversations.find((c: any) => c._id === activeConversationId);
  
  // Job Card State
  const [budgetInput, setBudgetInput] = useState("");
  const [timeInput, setTimeInput] = useState("");
  
  // Date and Time picker states (matching CreateJobForm)
  const [selectedDate, setSelectedDate] = useState('');
  const [scheduleType, setScheduleType] = useState<'specific' | 'range'>('specific');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const formatTimeString = (timeString: string) => {
    if (!timeString) return '';
    const [hourStr, minStr] = timeString.split(':');
    const hours = parseInt(hourStr);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minStr} ${ampm}`;
  };

  useEffect(() => {
    if (!selectedDate) return;
    
    const [year, month, day] = selectedDate.split('-');
    const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    if (scheduleType === 'specific') {
      if (startTime) {
        const formattedStart = formatTimeString(startTime);
        setTimeInput(`${formattedDate} at ${formattedStart}`);
      }
    } else {
      if (startTime && endTime) {
        const formattedStart = formatTimeString(startTime);
        const formattedEnd = formatTimeString(endTime);
        setTimeInput(`${formattedDate} from ${formattedStart} to ${formattedEnd}`);
      }
    }
  }, [selectedDate, scheduleType, startTime, endTime]);

  useEffect(() => {
    if (activeConvDetails) {
      const budget = activeConvDetails.proposedBudget ?? activeConvDetails.jobId?.budget ?? "";
      const time = activeConvDetails.proposedTime ?? activeConvDetails.jobId?.time ?? "";
      setBudgetInput(budget.toString());
      setTimeInput(time);
    }
  }, [activeConvDetails]);

  // Initialize chat from query params (e.g. from JobDetailedView)
  useEffect(() => {
    const initChat = async () => {
      if (initialJobId && initialClientId && user) {
        try {
          const res = await createConversation({
            jobId: initialJobId,
            clientId: initialClientId,
            providerId: isProvider ? user.id : undefined // The backend expects providerId. If user is client, they shouldn't initiate this way unless they know provider. Wait, the flow is Provider clicks "Chat and Book".
          }).unwrap();
          
          const conversationId = res.conversation?._id || res.data?.conversation?._id;
          if (conversationId) {
            setActiveConversationId(conversationId);
          }
          refetchConversations();
          
          // Clear params so it doesn't re-trigger
          setSearchParams({});
        } catch (error) {
          console.error("Failed to create conversation:", error);
        }
      }
    };
    initChat();
  }, [initialJobId, initialClientId, user, createConversation, isProvider, setSearchParams, refetchConversations]);

  // Load messages when query finishes
  useEffect(() => {
    if (messagesData?.messages) {
      setMessages(messagesData.messages);
    }
  }, [messagesData]);

  // Socket logic
  useEffect(() => {
    if (socket && activeConversationId) {
      socket.emit("join_chat", activeConversationId);

      socket.on("receive_message", (message: any) => {
        setMessages((prev) => [...prev, message]);
      });

      socket.on("terms_updated", () => {
        refetchConversations();
      });

      return () => {
        socket.emit("leave_chat", activeConversationId);
        socket.off("receive_message");
        socket.off("terms_updated");
      };
    }
  }, [socket, activeConversationId, refetchConversations]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversationId || !socket) return;

    // Determine receiverId. It's the other participant.
    const currentConv = conversations.find((c: any) => c._id === activeConversationId);
    let receiverId = "";
    if (currentConv) {
      receiverId = isProvider ? currentConv.clientId._id : currentConv.providerId._id;
    }

    socket.emit("send_message", {
      conversationId: activeConversationId,
      receiverId,
      content: newMessage,
    });

    setNewMessage("");
  };

  const handleUpdateTerms = async () => {
    if (!activeConversationId) return;
    try {
      await proposeTerms({
        conversationId: activeConversationId,
        budget: Number(budgetInput),
        time: timeInput
      }).unwrap();
      socket?.emit("terms_updated", activeConversationId);
      refetchConversations();
    } catch (err) {
      console.error("Failed to update terms", err);
    }
  };

  const handleToggleConfirm = async () => {
    if (!activeConversationId) return;
    try {
      await toggleConfirm(activeConversationId).unwrap();
      socket?.emit("terms_updated", activeConversationId);
      refetchConversations();
    } catch (err) {
      console.error("Failed to toggle confirm", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-4rem)] p-4 flex flex-col lg:flex-row gap-4">
      {/* Left Column - Chat List */}
      <div className="w-full lg:w-1/4 bg-white border border-gray-200 rounded-2xl flex flex-col overflow-hidden shadow-sm h-[30vh] lg:h-full">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Conversations</h2>
          <span className={`text-xs ${isConnected ? 'text-green-600' : 'text-red-500'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
          {isLoadingConversations ? (
            <div className="text-center py-4 text-gray-500 font-medium">Loading chats...</div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-4 text-gray-500 font-medium">No active conversations.</div>
          ) : (
            conversations.map((conv: any) => {
              const otherUser = isProvider ? conv.clientId : conv.providerId;
              const isActive = activeConversationId === conv._id;

              return (
                <div 
                  key={conv._id} 
                  onClick={() => setActiveConversationId(conv._id)}
                  className={`p-4 border rounded-xl hover:border-blue-300 hover:shadow-md transition cursor-pointer group ${isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-100 bg-white'}`}
                >
                   <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                     {conv.jobId?.title || 'Unknown Job'}
                   </h3>
                   <div className="text-sm text-gray-500 mt-2 flex justify-between items-center">
                     <span className="font-medium truncate mr-2">With: {otherUser?.name || 'Unknown'}</span>
                   </div>
                   {conv.lastMessage && (
                     <p className="text-xs text-gray-400 mt-2 truncate">{conv.lastMessage}</p>
                   )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Center Column - Active Chat */}
      <div className="flex-1 bg-white border border-gray-200 rounded-2xl flex flex-col shadow-sm h-[50vh] lg:h-full overflow-hidden">
        {!activeConversationId ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a conversation to start chatting
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 rounded-full flex items-center justify-center font-bold text-base shadow-sm border border-blue-200">
                  {(isProvider ? activeConvDetails?.clientId?.name?.[0] : activeConvDetails?.providerId?.name?.[0]) || 'U'}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">
                    {isProvider ? activeConvDetails?.clientId?.name : activeConvDetails?.providerId?.name}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium truncate max-w-[200px] sm:max-w-xs">
                    Job: {activeConvDetails?.jobId?.title}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50/50 space-y-4">
              {isLoadingMessages ? (
                <div className="text-center text-gray-500">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-400 mt-10">No messages yet. Say hi!</div>
              ) : (
                messages.map((msg: any) => {
                  const isMine = msg.senderId?._id === user?.id || msg.senderId === user?.id;
                  return (
                    <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-3.5 rounded-2xl max-w-[85%] text-sm shadow-sm ${isMine ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'}`}>
                        <p>{msg.content}</p>
                        <span className={`text-[10px] mt-1.5 block font-medium ${isMine ? 'text-blue-200 text-right' : 'text-gray-400'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-100 bg-white">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..." 
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-700 text-sm font-medium"
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-3 rounded-xl shadow-md shadow-blue-200 transition-all active:scale-95 flex items-center justify-center"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      {/* Right Column - Job Card Negotiation / Service Agreement */}
      <div className="w-full lg:w-1/3 bg-white border border-gray-200 rounded-2xl flex flex-col shadow-sm h-auto lg:h-full overflow-y-auto">
        {!activeConversationId ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 p-6 text-center">
            Select a conversation to view job terms & negotiation
          </div>
        ) : (
          <div className="p-5 flex flex-col h-full">
            <div className="border-b border-gray-100 pb-3 mb-4 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Job Details & Terms
              </h3>
              <span className={`text-[11px] font-bold uppercase px-2.5 py-1 rounded-full ${
                activeConvDetails?.agreementId ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {activeConvDetails?.agreementId ? 'Agreement Locked' : 'Negotiation'}
              </span>
            </div>

            {activeConvDetails?.agreementId ? (
              // Service Agreement Locked State
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 p-4 rounded-xl shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-green-100 p-2 rounded-lg text-green-700">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-green-900">Service Agreement Confirmed</h4>
                      <p className="text-xs text-green-700 mt-0.5">Terms are locked in</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm pt-2 border-t border-green-200">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Agreed Budget:</span>
                      <span className="font-bold text-gray-900 flex items-center"><DollarSign className="w-4 h-4 text-green-600" />{activeConvDetails.proposedBudget}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600 font-medium">Agreed Schedule:</span>
                      <span className="font-bold text-gray-900 text-right max-w-[180px]">{activeConvDetails.proposedTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Negotiation State
              <div className="flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  {/* Budget Input */}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Budget ($)</label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input 
                        type="number" 
                        value={budgetInput}
                        onChange={(e) => setBudgetInput(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 font-medium bg-gray-50 text-sm"
                      />
                    </div>
                  </div>

                  {/* Schedule Picker */}
                  <div className="space-y-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                    <span className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Job Schedule</span>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 mb-1">Select Date</label>
                        <input 
                          type="date" 
                          min={new Date().toISOString().split('T')[0]}
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border text-xs text-gray-700 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 mb-1">Schedule Type</label>
                        <select 
                          value={scheduleType}
                          onChange={(e) => {
                            setScheduleType(e.target.value as 'specific' | 'range');
                            setEndTime('');
                          }}
                          className="w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border text-xs text-gray-700 bg-white"
                        >
                          <option value="specific">Specific Time</option>
                          <option value="range">Time Range</option>
                        </select>
                      </div>

                      {scheduleType === 'specific' ? (
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-500 mb-1">Start Time</label>
                          <input 
                            type="time" 
                            step="1800"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border text-xs text-gray-700 bg-white"
                          />
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-500 mb-1">Start Time</label>
                            <input 
                              type="time" 
                            step="1800"
                              value={startTime}
                              onChange={(e) => setStartTime(e.target.value)}
                              className="w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border text-xs text-gray-700 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-500 mb-1">End Time</label>
                            <input 
                              type="time" 
                            step="1800"
                              value={endTime}
                              onChange={(e) => setEndTime(e.target.value)}
                              className="w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border text-xs text-gray-700 bg-white"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {timeInput && (
                      <div className="p-2 bg-blue-50 border border-blue-100 rounded-lg text-xs font-medium text-blue-700 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                        <span className="truncate">Schedule: <strong>{timeInput}</strong></span>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={handleUpdateTerms}
                    disabled={budgetInput == (activeConvDetails?.proposedBudget ?? activeConvDetails?.jobId?.budget)?.toString() && timeInput == (activeConvDetails?.proposedTime ?? activeConvDetails?.jobId?.time)}
                    className="w-full text-xs bg-blue-50 text-blue-600 font-bold py-2.5 rounded-xl hover:bg-blue-100 disabled:opacity-50 border border-blue-200 transition-colors"
                  >
                    Update Proposed Terms
                  </button>
                </div>

                {/* Confirmations Checklist */}
                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <div className="text-xs space-y-2">
                    <div className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                      <span className="text-gray-600 font-medium">Your Confirmation</span>
                      {(isProvider ? activeConvDetails?.providerConfirmed : activeConvDetails?.clientConfirmed) ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border-2 border-gray-300"></span>
                      )}
                    </div>
                    <div className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                      <span className="text-gray-600 font-medium">Their Confirmation</span>
                      {(isProvider ? activeConvDetails?.clientConfirmed : activeConvDetails?.providerConfirmed) ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border-2 border-gray-300"></span>
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={handleToggleConfirm}
                    className={`w-full py-3 rounded-xl font-bold text-sm shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 ${
                      (isProvider ? activeConvDetails?.providerConfirmed : activeConvDetails?.clientConfirmed) 
                        ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' 
                        : 'bg-green-600 text-white hover:bg-green-700 shadow-green-200'
                    }`}
                  >
                    {(isProvider ? activeConvDetails?.providerConfirmed : activeConvDetails?.clientConfirmed) ? 'Revoke Confirmation' : 'Confirm Terms'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
