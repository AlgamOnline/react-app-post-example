import React, { useState } from 'react';
import { MembershipPlan } from '../../types';
import { Plus, Pencil, Trash2 } from 'lucide-react';

// Mock data - replace with API calls in production
const INITIAL_PLANS: MembershipPlan[] = [
  {
    id: 1,
    name: 'Basic',
    price: 99000,
    maxUsers: 2,
    maxProducts: 100,
    features: ['Basic POS features', '2 user accounts', 'Up to 100 products'],
    duration: 1
  },
  {
    id: 2,
    name: 'Professional',
    price: 299000,
    maxUsers: 5,
    maxProducts: 1000,
    features: [
      'All Basic features',
      '5 user accounts',
      'Up to 1000 products',
      'Advanced reporting',
      'Customer loyalty program'
    ],
    duration: 1
  },
  {
    id: 3,
    name: 'Enterprise',
    price: 999000,
    maxUsers: 20,
    maxProducts: 10000,
    features: [
      'All Professional features',
      '20 user accounts',
      'Unlimited products',
      'Priority support',
      'Custom branding',
      'API access'
    ],
    duration: 1
  }
];

export function MembershipManagement() {
  const [plans, setPlans] = useState<MembershipPlan[]>(INITIAL_PLANS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    maxUsers: '',
    maxProducts: '',
    duration: '1',
    features: ['']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const planData = {
      name: formData.name,
      price: Number(formData.price),
      maxUsers: Number(formData.maxUsers),
      maxProducts: Number(formData.maxProducts),
      duration: Number(formData.duration),
      features: formData.features.filter(f => f.trim() !== '')
    };

    if (editingPlan) {
      setPlans(plans.map(plan =>
        plan.id === editingPlan.id
          ? { ...plan, ...planData }
          : plan
      ));
    } else {
      const newPlan: MembershipPlan = {
        ...planData,
        id: Math.max(...plans.map(p => p.id), 0) + 1
      };
      setPlans([...plans, newPlan]);
    }
    setIsFormOpen(false);
    setEditingPlan(null);
    setFormData({
      name: '',
      price: '',
      maxUsers: '',
      maxProducts: '',
      duration: '1',
      features: ['']
    });
  };

  const handleEdit = (plan: MembershipPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price.toString(),
      maxUsers: plan.maxUsers.toString(),
      maxProducts: plan.maxProducts.toString(),
      duration: plan.duration.toString(),
      features: [...plan.features]
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this membership plan?')) {
      setPlans(plans.filter(plan => plan.id !== id));
    }
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, '']
    });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({
      ...formData,
      features: newFeatures
    });
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Membership Plans</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <Plus size={20} />
          Add Plan
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map(plan => (
          <div
            key={plan.id}
            className="border rounded-lg p-6 relative group"
          >
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(plan)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <Pencil size={20} />
                </button>
                <button
                  onClick={() => handleDelete(plan.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
            <p className="text-2xl font-bold mb-4">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
              }).format(plan.price)}
              <span className="text-sm font-normal text-gray-600">/month</span>
            </p>

            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600">
                Up to {plan.maxUsers} users
              </p>
              <p className="text-sm text-gray-600">
                {plan.maxProducts === 10000 ? 'Unlimited' : `Up to ${plan.maxProducts}`} products
              </p>
            </div>

            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-[600px]">
            <h3 className="text-lg font-semibold mb-4">
              {editingPlan ? 'Edit Plan' : 'Add New Plan'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plan Name
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
                    Price (IDR)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Users
                  </label>
                  <input
                    type="number"
                    value={formData.maxUsers}
                    onChange={(e) => setFormData({ ...formData, maxUsers: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Products
                  </label>
                  <input
                    type="number"
                    value={formData.maxProducts}
                    onChange={(e) => setFormData({ ...formData, maxProducts: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (months)
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    required
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Features
                </label>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        className="flex-1 p-2 border rounded-md"
                        placeholder="Enter feature"
                      />
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addFeature}
                    className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
                  >
                    <Plus size={20} />
                    Add Feature
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingPlan(null);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  {editingPlan ? 'Update Plan' : 'Add Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}