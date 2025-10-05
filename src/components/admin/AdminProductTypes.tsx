import React, { useState } from 'react';
import { Plus, X, Pencil, Trash2 } from 'lucide-react';
import { ProductType } from '../../types';
import { useStore } from '../../contexts/StoreContext';

interface AdminProductTypesProps {
  types: ProductType[];
  onAddType: (type: Omit<ProductType, 'id'>) => void;
  onUpdateType: (id: number, type: Omit<ProductType, 'id'>) => void;
  onDeleteType: (id: number) => void;
}

export function AdminProductTypes({
  types,
  onAddType,
  onUpdateType,
  onDeleteType,
}: AdminProductTypesProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingType, setEditingType] = useState<ProductType | null>(null);
  const [typeName, setTypeName] = useState('');
  const { currentStore } = useStore();

  // Filter types by current store
  const storeTypes = types.filter(type => type.storeId === currentStore?.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingType) {
      onUpdateType(editingType.id, {
        name: typeName,
        storeId: currentStore?.id || 0
      });
    } else {
      onAddType({
        name: typeName,
        storeId: currentStore?.id || 0
      });
    }
    setTypeName('');
    setEditingType(null);
    setIsFormOpen(false);
  };

  const handleEdit = (type: ProductType) => {
    setTypeName(type.name);
    setEditingType(type);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this product type?')) {
      onDeleteType(id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Product Types</h2>
        <button
          onClick={() => {
            setTypeName('');
            setEditingType(null);
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          <Plus size={20} />
          Add Type
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingType ? 'Edit Product Type' : 'Add Product Type'}
              </h2>
              <button
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingType(null);
                  setTypeName('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type Name
                </label>
                <input
                  type="text"
                  value={typeName}
                  onChange={(e) => setTypeName(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                {editingType ? 'Update Type' : 'Add Type'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {storeTypes.map((type) => (
              <tr key={type.id}>
                <td className="px-6 py-4 whitespace-nowrap">{type.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(type)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(type.id)}
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
    </div>
  );
}