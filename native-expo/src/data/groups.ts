export interface Group {
  id: string;
  name: string;
}

export const groups: Group[] = [
  { id: 'doxa-life', name: 'Doxa Life' },
  { id: '110-cities', name: '110 Cities' },
  { id: 'ramadan-2026', name: 'Ramadan 2026' },
];

export const getGroupById = (id: string): Group | undefined => {
  return groups.find(g => g.id === id);
};

