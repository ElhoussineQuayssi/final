"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Trash2, Search, Mail } from "lucide-react";

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    const fetchMessages = async () => {
      // This would be replaced with actual API calls
      const mockMessages = [
        { id: 1, name: "John Doe", email: "john@example.com", subject: "Project Inquiry", isRead: false, createdAt: "2023-01-15T10:30:00Z" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", subject: "Collaboration Request", isRead: true, createdAt: "2023-02-10T14:20:00Z" },
        { id: 3, name: "Bob Johnson", email: "bob@example.com", subject: "Support Question", isRead: false, createdAt: "2023-03-05T09:15:00Z" },
      ];
      setMessages(mockMessages);
      setLoading(false);
    };

    fetchMessages();
  }, []);

  const filteredMessages = messages.filter(message =>
    message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this message?")) {
      // This would be replaced with actual API call
      setMessages(messages.filter(message => message.id !== id));
    }
  };

  const markAsRead = async (id) => {
    // This would be replaced with actual API call
    setMessages(messages.map(msg =>
      msg.id === id ? { ...msg, isRead: true } : msg
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">Manage contact form submissions and inquiries</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
          {filteredMessages.map((message) => (
            <div key={message.id} className={`p-6 hover:bg-gray-50 ${!message.isRead ? 'bg-blue-50' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <Mail className={`h-5 w-5 ${!message.isRead ? 'text-blue-600' : 'text-gray-400'}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${!message.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                        {message.subject}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        From: {message.name} ({message.email})
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">
                      {new Date(message.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  {!message.isRead && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      New
                    </span>
                  )}
                  <Link
                    href={`/admin/messages/${message.id}`}
                    onClick={() => markAsRead(message.id)}
                    className="text-blue-600 hover:text-blue-900 p-1"
                  >
                    <Eye className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(message.id)}
                    className="text-red-600 hover:text-red-900 p-1"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMessages.length === 0 && (
          <div className="text-center py-12">
            <Mail className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No messages</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by receiving your first message.</p>
          </div>
        )}
      </div>

      {/* Pagination placeholder */}
      <div className="flex justify-center">
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
          <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            Previous
          </button>
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
            1
          </button>
          <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            Next
          </button>
        </nav>
      </div>
    </div>
  );
}