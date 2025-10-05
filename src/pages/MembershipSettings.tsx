import React, { useState } from 'react';
import { MembershipPlan } from '../types';
import { ArrowLeft, Check } from 'lucide-react';

interface MembershipSettingsProps {
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

export function MembershipSettings({ onBack }: MembershipSettingsProps) {
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);

  const handleUpgrade = () => {
    if (!selectedPlan) return;
    // Handle upgrade logic here
    console.log('Upgrading to:', selectedPlan);
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
            <h1 className="text-2xl font-bold">Membership Settings</h1>
          </div>

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

          <div className="mt-8 text-center">
            <button
              onClick={handleUpgrade}
              disabled={!selectedPlan}
              className={`px-6 py-2 rounded-md ${
                selectedPlan
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              Upgrade Membership
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}