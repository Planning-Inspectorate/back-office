# Styles Guidelines

## Architecture

Architecting a CSS project is probably one of the most difficult things you will have to do in a project’s life.
Keeping the architecture consistent and meaningful is even harder.
~ from [Sass Guidelines](https://sass-guidelin.es/#architecture)

This project uses a mixture of ITCSS, BEM, [Suit CSS](https://suitcss.github.io/) and most importantly [GOV.UK Frontend](https://github.com/alphagov/govuk-frontend/).

### Folder/File Structure

Folder/File structure follows ITCSS, and everything else its a mixture of BEM and Suit CSS.

```
.
├── /styles/
│   ├── /1-settings/       # Preprocessor variables and methods (no actual CSS output), global variables, site-wide settings, config switches, etc.
│   ├── /2-design-tokens/  # All styles regarding the visual vocabulary of the site. At this level, we are still not generating any CSS output.
│   ├── /3-tools/          # Mixins and functions (no actual CSS output).
│   ├── /4-generic/        # CSS resets which might include Normalize.css, or your own batch of code, low-specificity, far-reaching rulesets.
│   ├── /5-elements/       # Single HTML element selectors without classes, unclassed HTML elements (e.g. `a {}`, `blockquote {}`, `address {}`).
│   ├── /6-skeleton/       # Wrappers, containers, grids, and all kinds of reusable objects that provide layout patterns. This is the skeleton of your site.
│   ├── /7-components/     # Aesthetic classes for styling any & all page elements, complete chunks of UI (e.g. `.c-carousel {}`).
│   ├── /8-utilities/      # High-specificity, very explicit selectors. Overrides and helper classes (e.g. `.u-hidden {}`).
│   ├── /9-pages/          # All page speficic classes (e.g. `.p-login-container {}`). Mostly realted to layout and structure that is not common.
```

## External dependencies

### GOV.UK Frontend

We use the [GOV.UK Frontend](https://github.com/alphagov/govuk-frontend/) design system with all its defaults.

In order to import and use the GOV.UK mixins and functions or anything else we have to import them like this:

```scss
@use "../govuk-frontend/govuk/base" as govuk;

.test {
	@include govuk.govuk-responsive-padding(4);
	@include base.govuk-responsive-margin(6, 'bottom');
}
```

This actually imports the follwing:

```scss
@import "settings/all";
@import "tools/all";
@import "helpers/all";
```

so you will have access to everything via `govuk.` namespace.

## Getting started

There are a handful of things we need to do before we’re ready to go.

### _settings.config.scss

This is a configuration file that used to handle the state, location, or environment of your project. This handles very high-level settings that don’t necessarily affect the CSS itself, but can be used to manipulate things depending on where you are running things (e.g. turning a debugging mode on, or telling your CI sever that you’re compiling for production).

### _settings.global.scss

This is an example globals file; it contains any settings that are available to your entire project. These variables and settings could be basline values, line height, z-index map, breakpoints etc.

## BEM & Suit CSS Naming Conventions

A very popular and super-helpful convention for naming CSS components is [BEM](http://getbem.com/introduction/) , developed by the Yandex, the popular Russian search engine. The naming convention is very simple:

```
[BLOCK]__[ELEMENT]–[MODIFIER]
```

```css
/* block */
.c-photo {}

/* element */
.c-photo__img {}

/* modifier */
.c-photo--large {}
```

On this project we will namespace each component with the client abbreviation `pi_`.

```css
/* block */
.pi-photo {}

/* element */
.pi-photo__img {}

/* modifier */
.pi-photo--large {}
```

### Explicit rules around Sass nesting

Nesting in Sass can be very convenient, but runs the risk of poor output with overly long selector strings.

We follow the basics of the [Inception Rule](http://thesassway.com/beginner/the-inception-rule) but also trying to keep CSS as dry as possible from Sass. And **never nested Sass more than three layers deep**.

#### Nesting components, Cross-Component… Components

A component should not know about the implementation of its dependencies. The appearance of dependencies must be configured using the interface they provide.

The most [robust](https://www.smashingmagazine.com/2016/06/battling-bem-extended-edition-common-problems-and-how-to-avoid-them/) [option](https://github.com/suitcss/suit/blob/master/doc/components.md#styling-dependencies) would be to use something that is called in BEM a [mix](https://en.bem.info/forum/4/) or [adopted child](http://simurai.com/blog/2015/05/11/nesting-components) as Simurai calls it.

```html
<header class="pi-header">
	<button class="pi-header-item pi-button">Button</button>
</header>
```

```scss
// What would we do if we don’t want to create an own child, but still have one.
// Right, we could adopt one. In our example we adopt a Button component as our own child.
// We didn’t create it, but now we can tweak.. erm.. I mean “raise” it like it’s our own

// born in button.scss (with its own font-size)
.pi-button {
  font-size: 1em;
}

// raised in header.css (adopted component where we override properties we need, and we don't touch the original one)
.pi-header .header-item {
  font-size: .75em;
}
```

or as an alternative

```html
<header class="pi-header">
	<button class="pi-header__pi-button pi-button">Button</button>
</header>
```

It is a bit uncommon that the same HTML element shares classes from two different components. And it’s not without any risks. More about them later. But I really like this approach because it keeps the components independent without having to know about each other.

Another nice thing is that if we want to add other components to the Header that also need the same adjustments, we can reuse the same Header-item class, like for example on a text Input.

Depending on what properties we wanna change, it might not always be ideal. For example, because the Button already had font-size defined, we had to increase specificity by using .Header .Header-item. But that would also override variations like .Button--small. That might be how we want it, but there are also situations where we’d like the variation to always be “stronger”. An example would be when changing colors.

**The recommandation** would be to aviod this type of sittuation

The cosmetics of a truly modular UI element should be totally agnostic of the element’s parent container — it should look the same regardless of where you drop it. Adding a class from another component for bespoke styling, as the “mix” approach does, violates the [open/closed principle](https://en.wikipedia.org/wiki/Open/closed_principle) of component-driven design — i.e there should be no dependency on another module for aesthetics.

Your best bet is to use a modifier for these small cosmetic differences, because you may well find that you wish to reuse them elsewhere as your project grows.

Even if you never use those additional classes again, at least you won’t be tied to the parent container, specificity or source order to apply the modifications.

Of course, the other option is to go back to your designer and tell them that the button should be consistent with the rest of the buttons on the website and to avoid this issue altogether :troll:.

#### When to use a modifier or New Component

One of the biggest problems is deciding where a component ends and a new one begins.

It’s very easy to over-modularize and make everything a component. I recommend starting with modifiers, but if you find that your specific component CSS file is getting difficult to manage, then it’s probably time to break out a few of those modifiers. A good indicator is when you find yourself having to reset all of the “block” CSS in order to style your new modifier — this, to me, suggests new component time.

#### Not all elements should have a class

&lt;p&gt; tags for example should never have a class.

The general rule of thump is those elments that will probably never change to something else (&lt;p&gt;, &lt;i&gt;, &lt;span&gt;, &lt;ul&gt;&lt;li&gt; sometimes) should not have a class.

Adding a class to everything although it gives you control, pollutes your markup with classes. Most cases the markup never changes.

#### Responsive suffixes

An example of this might be a dropdown menu that converts to a set of tabs at a given breakpoint, or offscreen navigation that switches to a menu bar at a given breakpoint.

Essentially, one component would have two very different cosmetic treatments, dictated by a media query.

A good option to follow could be to prefix the class (using the same values as our breakpoints map is defined)

```html
<ul class="sm:u-mb-1 md:u-hide">
```

## Namespaces

There are three different namespaces directly relevant:

* **.o-: Objects** _(o-list-inline)_ - Base elements that need styling to change apperance.
* **.pi-: Components** _(pi-card pi-checklist)_ - Form the backbone of an application and contain all of the cosmetics for a standalone component.
* **.l-: Layout** _(l-grid l-container)_ - These modules have no cosmetics and are purely used to position c- components and structure an application’s layout.
* **.u-: Utilities** _(u-show u-hide)_ - These utility classes have a single function, sometimes using !important to boost their specificity.
* **.is-: OR .has-: State** _(is-visible has-loaded)_ - Indicate different states that a c- component can have.
* **.p-: Page** _(p-acount-creation)_ - Page specific classes that can't be coupled with any components.
* **.js-: Javascript hooks** _(js-tab-switcher)_ - These indicate that JavaScript behavior is attached to a component. No styles should be associated with them; they are purely used to enable easier manipulation with script.

In short: Every class in either of these three directories gets the appropriate prefix in its classname. All classes in one of these three layers has this kind of prefix. Be sure to follow this convention in your own code as well to keep a consistent naming convention across your code base.

## Syntax & Formatting

Roughly, we want:

* one (1) tab indents, no spaces;
* ideally, 80-characters wide lines;
* properly written multi-line CSS rules;
* meaningful use of whitespace.

### Numbers

In Sass, number is a data type including everything from unitless numbers to lengths, durations, frequencies, angles and so on. This allows calculations to be run on such measures.

#### ZEROS

Numbers should display leading zeros before a decimal value less than one. Never display trailing zeros.

```css
// Yep
.foo {
	padding: 2em;
	opacity: 0.5;
}

// Nope
.foo {
	padding: 2.0em;
	opacity: .5;
}
```

#### UNITS

When dealing with lengths, a 0 value should never ever have a unit.

```scss
// Yep
$length: 0;

// Nope
$length: 0em;
```

#### CALCULATIONS

Top-level numeric calculations should always be wrapped in parentheses. Not only does this requirement dramatically improve readability, it also prevents some edge cases by forcing Sass to evaluate the contents of the parentheses.

```css
// Yep
.foo {
  width: (100% / 3);
}

// Nope
.foo {
  width: 100% / 3;
}
```

#### MAGIC NUMBERS

“Magic number” is an [old school programming](http://en.wikipedia.org/wiki/Magic_number_(programming)#Unnamed_numerical_constants) term for unnamed numerical constant. Basically, it’s just a random number that happens to just work™ yet is not tied to any logical explanation.

Needless to say magic numbers are a plague and should be avoided at all costs. When you cannot manage to find a reasonable explanation for why a number works, add an extensive comment explaining how you got there and why you think it works. Admitting you don’t know why something works is still more helpful to the next developer than them having to figure out what’s going on from scratch.

```css
/**
 * 1. Magic number. This value is the lowest I could find to align the top of
 * `.foo` with its parent. Ideally, we should fix it properly.
 */
.foo {
  top: 0.327em; /* 1 */
}
```

On topic, CSS-Tricks has a [terrific article](http://css-tricks.com/magic-numbers-in-css/) about magic numbers in CSS that I encourage you to read.

### CSS: order

To keep everything maintainable and easy to read css properties should be ordered as follows:

**Layout:**	The position of the element in space. Eg.: position, top, z-index.
**Box:**	The element itself. Eg.: display, overflow, box-sizing.
**Visual:**	Design of the element. Eg.: color, border, background.
**Type:**	Typesetting of the element. Eg.: font-family, text-transform.

```css
.button {
	position: relative;
	z-index: 10;

	display: inline-flex;
	margin: 1rem 0;
	padding: 0 0.5rem;

	background: #3f55aa;
	border-radius: 0.5rem;
	border: 1px solid white;
	color: white;
	transition: opacity 100ms ease;

	font-family: sans-serif;
	font-size: 1rem;
	text-transform: uppercase;
}
```

## Typography, spacing, design tokens

The general rule is to always use the design tokens values (via direct vars, mixins or functions) for typography, spacing and color.

## Media queries

Use the provided mixins to add any responsive updates to your CSS.

## Utility classes

Make use of them to space and define page level structure and component alignment and composition. Use responsive prefixes for them in case you need them.
