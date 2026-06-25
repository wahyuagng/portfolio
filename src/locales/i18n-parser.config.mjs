export default {
  locales: ['en', 'id', 'fr', 'vi', 'cn', 'ar'],
  input: ['../**/*.{ts,tsx,js,jsx}'],
  output: 'src/locales/langs/$LOCALE/$NAMESPACE.json',
  defaultNamespace: 'common',
  namespaceSeparator: ':',
  keySeparator: '.',
  useKeysAsDefaultValue: true,
  defaultValue: '',
  saveMissing: true,
  parseMissingKeyHandler: (key) => key,
  createOldCatalogs: false,
  keepRemoved: true,
  sort: true,
  indentation: 2,
  verbose: true,
  failOnWarnings: false,

  lexers: {
    tsx: ['JavascriptLexer'],
    ts: ['JavascriptLexer'],
    jsx: ['JavascriptLexer'],
    js: ['JavascriptLexer'],
  },

  func: ['t', 'tMessages', 'navTrans'],
};
