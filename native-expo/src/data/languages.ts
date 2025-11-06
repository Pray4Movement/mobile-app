export interface Language {
  code: string;
  name: string;
}

export const languages: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'ar', name: 'Arabic' },
  { code: 'zh', name: 'Chinese' },
  { code: 'hi', name: 'Hindi' },
];

export const getLanguageByCode = (code: string): Language | undefined => {
  return languages.find(l => l.code === code);
};

export const defaultLanguage = languages[0];

