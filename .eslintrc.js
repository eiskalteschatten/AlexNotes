module.exports = {
    "env": {
        "es6": true,
        "browser": true,
        "node": true
    },
    "extends": [
        "plugin:@typescript-eslint/recommended",
        "plugin:vue/recommended",
        "eslint:recommended"
    ],
    "parser": "vue-eslint-parser",
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module",
        "parser": "@typescript-eslint/parser"
    },
    "plugins": [
        "disable",
        "promise",
        "vue",
        "@typescript-eslint"
    ],
    "settings": {
        "eslint-plugin-disable": {
            "paths": {
                "vue": ["**/*.js", "**/*.ts", "**/*.json"],
                "@typescript-eslint": ["**/*.js", "**/*.json"]
            }
        }
    },
    "rules": {
        "indent": [
            "error",
            4,
            { "SwitchCase": 1 }
        ],
        "vue/html-indent": [ "error", 4 ],
        "vue/max-attributes-per-line": [
            "error",
            {
                "singleline": 6,
                "multiline": {
                    "max": 1,
                    "allowFirstLine": false
                }
            }
        ],
        "vue/attributes-order": [ "off" ],
        "vue/require-default-prop": [ "off" ],
        "vue/no-side-effects-in-computed-properties": [ "off" ],
        "vue/component-name-in-template-casing": [ "off" ],
        "vue/singleline-html-element-content-newline": [ "off" ],
        "linebreak-style": [ "error", "unix" ],
        "quotes": [ "error", "single" ],
        "semi": [ "error", "always" ],
        "no-console": [ "off" ],
        "no-case-declarations": [ "off" ],
        "prefer-const": [ "error" ],
        "arrow-parens": [ "error", "as-needed" ],
        "no-undef": [ "off" ],
        "promise/catch-or-return": "error",
        "promise/param-names": "error",
        "promise/no-return-wrap": "error",
        "@typescript-eslint/no-angle-bracket-type-assertion": [ "off" ],
        "@typescript-eslint/no-explicit-any": [ "off" ]
    },
    "overrides": [{
        "files": [ "*.vue" ],
        "rules": {
            "indent": "off",
            "no-irregular-whitespace": "off",
            "@typescript-eslint/indent": "off"
        }
    }]
};
