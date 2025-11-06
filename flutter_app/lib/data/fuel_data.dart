import '../models/fuel.dart';
import '../utils/date_utils.dart';

final List<Fuel> fuel = [
  // Azeris campaign - Day 1
  Fuel(
    id: 'azeris-1',
    campaignId: 'azeris',
    day: 1,
    date: getDateString(0),
    languages: {
      'en': FuelContent(
        campaignId: 'azeris',
        day: 1,
        date: getDateString(0),
        language: 'en',
        blocks: [
          FuelBlock(
            type: FuelBlockType.heading,
            content: 'Day 1: Introduction to the Azeri People',
            level: 1,
          ),
          FuelBlock(
            type: FuelBlockType.paragraph,
            content:
                'The Azeri people are a Turkic ethnic group primarily living in Azerbaijan and Iran. Today we begin our journey of prayer for this community.',
          ),
          FuelBlock(
            type: FuelBlockType.heading,
            content: 'Prayer Points',
            level: 2,
          ),
          FuelBlock(
            type: FuelBlockType.list,
            items: [
              'Pray for peace and stability in the region',
              'Pray for the spread of the Gospel among Azeri communities',
              'Pray for unity and reconciliation',
            ],
          ),
        ],
      ),
      'es': FuelContent(
        campaignId: 'azeris',
        day: 1,
        date: getDateString(0),
        language: 'es',
        blocks: [
          FuelBlock(
            type: FuelBlockType.heading,
            content: 'Día 1: Introducción al Pueblo Azerí',
            level: 1,
          ),
          FuelBlock(
            type: FuelBlockType.paragraph,
            content:
                'El pueblo azerí es un grupo étnico túrquico que vive principalmente en Azerbaiyán e Irán. Hoy comenzamos nuestro viaje de oración por esta comunidad.',
          ),
        ],
      ),
    },
  ),
  // Azeris campaign - Day 2
  Fuel(
    id: 'azeris-2',
    campaignId: 'azeris',
    day: 2,
    date: getDateString(1),
    languages: {
      'en': FuelContent(
        campaignId: 'azeris',
        day: 2,
        date: getDateString(1),
        language: 'en',
        blocks: [
          FuelBlock(
            type: FuelBlockType.heading,
            content: 'Day 2: Cultural Heritage',
            level: 1,
          ),
          FuelBlock(
            type: FuelBlockType.paragraph,
            content:
                'The Azeri people have a rich cultural heritage. Let us pray for the preservation of their traditions while embracing new opportunities.',
          ),
        ],
      ),
    },
  ),
  // Azeris campaign - Day 3
  Fuel(
    id: 'azeris-3',
    campaignId: 'azeris',
    day: 3,
    date: getDateString(2),
    languages: {
      'en': FuelContent(
        campaignId: 'azeris',
        day: 3,
        date: getDateString(2),
        language: 'en',
        blocks: [
          FuelBlock(
            type: FuelBlockType.heading,
            content: 'Day 3: Economic Development',
            level: 1,
          ),
          FuelBlock(
            type: FuelBlockType.paragraph,
            content:
                'Pray for economic opportunities and sustainable development in Azeri communities.',
          ),
        ],
      ),
    },
  ),
  // Afghanistan campaign - Day 1
  Fuel(
    id: 'afghanistan-1',
    campaignId: 'afghanistan',
    day: 1,
    date: getDateString(0),
    languages: {
      'en': FuelContent(
        campaignId: 'afghanistan',
        day: 1,
        date: getDateString(0),
        language: 'en',
        blocks: [
          FuelBlock(
            type: FuelBlockType.heading,
            content: 'Day 1: Praying for Afghanistan',
            level: 1,
          ),
          FuelBlock(
            type: FuelBlockType.paragraph,
            content:
                'Afghanistan has faced decades of conflict and instability. Today we lift up this nation in prayer.',
          ),
          FuelBlock(
            type: FuelBlockType.heading,
            content: 'Prayer Points',
            level: 2,
          ),
          FuelBlock(
            type: FuelBlockType.list,
            items: [
              'Pray for peace and an end to violence',
              'Pray for the people affected by conflict',
              'Pray for humanitarian aid to reach those in need',
            ],
          ),
        ],
      ),
    },
  ),
  // Afghanistan campaign - Day 2
  Fuel(
    id: 'afghanistan-2',
    campaignId: 'afghanistan',
    day: 2,
    date: getDateString(1),
    languages: {
      'en': FuelContent(
        campaignId: 'afghanistan',
        day: 2,
        date: getDateString(1),
        language: 'en',
        blocks: [
          FuelBlock(
            type: FuelBlockType.heading,
            content: 'Day 2: Women and Children',
            level: 1,
          ),
          FuelBlock(
            type: FuelBlockType.paragraph,
            content:
                'Pray especially for women and children who are most vulnerable in times of conflict.',
          ),
        ],
      ),
    },
  ),
  // Afghanistan campaign - Day 3
  Fuel(
    id: 'afghanistan-3',
    campaignId: 'afghanistan',
    day: 3,
    date: getDateString(2),
    languages: {
      'en': FuelContent(
        campaignId: 'afghanistan',
        day: 3,
        date: getDateString(2),
        language: 'en',
        blocks: [
          FuelBlock(
            type: FuelBlockType.heading,
            content: 'Day 3: Education and Hope',
            level: 1,
          ),
          FuelBlock(
            type: FuelBlockType.paragraph,
            content:
                'Pray for educational opportunities and hope for the next generation.',
          ),
        ],
      ),
    },
  ),
  // Paris campaign - Day 1
  Fuel(
    id: 'paris-1',
    campaignId: 'paris',
    day: 1,
    date: getDateString(0),
    languages: {
      'en': FuelContent(
        campaignId: 'paris',
        day: 1,
        date: getDateString(0),
        language: 'en',
        blocks: [
          FuelBlock(
            type: FuelBlockType.heading,
            content: 'Day 1: The City of Light',
            level: 1,
          ),
          FuelBlock(
            type: FuelBlockType.paragraph,
            content:
                'Paris, known as the City of Light, is home to millions. Let us pray for this great city.',
          ),
        ],
      ),
      'fr': FuelContent(
        campaignId: 'paris',
        day: 1,
        date: getDateString(0),
        language: 'fr',
        blocks: [
          FuelBlock(
            type: FuelBlockType.heading,
            content: 'Jour 1: La Ville Lumière',
            level: 1,
          ),
          FuelBlock(
            type: FuelBlockType.paragraph,
            content:
                'Paris, connue sous le nom de Ville Lumière, abrite des millions de personnes. Prions pour cette grande ville.',
          ),
        ],
      ),
    },
  ),
  // Paris campaign - Day 2
  Fuel(
    id: 'paris-2',
    campaignId: 'paris',
    day: 2,
    date: getDateString(1),
    languages: {
      'en': FuelContent(
        campaignId: 'paris',
        day: 2,
        date: getDateString(1),
        language: 'en',
        blocks: [
          FuelBlock(
            type: FuelBlockType.heading,
            content: 'Day 2: Unity in Diversity',
            level: 1,
          ),
          FuelBlock(
            type: FuelBlockType.paragraph,
            content:
                'Paris is a diverse city. Pray for unity and understanding among its many communities.',
          ),
        ],
      ),
    },
  ),
  // London campaign - Day 1
  Fuel(
    id: 'london-1',
    campaignId: 'london',
    day: 1,
    date: getDateString(0),
    languages: {
      'en': FuelContent(
        campaignId: 'london',
        day: 1,
        date: getDateString(0),
        language: 'en',
        blocks: [
          FuelBlock(
            type: FuelBlockType.heading,
            content: 'Day 1: Praying for London',
            level: 1,
          ),
          FuelBlock(
            type: FuelBlockType.paragraph,
            content:
                'London is a global city with diverse communities. Let us intercede for this great city and its people.',
          ),
        ],
      ),
    },
  ),
  // Malaysia campaign - Day 1
  Fuel(
    id: 'malaysia-1',
    campaignId: 'malaysia',
    day: 1,
    date: getDateString(0),
    languages: {
      'en': FuelContent(
        campaignId: 'malaysia',
        day: 1,
        date: getDateString(0),
        language: 'en',
        blocks: [
          FuelBlock(
            type: FuelBlockType.heading,
            content: 'Day 1: Praying for Malaysia',
            level: 1,
          ),
          FuelBlock(
            type: FuelBlockType.paragraph,
            content:
                'Malaysia is a nation of great diversity. Let us pray for unity, peace, and prosperity.',
          ),
        ],
      ),
    },
  ),
];

Fuel? getFuelById(String id) {
  try {
    return fuel.firstWhere((f) => f.id == id);
  } catch (e) {
    return null;
  }
}

Fuel? getFuelByCampaignAndDay(String campaignId, int day) {
  try {
    return fuel.firstWhere(
      (f) => f.campaignId == campaignId && f.day == day,
    );
  } catch (e) {
    return null;
  }
}

List<Fuel> getFuelByCampaign(String campaignId) {
  return fuel.where((f) => f.campaignId == campaignId).toList();
}

List<Fuel> getFuelByDate(String date) {
  return fuel.where((f) => f.date == date).toList();
}

