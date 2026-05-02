export interface VoterProgress {
  eligibilityChecked: boolean;
  isEligible: boolean | null;
  registrationStatus: 'registered' | 'not-registered' | 'checking' | 'unknown';
  checklist: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  category: 'documentation' | 'polling-day' | 'post-vote';
}

export const INITIAL_CHECKLIST: ChecklistItem[] = [
  { id: '1', label: 'Verify Name in Voter List', completed: false, category: 'documentation' },
  { id: '2', label: 'Locate Polling Station', completed: false, category: 'documentation' },
  { id: '3', label: 'Prepare Original Photo ID (e.g. EPIC, Aadhaar)', completed: false, category: 'documentation' },
  { id: '4', label: 'Arrive at Polling Booth early', completed: false, category: 'polling-day' },
  { id: '5', label: 'Get Indelible Ink applied', completed: false, category: 'polling-day' },
  { id: '6', label: 'Cast Vote on EVM/VVPAT', completed: false, category: 'polling-day' },
];

export const ELIGIBILITY_CRITERIA = {
  minAge: 18,
  nationality: 'Indian',
  residence: 'Local Constituency resident',
};
