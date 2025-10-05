import React, { useState } from 'react';
import { Store, MembershipPlan } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useStore } from '../contexts/StoreContext';
import { Check, ArrowLeft } from 'lucide-react';

interface StoreRegistrationProps {
  onBack: () => void;
}

const MEMBERSHIP_PLANS: MembershipPlan[] = [
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

export function StoreRegistration({ onBack }: StoreRegistrationProps) {
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [storeData, setStoreData] = useState({
    name: '',
    address: '',
    phone: '',
    owner: {
      name: '',
      email: '',
      phone: ''
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    // Here you would typically:
    // 1. Process payment
    // 2. Create store record
    // 3. Create initial admin user
    // 4. Set up store membership
    console.log('Store registration data:', { storeData, selectedPlan });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold">Register Your Store</h1>
          </div>

          <div className="mb-8">
            <div className="flex justify-center space-x-4">
              <div className={`h-1 w-1/2 rounded ${step >= 1 ? 'bg-blue-500' : 'bg-gray-200'}`} />
              <div className={`h-1 w-1/2 rounded ${step >= 2 ? 'bg-blue-500' : 'bg-gray-200'}`} />
            </div>
          </div>

          {step === 1 ? (
            <div className="space-y-8">
              <h2 className="text-xl font-semibold text-center mb-6">Choose Your Plan</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {MEMBERSHIP_PLANS.map(plan => (
                  <div
                    key={plan.id}
                    className={`border rounded-lg p-6 cursor-pointer transition-all ${
                      selectedPlan?.id === plan.id
                        ? 'border-blue-500 shadow-md'
                        : 'hover:border-blue-200'
                    }`}
                    onClick={() => setSelectedPlan(plan)}
                  >
                    <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
                    <p className="text-2xl font-bold mb-4">
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0
                      }).format(plan.price)}
                      <span className="text-sm font-normal text-gray-600">/month</span>
                    </p>
                    <ul className="space-y-2 mb-4">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <Check size={16} className="text-green-500 mt-1 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <button
                  onClick={() => setStep(2)}
                  disabled={!selectedPlan}
                  className={`px-6 py-2 rounded-md ${
                    selectedPlan
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Continue
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Store Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Store Name
                      </label>
                      <input
                        type="text"
                        value={storeData.name}
                        onChange={(e) => setStoreData({ ...storeData, name: e.target.value })}
                        className="w-full p-2 border rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <textarea
                        value={storeData.address}
                        onChange={(e) => setStoreData({ ...storeData, address: e.target.value })}
                        className="w-full p-2 border rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Store Phone
                      </label>
                      <input
                        type="tel"
                        value={storeData.phone}
                        onChange={(e) => setStoreData({ ...storeData, phone: e.target.value })}
                        className="w-full p-2 border rounded-md"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Owner Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Owner Name
                      </label>
                      <input
                        type="text"
                        value={storeData.owner.name}
                        onChange={(e) => setStoreData({
                          ...storeData,
                          owner: { ...storeData.owner, name: e.target.value }
                        })}
                        className="w-full p-2 border rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Owner Email
                      </label>
                      <input
                        type="email"
                        value={storeData.owner.email}
                        onChange={(e) => setStoreData({
                          ...storeData,
                          owner: { ...storeData.owner, email: e.target.value }
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
                        value={storeData.owner.phone}
                        onChange={(e) => setStoreData({
                          ...storeData,
                          owner: { ...storeData.owner, phone: e.target.value }
                        })}
                        className="w-full p-2 border rounded-md"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Complete Registration
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}