"use client";

import { useEffect, useState } from "react";
import AdminStatsCard from "@/components/AdminStatsCard/AdminStatsCard";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    articles: 0,
    projects: 0,
    messages: 0,
    admins: 0,
    totalViews: 0,
    unreadMessages: 0,
    readMessages: 0,
  });

  useEffect(() => {
    // Simulate data fetching
    const fetchStats = async () => {
      // This would be replaced with actual API calls
      setStats({
        articles: 24,
        projects: 12,
        messages: 8,
        admins: 3,
        totalViews: 15420,
        unreadMessages: 3,
        readMessages: 5,
      });
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">


      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <AdminStatsCard
          title="Articles"
          value={stats.articles}
          type="articles"
        />
        <AdminStatsCard
          title="Projects"
          value={stats.projects}
          type="projects"
        />
        <AdminStatsCard
          title="Messages"
          value={stats.messages}
          type="messages"
        />
        <AdminStatsCard
          title="Admins"
          value={stats.admins}
          type="admins"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        <AdminStatsCard
          title="Total Views"
          value={stats.totalViews}
          type="views"
        />
        <AdminStatsCard
          title="Unread Messages"
          value={stats.unreadMessages}
          type="unread"
        />
        <AdminStatsCard
          title="Read Messages"
          value={stats.readMessages}
          type="read"
        />
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-200">
            <div>
              <p className="font-medium text-gray-900">New article published</p>
              <p className="text-sm text-gray-600">2 hours ago</p>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Published</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-200">
            <div>
              <p className="font-medium text-gray-900">New message received</p>
              <p className="text-sm text-gray-600">4 hours ago</p>
            </div>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">New</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-gray-900">Project updated</p>
              <p className="text-sm text-gray-600">1 day ago</p>
            </div>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Updated</span>
          </div>
        </div>
      </div>
    </div>
  );
}