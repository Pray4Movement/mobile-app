class Language {
  final String code;
  final String name;

  const Language({
    required this.code,
    required this.name,
  });
}

final List<Language> languages = [
  const Language(code: 'en', name: 'English'),
  const Language(code: 'es', name: 'Spanish'),
  const Language(code: 'fr', name: 'French'),
  const Language(code: 'zh', name: 'Chinese'),
  const Language(code: 'ar', name: 'Arabic'),
  const Language(code: 'hi', name: 'Hindi'),
];

String getLanguageName(String code) {
  try {
    return languages.firstWhere((l) => l.code == code).name;
  } catch (e) {
    return code;
  }
}

List<String> getAllLanguageCodes() {
  return languages.map((l) => l.code).toList();
}

