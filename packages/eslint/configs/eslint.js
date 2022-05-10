/**
 * @file
 * Rules that overwrite those provided by the eslint:recommended plugin. Note
 * that any rule not referenced here defers to its default setting within the
 * plugin.
 */

module.exports = {
	extends: ['eslint:recommended'],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module'
	},
	rules: {
		// --------------------------------------------------------------------

		// POSSIBLE PROBLEMS (https://eslint.org/docs/rules/#possible-problems)

		// enforce `return` statements in callbacks of array methods
		// https://eslint.org/docs/rules/array-callback-return
		'array-callback-return': ['error', { allowImplicit: true }],

		// disallow returning value from constructor
		// https://eslint.org/docs/rules/no-constructor-return
		'no-constructor-return': 'error',

		// disallow duplicate module imports
		// https://eslint.org/docs/rules/no-duplicate-imports
		'no-duplicate-imports': 'error',

		// disallow returning values from Promise executor functions
		// https://eslint.org/docs/rules/no-promise-executor-return
		'no-promise-executor-return': 'error',

		// disallow comparisons where both sides are exactly the same
		// https://eslint.org/docs/rules/no-self-compare
		'no-self-compare': 'error',

		// disallow template literal placeholder syntax in regular strings
		// https://eslint.org/docs/rules/no-template-curly-in-string
		'no-template-curly-in-string': 'error',

		// disallow unmodified loop conditions
		// https://eslint.org/docs/rules/no-unmodified-loop-condition
		'no-unmodified-loop-condition': 'error',

		// disallow loops with a body that allows only one iteration
		// https://eslint.org/docs/rules/no-unreachable-loop
		'no-unreachable-loop': 'error',

		// disallow unused private class members
		// https://eslint.org/docs/rules/no-unused-private-class-members
		'no-unused-private-class-members': 'error',

		// disallow unused variables
		// https://eslint.org/docs/rules/no-unused-vars
		'no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: true }],

		// require-atomic-updates
		// disallow assignments that can lead to race conditions due to usage of `await` or `yield`
		// https://eslint.org/docs/rules/require-atomic-updates
		'require-atomic-updates': ['error', { allowProperties: true }],

		// enforce comparing `typeof` expressions against valid strings
		// https://eslint.org/docs/rules/valid-typeof
		'valid-typeof': ['error', { requireStringLiterals: true }],

		// --------------------------------------------------------

		// SUGGESTIONS (https://eslint.org/docs/rules/#suggestions)

		// enforce the use of variables within the scope they are defined
		// https://eslint.org/docs/rules/block-scoped-var
		'block-scoped-var': 'error',

		// enforce camelcase naming convention
		// https://eslint.org/docs/rules/camelcase
		camelcase: ['error', { properties: 'never', ignoreDestructuring: false }],

		// enforce or disallow capitalization of the first letter of a comment
		// https://eslint.org/docs/rules/capitalized-comments
		'capitalized-comments': [
			'off',
			'never',
			{
				line: {
					ignorePattern: '.*',
					ignoreInlineComments: true,
					ignoreConsecutiveComments: true
				},
				block: {
					ignorePattern: '.*',
					ignoreInlineComments: true,
					ignoreConsecutiveComments: true
				}
			}
		],

		// enforce consistent naming when capturing the current execution context
		// https://eslint.org/docs/rules/consistent-this
		'consistent-this': ['error', 'that'],

		// require `default` cases in `switch` statements
		// https://eslint.org/docs/rules/default-case
		'default-case': 'error',

		// enforce default clauses in switch statements to be last
		// https://eslint.org/docs/rules/default-case-last
		'default-case-last': 'error',

		// enforce default clauses in switch statements to be last
		// https://eslint.org/docs/rules/default-param-last
		'default-param-last': 'error',

		// require the use of `===` and `!==`
		// https://eslint.org/docs/rules/eqeqeq
		eqeqeq: ['error', 'always', { null: 'ignore' }],

		// require function names to match the name of the variable or property to which they are assigned
		// https://eslint.org/docs/rules/func-name-matching
		'func-name-matching': [
			'off',
			'always',
			{
				includeCommonJSModuleExports: false,
				considerPropertyDescriptor: true
			}
		],

		// enforce the consistent use of either `function` declarations or expressions
		// https://eslint.org/docs/rules/func-style
		'func-style': ['error', 'declaration', { allowArrowFunctions: true }],

		// require grouped accessor pairs in object literals and classes
		// https://eslint.org/docs/rules/grouped-accessor-pairs
		'grouped-accessor-pairs': 'error',

		// require `for-in` loops to include an `if` statement
		// https://eslint.org/docs/rules/guard-for-in
		'guard-for-in': 'error',

		// enforce a maximum number of classes per file
		// https://eslint.org/docs/rules/max-classes-per-file
		'max-classes-per-file': ['error'],

		// enforce a maximum number of parameters in function definitions
		// https://eslint.org/docs/rules/max-params
		'max-params': ['error', 4],

		// enforce a maximum number of statements allowed per line
		// https://eslint.org/docs/rules/max-statements-per-line
		'max-statements-per-line': ['error', { max: 1 }],

		// require constructor names to begin with a capital letter
		// https://eslint.org/docs/rules/new-cap
		'new-cap': [
			'error',
			{
				newIsCap: true,
				newIsCapExceptions: [],
				capIsNew: true,
				capIsNewExceptions: [],
				capIsNewExceptionPattern: 'DEPRECATED'
			}
		],

		// disallow the use of `alert`, `confirm`, and `prompt`
		// https://eslint.org/docs/rules/no-alert
		'no-alert': 'error',

		// disallow `Array` constructors
		// https://eslint.org/docs/rules/no-array-constructor
		'no-array-constructor': 'error',

		// disallow bitwise operators
		// https://eslint.org/docs/rules/no-bitwise
		'no-bitwise': 'error',

		// disallow the use of `arguments.caller` or `arguments.callee`
		// https://eslint.org/docs/rules/no-caller
		'no-caller': 'error',

		// disallow arrow functions where they could be confused with comparisons
		// https://eslint.org/docs/rules/no-confusing-arrow
		'no-confusing-arrow': [
			'error',
			{
				allowParens: true
			}
		],

		// disallow `continue` statements
		// https://eslint.org/docs/rules/no-continue
		'no-continue': 'error',

		// disallow the use of `console`
		// https://eslint.org/docs/rules/no-console
		'no-console': 'error',

		// disallow division operators explicitly at the beginning of regular expressions
		// https://eslint.org/docs/rules/no-div-regex
		'no-div-regex': 'error',

		// disallow `else` blocks after `return` statements in `if` statements
		// https://eslint.org/docs/rules/no-else-return
		'no-else-return': ['error', { allowElseIf: false }],

		// disallow empty functions
		// https://eslint.org/docs/rules/no-empty-function
		'no-empty-function': [
			'error',
			{
				allow: ['arrowFunctions', 'functions', 'methods']
			}
		],

		// disallow the use of `eval()`
		// https://eslint.org/docs/rules/no-eval
		'no-eval': 'error',

		// disallow extending native types
		// https://eslint.org/docs/rules/no-extend-native
		'no-extend-native': 'error',

		// disallow unnecessary calls to `.bind()`
		// https://eslint.org/docs/rules/no-extra-bind
		'no-extra-bind': 'error',

		// disallow Unnecessary Labels
		// https://eslint.org/docs/rules/no-extra-label
		'no-extra-label': 'error',

		// disallow the use of leading or trailing decimal points in numeric literals
		// https://eslint.org/docs/rules/no-floating-decimal
		'no-floating-decimal': 'error',

		// disallow implicit type conversions
		// https://eslint.org/docs/rules/no-implicit-coercion
		'no-implicit-coercion': [
			'off',
			{
				boolean: false,
				number: true,
				string: true,
				allow: []
			}
		],

		// disallow the use of `eval()`-like methods
		// https://eslint.org/docs/rules/no-implied-eval
		'no-implied-eval': 'error',

		// disallow inline comments after code
		// https://eslint.org/docs/rules/no-inline-comments
		'no-inline-comments': ['error', { ignorePattern: '@type\\s.+' }],

		// disallow `this` keywords outside of classes or class-like objects
		// https://eslint.org/docs/rules/no-invalid-this
		'no-invalid-this': 'error',

		// disallow labeled statements
		// https://eslint.org/docs/rules/no-label-var
		'no-label-var': 'error',

		// disallow usage of __iterator__ property
		// https://eslint.org/docs/rules/no-iterator
		'no-iterator': 'error',

		// disallow use of labels for anything other then loops and switches
		// https://eslint.org/docs/rules/no-labels
		'no-labels': ['error', { allowLoop: false, allowSwitch: false }],

		// disallow unnecessary nested blocks
		// https://eslint.org/docs/rules/no-lone-blocks
		'no-lone-blocks': 'error',

		// disallow `if` statements as the only statement in `else` blocks
		// https://eslint.org/docs/rules/no-lonely-if
		'no-lonely-if': 'error',

		// disallow function declarations that contain unsafe references inside loop statements
		// https://eslint.org/docs/rules/no-loop-func
		'no-loop-func': 'error',

		// disallow magic numbers
		// https://eslint.org/docs/rules/no-magic-numbers
		'no-magic-numbers': [
			'off',
			{
				ignore: [],
				ignoreArrayIndexes: true,
				enforceConst: true,
				detectObjects: false
			}
		],

		// disallow mixed binary operators
		// https://eslint.org/docs/rules/no-mixed-operators
		'no-mixed-operators': [
			'error',
			{
				// the list of arithmetic groups disallows mixing `%` and `**`
				// with other arithmetic operators.
				groups: [
					['%', '**'],
					['%', '+'],
					['%', '-'],
					['%', '*'],
					['%', '/'],
					['/', '*'],
					['&', '|', '<<', '>>', '>>>'],
					['==', '!=', '===', '!=='],
					['&&', '||']
				],
				allowSamePrecedence: false
			}
		],

		// disallow use of chained assignment expressions
		// https://eslint.org/docs/rules/no-multi-assign
		'no-multi-assign': ['error'],

		// disallow use of multiline strings
		// https://eslint.org/docs/rules/no-multi-str
		'no-multi-str': 'error',

		// disallow `new` operators outside of assignments or comparisons
		// https://eslint.org/docs/rules/no-new
		'no-new': 'error',

		// disallow `new` operators with the `Function` object
		// https://eslint.org/docs/rules/no-new-func
		'no-new-func': 'error',

		// disallow `Object` constructors
		// https://eslint.org/docs/rules/no-new-object
		'no-new-object': 'error',

		// disallow `new` operators with the `String`, `Number`, and `Boolean` objects
		// https://eslint.org/docs/rules/no-new-wrappers
		'no-new-wrappers': 'error',

		// disallow octal escape sequences in string literals
		// https://eslint.org/docs/rules/no-octal-escape
		'no-octal-escape': 'error',

		// disallow reassigning `function` parameters
		// https://eslint.org/docs/rules/no-param-resassign
		'no-param-reassign': 'error',

		// disallow the unary operators `++` and `--`
		// https://eslint.org/docs/rules/no-plusplus
		'no-plusplus': 'error',

		// disallow the use of the `__proto__` property
		// https://eslint.org/docs/rules/no-proto
		'no-proto': 'error',

		// disallow specified names in exports
		// https://eslint.org/docs/rules/no-restricted-exports
		'no-restricted-exports': [
			'error',
			{
				restrictedNamedExports: ['default', 'then']
			}
		],

		//  disallow specified modules when loaded by `import`
		// https://eslint.org/docs/rules/no-restricted-imports
		'no-restricted-imports': [
			'off',
			{
				paths: [],
				patterns: []
			}
		],

		// disallow certain properties on certain objects
		// https://eslint.org/docs/rules/no-restricted-properties
		'no-restricted-properties': [
			'error',
			{
				object: 'global',
				property: 'isFinite',
				message: 'Please use Number.isFinite instead'
			},
			{
				object: 'self',
				property: 'isFinite',
				message: 'Please use Number.isFinite instead'
			},
			{
				object: 'window',
				property: 'isFinite',
				message: 'Please use Number.isFinite instead'
			},
			{
				object: 'global',
				property: 'isNaN',
				message: 'Please use Number.isNaN instead'
			},
			{
				object: 'self',
				property: 'isNaN',
				message: 'Please use Number.isNaN instead'
			},
			{
				object: 'window',
				property: 'isNaN',
				message: 'Please use Number.isNaN instead'
			},
			{
				property: '__defineGetter__',
				message: 'Please use Object.defineProperty instead.'
			},
			{
				property: '__defineSetter__',
				message: 'Please use Object.defineProperty instead.'
			},
			{
				object: 'Math',
				property: 'pow',
				message: 'Use the exponentiation operator (**) instead.'
			}
		],

		// disallow assignment operators in `return` statements
		// https://eslint.org/docs/rules/no-return-assign
		'no-return-assign': ['error', 'always'],

		// disallow unnecessary `return await`
		// https://eslint.org/docs/rules/no-return-await
		'no-return-await': 'error',

		// disallow comma operators
		// https://eslint.org/docs/rules/no-sequences
		'no-sequences': 'error',

		// disallow variable declarations from shadowing variables declared in the outer scope
		// https://eslint.org/docs/rules/no-shadow
		'no-shadow': 'error',

		// disallow throwing literals as exceptions
		// https://eslint.org/docs/rules/no-throw-literal
		'no-throw-literal': 'error',

		// disallow initializing variables to `undefined`
		// https://eslint.org/docs/rules/no-undef-init
		'no-undef-init': 'error',

		// disallow the use of `undefined` as an identifier
		// https://eslint.org/docs/rules/no-undefined
		'no-undefined': 'error',

		// disallow dangling underscores in identifiers
		// https://eslint.org/docs/rules/no-underscore-dangle
		'no-underscore-dangle': [
			'error',
			{
				allow: [
					// add exceptions here
				],
				allowAfterThis: false,
				allowAfterSuper: false,
				enforceInMethodNames: true
			}
		],

		// disallow ternary operators when simpler alternatives exist
		// https://eslint.org/docs/rules/no-unneeded-ternary
		'no-unneeded-ternary': ['error', { defaultAssignment: false }],

		// disallow unused expressions
		// https://eslint.org/docs/rules/no-unused-expressions
		'no-unused-expressions': [
			'error',
			{
				allowShortCircuit: false,
				allowTernary: false,
				allowTaggedTemplates: false
			}
		],

		// disallow unnecessary calls to `.call()` and `.apply()`
		// https://eslint.org/docs/rules/no-useless-call
		'no-useless-call': 'error',

		// disallow unnecessary computed property keys in objects and classes
		// https://eslint.org/docs/rules/no-useless-computed-key
		'no-useless-computed-key': 'error',

		// disallow unnecessary concatenation of literals or template literals
		// https://eslint.org/docs/rules/no-useless-concat
		'no-useless-concat': 'error',

		// disallow unnecessary constructors
		// https://eslint.org/docs/rules/no-useless-constructor
		'no-useless-constructor': 'error',

		// disallow renaming import, export, and destructured assignments to the same name
		// https://eslint.org/docs/rules/no-useless-rename
		'no-useless-rename': [
			'error',
			{
				ignoreDestructuring: false,
				ignoreImport: false,
				ignoreExport: false
			}
		],

		// disallow redundant return statements
		// https://eslint.org/docs/rules/no-useless-return
		'no-useless-return': 'error',

		// require `let` or `const` instead of `var`
		// https://eslint.org/docs/rules/no-var
		'no-var': 'error',

		// disallow `void` operators
		// https://eslint.org/docs/rules/no-void
		'no-void': 'error',

		// require method and property shorthand syntax for object literals
		// https://eslint.org/docs/rules/object-shorthand
		'object-shorthand': [
			'error',
			'always',
			{
				ignoreConstructors: false,
				avoidQuotes: true
			}
		],

		// enforce variables to be declared either together or separately in functions
		'one-var': ['error', 'never'],

		// require or disallow newlines around variable declarations
		// https://eslint.org/docs/rules/one-var-declaration-per-line
		'one-var-declaration-per-line': ['error', 'always'],

		// require or disallow assignment operator shorthand where possible
		// https://eslint.org/docs/rules/operator-assignment
		'operator-assignment': ['error', 'always'],

		// require or disallow padding lines between statements
		// https://eslint.org/docs/rules/padding-line-between-statements
		'padding-line-between-statements': [
			'error',
			{ blankLine: 'always', prev: ['const', 'let'], next: '*' },
			{ blankLine: 'any', prev: ['const'], next: ['const'] },
			{ blankLine: 'any', prev: ['let'], next: ['let'] },
			{ blankLine: 'always', prev: ['block', 'block-like', 'expression'], next: ['const', 'let'] }
		],

		// require using arrow functions for callbacks
		// https://eslint.org/docs/rules/prefer-arrow-callback
		'prefer-arrow-callback': [
			'error',
			{
				allowNamedFunctions: false,
				allowUnboundThis: true
			}
		],

		// require `const` declarations for variables that are never reassigned after declared
		// https://eslint.org/docs/rules/prefer-const
		'prefer-const': [
			'error',
			{
				destructuring: 'any',
				ignoreReadBeforeAssign: true
			}
		],

		// require destructuring from arrays and/or objects
		// https://eslint.org/docs/rules/prefer-destructuring
		'prefer-destructuring': [
			'error',
			{
				array: false,
				object: true
			},
			{
				enforceForRenamedProperties: false
			}
		],

		// disallow the use of `Math.pow` in favor of the `**` operator
		// https://eslint.org/docs/rules/prefer-exponentiation-operator
		'prefer-exponentiation-operator': 'error',

		// disallow `parseInt()` and `Number.parseInt()` in favor of binary, octal, and hexadecimal literals
		// https://eslint.org/docs/rules/prefer-numeric-literals
		'prefer-numeric-literals': 'error',

		// disallow using Object.assign with an object literal as the first argument and prefer the use of object spread instead.
		// https://eslint.org/docs/rules/prefer-object-spread
		'prefer-object-spread': 'error',

		// require using Error objects as Promise rejection reasons
		// https://eslint.org/docs/rules/prefer-promise-reject-errors
		'prefer-promise-reject-errors': ['error', { allowEmptyReject: true }],

		// disallow use of the `RegExp` constructor in favor of regular expression literals
		// https://eslint.org/docs/rules/prefer-regex-literals
		'prefer-regex-literals': 'error',

		// require rest parameters instead of `arguments`
		// https://eslint.org/docs/rules/prefer-rest-params
		'prefer-rest-params': 'error',

		// require spread operators instead of `.apply()`
		// https://eslint.org/docs/rules/prefer-spread
		'prefer-spread': 'error',

		// require template literals instead of string concatenation
		// https://eslint.org/docs/rules/prefer-template
		'prefer-template': 'error',

		// require quotes around object literal property names
		// https://eslint.org/docs/rules/quote-props.html
		'quote-props': ['error', 'as-needed', { keywords: false, unnecessary: true, numbers: false }],

		// enforce the consistent use of the radix argument when using `parseInt()`
		// https://eslint.org/docs/rules/radix
		radix: 'error',

		// require variables within the same declaration block to be sorted
		// https://eslint.org/docs/rules/sort-vars
		'sort-vars': 'error',

		// require or disallow a space immediately following the // or /* in a comment
		// https://eslint.org/docs/rules/spaced-comment
		'spaced-comment': [
			'error',
			'always',
			{
				line: {
					exceptions: ['-', '+'],
					markers: ['=', '!', '/']
				},
				block: {
					exceptions: ['-', '+'],
					markers: ['=', '!', ':', '::'],
					balanced: true
				}
			}
		],

		// require or disallow strict mode directives
		// https://eslint.org/docs/rules/strict
		strict: 'error',

		// require symbol descriptions
		// https://eslint.org/docs/rules/symbol-description
		'symbol-description': 'error',

		// require or disallow "Yoda" conditions
		// https://eslint.org/docs/rules/yoda
		yoda: 'error',

		// ---------------------------------------------------------------------

		// LAYOUT & FORMATTING (https://eslint.org/docs/rules/#layout-formatting)
		// Note: most of eslint's formatting rules are deferred to prettier

		// enforce consistent newlines before and after dots
		// https://eslint.org/docs/rules/dot-location
		'dot-location': ['error', 'property'],

		// enforce consistent spacing before and after keywords
		// https://eslint.org/docs/rules/keyword-spacing
		'keyword-spacing': [
			'error',
			{
				before: true,
				after: true,
				overrides: {
					return: { after: true },
					throw: { after: true },
					case: { after: true }
				}
			}
		],

		// enforce position of line comments
		// https://eslint.org/docs/rules/line-comment-position
		'line-comment-position': 'error',

		// require or disallow an empty line between class members
		// https://eslint.org/docs/rules/lines-between-class-members
		'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],

		// enforce or disallow parentheses when invoking a constructor with no arguments
		// https://eslint.org/docs/rules/new-parens
		'new-parens': 'error',

		// require a newline after each call in a method chain
		// more readable and easy to maintain
		// https://eslint.org/docs/rules/newline-per-chained-call
		'newline-per-chained-call': ['error', { ignoreChainWithDepth: 4 }],

		// disallow unnecessary parentheses
		// https://eslint.org/docs/rules/no-extra-parens
		'no-extra-parens': [
			'off',
			'all',
			{
				conditionalAssign: true,
				nestedBinaryExpressions: false,
				returnAssign: false,
				enforceForArrowConditionals: false
			}
		],

		// disallow use of multiple spaces
		// https://eslint.org/docs/rules/no-multi-spaces
		'no-multi-spaces': [
			'error',
			{
				ignoreEOLComments: false
			}
		],

		// enforce the location of single-line statements
		// https://eslint.org/docs/rules/nonblock-statement-body-position
		'nonblock-statement-body-position': ['error', 'beside', { overrides: {} }],

		// require or disallow the Unicode Byte Order Mark
		// https://eslint.org/docs/rules/unicode-bom
		'unicode-bom': ['error', 'never'],

		// require parentheses around immediate `function` invocations
		// https://eslint.org/docs/rules/wrap-iife.html
		'wrap-iife': ['error', 'outside', { functionPrototypeMethods: false }]
	}
};
