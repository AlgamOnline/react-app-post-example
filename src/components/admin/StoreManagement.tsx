import React, { useState } from 'react';
import { Store } from '../../types';
import { Plus, Pencil, Trash2 } from 'lucide-react';

// Mock data - replace with API calls in production
const INITIAL_STORES: Store[] = [
  {
    id: 1,
    name: 'Downtown Store',
    address: '123 Main St',
    phone: '555-0123',
    owner: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '555-0100'
    },
    membershipId: 1,
    isActive: true,
    registrationDate: '2024-01-01'
  },
  // Add more mock stores
];

export function StoreManagement() {
  const [stores, setStores] = useState<Store[]>(INITIAL_STORES);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    owner: {
      name: '',
      email: '',
      phone: ''
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStore) {
      setStores(stores.map(store =>
        store.id === editingStore.id
          ? { ...store, ...formData }
          : store
      ));
    } else {
      const newStore: Store = {
        ...formData,
        id: Math.max(...stores.map(s => s.id), 0) + 1,
        membershipId: 1,
        isActive: true,
        registrationDate: new Date().toISOString()
      };
      setStores([...stores, newStore]);
    }
    setIsFormOpen(false);
    setEditingStore(null);
    setFormData({
      name: '',
      address: '',
      phone: '',
      owner: { name: '', email: '', phone: '' }
    });
  };

  const handleEdit = (store: Store) => {
    setEditingStore(store);
    setFormData({
      name: store.name,
      address: store.address,
      phone: store.phone,
      owner: { ...store.owner }
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this store?')) {
      setStores(stores.filter(store => store.id !== id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Store Management</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <Plus size={20} />
          Add Store
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Store Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Owner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stores.map((store) => (
              <tr key={store.id}>
                <td className="px-6 py-4 whitespace-nowrap">{store.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{store.address}</td>
                <td className="px-6 py-4 whitespace-nowrap">{store.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="font-medium">{store.owner.name}</div>
                    <div className="text-sm text-gray-500">{store.owner.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    store.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {store.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(store)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(store.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-[600px]">
            <h3 className="text-lg font-semibold mb-4">
              {editingStore ? 'Edit Store' : 'Add New Store'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Store Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Owner Name
                  </label>
                  <input
                    type="text"
                    value={formData.owner.name}
                    onChange={(e) => setFormData({
                      ...formData,
                      owner: { ...formData.owner, name: e.target.value }
                    })}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Owner Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.owner.phone}
                    onChange={(e) => setFormData({
                      ...formData,
                      owner: { ...formData.owner, phone: e.target.value }
                    })}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Owner Email
                  </label>
                  <input
                    type="email"
                    value={formData.owner.email}
                    onChange={(e) => setFormData({
                      ...formData,
                      owner: { ...formData.owner, email: e.target.value }
                    })}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingStore(null);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  {editingStore ? 'Update Store' : 'Add Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}