module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-prettier/recommended'],
  plugins: ['stylelint-prettier', 'stylelint-order', 'stylelint-scss'],
  rules: {
    'order/properties-alphabetical-order': null,
    'prettier/prettier': true,
    'selector-class-pattern': [
      /*
      [stage]-[block]_[element]-[modifier]
        [stage] should be one of a, m, o, t, p, u
        [block], [element], [modifier] should be lowercase
        [block] should not start with a number
        [element] should have 0 - 2 occurences
        [modifier] should have 0 - 1 occurences
      */
      '^[amotpu]-([a-z][a-z0-9]*)(_([a-z0-9]+)){0,2}(-([a-z0-9]+))?$',
      {
        resolveNestedSelectors: false,
      },
    ],
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true,
    'order/order': ['custom-properties', 'declarations'], // Sort alphabetically
    indentation: 2,
    'string-quotes': 'single',
    'color-hex-case': 'lower',
    'color-hex-length': 'long',
    'color-named': 'never',
    'selector-no-qualifying-type': true,
    'selector-combinator-space-after': 'always',
    'selector-attribute-quotes': 'always',
    'selector-attribute-operator-space-before': 'never',
    'selector-attribute-operator-space-after': 'never',
    'selector-attribute-brackets-space-inside': 'never',
    'declaration-block-trailing-semicolon': 'always',
    'declaration-colon-space-before': 'never',
    'declaration-colon-space-after': 'always-single-line',
    'property-no-vendor-prefix': true,
    'value-no-vendor-prefix': true,
    'function-url-quotes': 'always',
    'font-family-name-quotes': 'always-where-recommended',
    'comment-whitespace-inside': 'always',
    'comment-empty-line-before': 'never',
    'rule-empty-line-before': ['always', { ignore: ['first-nested', 'after-comment'] }],
    'selector-pseudo-element-colon-notation': 'single',
    'selector-pseudo-class-parentheses-space-inside': 'never',
    'selector-no-vendor-prefix': true,
    'media-feature-range-operator-space-before': 'never',
    'media-feature-range-operator-space-after': 'never',
    'media-feature-parentheses-space-inside': 'never',
    'media-feature-name-no-vendor-prefix': true,
    'media-feature-colon-space-before': 'never',
    'no-descending-specificity': null,
  },
};
