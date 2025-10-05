import React, { useState } from 'react';
import { User, StoreMembership, MembershipPlan } from '../../types';
import { Plus, UserPlus, AlertCircle } from 'lucide-react';

interface UserManagementProps {
  users: User[];
  storeMembership: StoreMembership;
  membershipPlan: MembershipPlan;
  onAddUser: (user: Omit<User, 'id'>) => void;
}

export function UserManagement({
  users,
  storeMembership,
  membershipPlan,
  onAddUser
}: UserManagementProps) {
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    role: 'cashier' as const,
    storeId: storeMembership.storeId
  });

  const canAddMoreUsers = users.length < membershipPlan.maxUsers;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canAddMoreUsers) return;

    onAddUser(newUser);
    setShowAddUser(false);
    setNewUser({ username: '', email: '', role: 'cashier', storeId: storeMembership.storeId });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">User Management</h2>
          <p className="text-sm text-gray-600">
            {users.length} of {membershipPlan.maxUsers} users
          </p>
        </div>
        <button
          onClick={() => setShowAddUser(true)}
          disabled={!canAddMoreUsers}
          className={`flex items-center gap-2 px-4 py-2 rounded-md ${
            canAddMoreUsers
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          <UserPlus size={20} />
          Add User
        </button>
      </div>

      {!canAddMoreUsers && (
        <div className="flex items-center gap-2 p-4 mb-4 bg-yellow-50 text-yellow-700 rounded-md">
          <AlertCircle size={20} />
          <p>
            You've reached the maximum number of users for your plan.
            Consider upgrading to add more users.
          </p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Add New User</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'admin' | 'cashier' })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="cashier">Cashier</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddUser(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}