# eslint-plugin-jsx

JSX specific linting rules for ESLint. Designed for the semantics of the [JSX-to-JS](//github.com/jkroso/JSX-to-JS) transpiler and is not compatible with the standard JSX semantics.

## Installation

You need to install this plugin in the same place eslint itself is installed. So if your using a globally installed eslint this will also need to be installed globally

`npm install -g eslint-plugin-jsx`

then in your ~/.eslintrc:

```json
{
  "plugins": ["jsx"],
  "rules": {
    "jsx/uses-factory": [1, {"pragma": "JSX"}],
    "jsx/factory-in-scope": [1, {"pragma": "JSX"}],
    "jsx/mark-used-vars": 1,
    "jsx/no-undef": 1
  }
}
```

`jsx/no-undef` also accepts a `varsIgnorePattern` which can be used to ignore certain undefined patterns (e.g. when using custom web elements).

`jsx/no-undef` also accepts a `ignoreAttributes` which can be used disregard linting of attributes (which incorrectly flags boolean attributes as undefined).

All those rules are defined by default though so you can leave out the ones you agree with.

## Thanks

This project is based of [yannickcr/eslint-plugin-react](//github.com/yannickcr/eslint-plugin-react). Which has some rules you will probably also be interested in.
