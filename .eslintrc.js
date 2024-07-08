module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  compilerOptions: {
    "baseUrl": "src"
  },
  extends: [
    "plugin:react/recommended",
    "standard"
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: "latest",
    sourceType: "module"
  },
  plugins: [
    "react"
  ],
  rules: {
    semi: "off",
    quotes: [
      "error",
      "double"
    ],
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "react/jsx-key": "off",
    "no-console": 1
  }
}
