"use client";

import { useState, useEffect } from 'react';
import supabase from '@/utils/supabase/client';

export default function TestPage() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Check auth status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Run API test
    fetch('/api/test')
      .then(res => res.json())
      .then(data => {
        setResults(data);
        setLoading(false);
      })
      .catch(error => {
        setResults({ error: error.message });
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-4">Running Supabase integration tests...</div>;
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Supabase Integration Test Results</h1>
      
      <div className="space-y-4">
        <h2 className="text-xl">Environment Check</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(results?.tests?.environment, null, 2)}
        </pre>

        <h2 className="text-xl">Authentication Status</h2>
        <div className="bg-gray-100 p-4 rounded">
          {session ? (
            <div>
              <p>✅ Logged in as: {session.user.email}</p>
              <p>Role: {session.user.user_metadata?.role || 'No role set'}</p>
            </div>
          ) : (
            <p>Not logged in</p>
          )}
        </div>

        <h2 className="text-xl">JWT Test Results</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(results?.tests?.authentication, null, 2)}
        </pre>

        <h2 className="text-xl">Database Connection</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(results?.tests?.database, null, 2)}
        </pre>
      </div>

      <div className="mt-8 text-sm text-gray-600">
        <p>Test completed at: {results?.timestamp}</p>
      </div>
    </div>
  );
}