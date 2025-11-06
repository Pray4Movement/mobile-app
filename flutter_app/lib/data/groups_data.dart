import '../models/group.dart';

final List<Group> groups = [
  Group(id: 'doxa-life', name: 'Doxa Life'),
  Group(id: '110-cities', name: '110 Cities'),
  Group(id: 'ramadan-2026', name: 'Ramadan 2026'),
];

Group? getGroupById(String id) {
  try {
    return groups.firstWhere((g) => g.id == id);
  } catch (e) {
    return null;
  }
}

List<Group> getAllGroups() {
  return groups;
}

