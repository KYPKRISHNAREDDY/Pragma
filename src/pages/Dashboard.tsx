import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import type { Child } from '../types';
import { localDB } from '../services/localStorage';
import ChildCard from '../components/ChildCard';
import AddChildModal from '../components/AddChildModal';

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddChild, setShowAddChild] = useState(false);

  useEffect(() => {
    if (user) {
      fetchChildren();
    }
  }, [user]);

  const fetchChildren = () => {
    try {
      const data = localDB.getChildren(user!.userId);
      setChildren(data);
    } catch (error) {
      console.error('Error fetching children:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSelectChild = (childId: string) => {
    navigate(`/child/${childId}`);
  };

  const handleEditChild = (childId: string) => {
    navigate(`/child/${childId}/edit`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary">My Social Twin</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {user?.email}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="btn-outline text-base py-3 px-6"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Children Profiles
            </h2>
            <p className="text-gray-600 mt-1">
              Select a child to create or view their social stories
            </p>
          </div>
          <button
            onClick={() => setShowAddChild(true)}
            className="btn-primary"
          >
            ➕ Add Child
          </button>
        </div>

        {/* Children Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-xl text-gray-600">Loading...</div>
          </div>
        ) : children.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">👶</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No Children Added Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Add your first child to start creating personalized social stories
            </p>
            <button
              onClick={() => setShowAddChild(true)}
              className="btn-primary"
            >
              Add Your First Child
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {children.map((child) => (
              <ChildCard
                key={child.childId}
                child={child}
                onSelect={() => handleSelectChild(child.childId)}
                onEdit={() => handleEditChild(child.childId)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Add Child Modal */}
      {showAddChild && (
        <AddChildModal
          onClose={() => setShowAddChild(false)}
          onSuccess={() => {
            setShowAddChild(false);
            fetchChildren();
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
