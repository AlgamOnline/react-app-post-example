import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Member } from '../types';

interface MemberSearchProps {
  onSelectMember: (member: Member) => void;
}

// Mock data - replace with API calls in production
const MEMBERS: Member[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '555-0101',
    membershipNumber: 'M001',
    tierId: 1,
    points: 1000,
    totalSpent: 5000000,
    joinDate: '2024-01-01',
    storeId: 1
  },
  // Add more mock members
];

export function MemberSearch({ onSelectMember }: MemberSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);

  const filteredMembers = MEMBERS.filter(member =>
    member.membershipNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone.includes(searchTerm)
  );

  return (
    <div className="relative">
      <div className="flex gap-2 mb-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowResults(true);
            }}
            placeholder="Search member by ID, name, or phone"
            className="w-full p-2 pl-8 border rounded-md"
          />
          <Search className="absolute left-2 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      {showResults && searchTerm && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredMembers.length > 0 ? (
            filteredMembers.map(member => (
              <div
                key={member.id}
                className="p-2 hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  onSelectMember(member);
                  setShowResults(false);
                  setSearchTerm('');
                }}
              >
                <div className="font-semibold">{member.name}</div>
                <div className="text-sm text-gray-600">
                  {member.membershipNumber} • {member.phone}
                </div>
              </div>
            ))
          ) : (
            <div className="p-2 text-gray-500">No members found</div>
          )}
        </div>
      )}
    </div>
  );
}