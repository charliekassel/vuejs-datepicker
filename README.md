# Datepicker 2

A datepicker Vue component. Compatible with Vue 2.x

- [Demo](#demo)
- [Install](#install)
- [Upgrade to 2.x+](#upgrade)
- [Usage](#usage)
- [Date Formatting](#date-formatting)
- [Props](#available-props)
- [Events](#events)
- [Disabled dates](#disabled-dates)
- [Highlighted dates](#highlighted-dates)
- [Translations](#translations)

## fork
this is a fork of https://github.com/charliekassel/vuejs-datepicker,
which includes following breaking changes:
* Upgrade all libraries
* uses vue-eslint-parser for eslint.
* Fixed SSR support for NuxtJS (**breaking change v2**) see also [regarding CSS / styles](#regarding-css)
* Merged #611: show calendar on focus prop
* Merged #626: fixes missing close and open events
* Based on #536: Allow custom types, I changed the method to getTypedDate which should return a fully parsed Date object. 
* Added a beforeDateInput slot.
* uses moment.js for translations  (**breaking change v2+**) see [momentjs / translations](#momentjs-and-translations)
* dropped internal formatting rules and also used moment.js (**breaking change 2.x+**) see [momentjs / formatting](#momentjs-and-formatting)

## Demo

To view a demo online:
https://codesandbox.io/s/vue-datepicker-demo-82x48

To view demo examples locally clone the repo and run `npm install && npm run serve`

## Install

``` bash
npm install @hokify/vuejs-datepicker
```
or
``` bash
yarn add @hokify/vuejs-datepicker
```

``` javascript
import Datepicker from '@hokify/vuejs-datepicker';

export default {
  // ...
  components: {
    Datepicker
  }
  // ...
}
```

## Upgrade
To upgrade to version 2+ check:
* add explicit css inclues, see [regarding CSS / styles](#regarding-css)
* change translation to moment.js, see [momentjs / translations](#momentjs-and-translations)
* change date formats to moment.js, see [momentjs / formatting](#momentjs-and-formatting)

### momentjs and translations

I've dropped the additional translations and use the moment.js directly, 
therefore you need to remove all dependenices
for the "locale" imports e.g.:
```import {en, es} from 'vuejs-datepicker/dist/locale'```

The language property changed from an locale object to a simple string (en,de,..)!
Please see [Translations](#translations) section how to set up your language.

### momentjs and formatting

change custom date formatting to moment js date formatting: https://momentjs.com/docs/#/displaying/
Examples:

| Old                          | New (moment.js)  | Displays          |
|-------------------------------|-----------------|------------------ |
| d MMM yyyy                    | D MMM YYYY      | 12 Feb 2016       |
| d MMMM yyyy                   | D MMMM YYYY     | 12 February 2016  |
| yyyy-MM-dd                    | YYYY-MM-DD      | 2016-02-12        |
| dsu MMM yyyy                  | Do MMM YYYY     | 12th Feb 2016     |
| D dsu MMM yyyy                | ddd Do MMM YYYY | Sat 12th Feb 2016 |

### regarding CSS
As this bundle is also useable for SSR rendering, you have to take care of css yourself. 
(see also https://github.com/vuejs/rollup-plugin-vue/issues/266)
I strongly recommend to create a custom component, that wraps the vuejs-datepicker. Then
it's easy to add custom css and have a consistent style for the datepicker.

#### Method 1: try to include the css directly.
Ensure you have postcss-import up and running. (https://github.com/postcss/postcss-import)
E.g.via:
```
<style lang="scss">
/* purgecss start ignore */
@import "@hokify/vuejs-datepicker/dist/vuejs-datepicker.css"
/* purgecss end ignore */
</style>
```

If you do not use purgeCSS, you can safely remove the comment lines 

#### Method 2: via global nuxt config:
add inside nuxt.config:

```
css: [
 {
  src: '@hokify/vuejs-datepicker/dist/vuejs-datepicker.css',
  lang: 'css'
 },
```

#### Method 3: Copy the relevant css selectors to your custom component.
I'm using this method, as I actually customized the datepicker and therefore don't need to
overwrite css classes again with my style.

```
<style lang="scss">
	.vdp-datepicker {
		overflow: visible;
		display: inline-block;
		....
	}
	...
</style>
```

Ping me if you have any better approaches! :)

## Usage

``` html
<datepicker></datepicker>
```

*value* prop if passed should be a Date object

``` html
<script>
var state = {
  date: new Date(2016, 9,  16)
}
</script>
<datepicker :value="state.date"></datepicker>
```
support name attribute for normal html form submission
``` html
<datepicker :value="state.date" name="uniquename"></datepicker>
```
Using `v-model`
``` html
<datepicker v-model="state.date" name="uniquename"></datepicker>
```
Emits events
``` html
<datepicker @selected="doSomethingInParentComponentFunction" @opened="datepickerOpenedFunction" @closed="datepickerClosedFunction">
```
Inline always open version
``` html
<datepicker :inline="true"></datepicker>
```
## Available props

| Prop                          | Type            | Default     | Description                              |
|-------------------------------|-----------------|-------------|------------------------------------------|
| value                         | Date\|String    |             | Date value of the datepicker             |
| name                          | String          |             | Input name property                      |
| id                            | String          |             | Input id                                 |
| format                        | String\|Function| DD MMM YYYY | Date formatting string or function       |
| full-month-name               | Boolean         | false       | To show the full month name              |
| language                      | String          | en          | Translation for days and months          |
| disabled-dates                | Object          |             | See below for configuration              |
| placeholder                   | String          |             | Input placeholder text                   |
| inline                        | Boolean         |             | To show the datepicker always open       |
| calendar-class                | String\|Object  |             | CSS class applied to the calendar el     |
| input-class                   | String\|Object  |             | CSS class applied to the input el        |
| wrapper-class                 | String\|Object  |             | CSS class applied to the outer div       |
| monday-first                  | Boolean         | false       | To start the week on Monday              |
| clear-button                  | Boolean         | false       | Show an icon for clearing the date       |
| clear-button-icon             | String          |             | Use icon for button (ex: fa fa-times)    |
| calendar-button               | Boolean         | false       | Show an icon that that can be clicked    |
| calendar-button-icon          | String          |             | Use icon for button (ex: fa fa-calendar) |
| calendar-button-icon-content  | String          |             | Use for material-icons (ex: event)       |
| day-cell-content              | Function        |             | Use to render custom content in day cell |
| bootstrap-styling             | Boolean         | false       | Output bootstrap v4 styling classes.     |
| initial-view                  | String          | minimumView | If set, open on that view                |
| disabled                      | Boolean         | false       | If true, disable Datepicker on screen    |
| required                      | Boolean         | false       | Sets html required attribute on input    |
| typeable                      | Boolean         | false       | If true, allow the user to type the date |
| use-utc                       | Boolean         | false       | use UTC for time calculations            |
| open-date                     | Date\|String    |             | If set, open on that date                |
| minimum-view                  | String          | 'day'       | If set, lower-level views won't show     |
| maximum-view                  | String          | 'year'      | If set, higher-level views won't show    |
| parse-typed-date	          	| Function: Date  |             | Use to parse custom date for typed input |

## Events

These events are emitted on actions in the datepicker

| Event             | Output     | Description                          |
|-------------------|------------|--------------------------------------|
| opened            |            | The picker is opened                 |
| closed            |            | The picker is closed                 |
| selected          | Date\|null | A date has been selected             |
| selectedDisabled  | Object     | A disabled date has been selected    |
| input             | Date\|null | Input value has been modified        |
| cleared           |            | Selected date has been cleared       |
| changedMonth      | Object     | Month page has been changed          |
| changedYear       | Object     | Year page has been changed           |
| changedDecade     | Object     | Decade page has been changed         |


## Date formatting

#### String formatter

Uses moment.js for date formatting.
See https://momentjs.com/docs/#/displaying/
Examples:

| Example        | Displays          |
|------------------|------------------ |
| D MMM YYYY      | 12 Feb 2016       |
| D MMMM YYYY     | 12 February 2016  |
| YYYY-MM-DD      | 2016-02-12        |
| Do MMM YYYY     | 12th Feb 2016     |
| ddd Do MMM YYYY | Sat 12th Feb 2016 |

| Token | Desc                   | Example     | Version <2.0 |
|-------|------------------------|-------------| ---- |
| D     | day                    | 1           | d |
| DD    | 0 prefixed day         | 01          | dd |
| dd    | abbr day               | Mon         | D |
| Do    | date of Month          | 1st 2nd ... 30th 31st  | (su) |
| M     | month number (1 based) | 1 (for Jan) | M |
| MM    | 0 prefixed month       | 01          | MM |
| MMM   | abbreviated month name | Jan         | MMM |
| MMMM  | month name             | January     | MMMM | 
| YY    | two digit year         | 16          | yy |
| YYYY  | four digit year        | 2016        | yyyy |

#### Function formatter

Delegates date formatting to provided function.
Function will be called with date and it has to return formated date as a string.
This allow us to use date-fns, globalize or any other library to format date.

``` html
<script>
  methods: {
    customFormatter(date) {
      return moment(date).format('MMMM Do YYYY, h:mm:ss a');
    }
  }
</script>
<datepicker :format="customFormatter"></datepicker>
```

## Disabled Dates
Dates can be disabled in a number of ways.

``` html
<script>
var state = {
  disabledDates: {
    to: new Date(2016, 0, 5), // Disable all dates up to specific date
    from: new Date(2016, 0, 26), // Disable all dates after specific date
    days: [6, 0], // Disable Saturday's and Sunday's
    daysOfMonth: [29, 30, 31], // Disable 29th, 30th and 31st of each month
    dates: [ // Disable an array of dates
      new Date(2016, 9, 16),
      new Date(2016, 9, 17),
      new Date(2016, 9, 18)
    ],
    ranges: [{ // Disable dates in given ranges (exclusive).
      from: new Date(2016, 11, 25),
      to: new Date(2016, 11, 30)
    }, {
      from: new Date(2017, 1, 12),
      to: new Date(2017, 2, 25)
    }],
    // a custom function that returns true if the date is disabled
    // this can be used for wiring you own logic to disable a date if none
    // of the above conditions serve your purpose
    // this function should accept a date and return true if is disabled
    customPredictor: function(date) {
      // disables the date if it is a multiple of 5
      if(date.getDate() % 5 == 0){
        return true
      }
    }
  }
}
</script>
<datepicker :disabledDates="state.disabledDates"></datepicker>
```

## Highlighted Dates
Dates can be highlighted (e.g. for marking an appointment) in a number of ways. Important:
By default disabled dates are ignored, to highlight disabled dates set the `includeDisabled`
property to `true`. Note: Both `to` and `from` properties are required to define a range of
dates to highlight.

``` html
<script>
var state = {
  highlighted: {
    to: new Date(2016, 0, 5), // Highlight all dates up to specific date
    from: new Date(2016, 0, 26), // Highlight all dates after specific date
    days: [6, 0], // Highlight Saturday's and Sunday's
    daysOfMonth: [15, 20, 31], // Highlight 15th, 20th and 31st of each month
    dates: [ // Highlight an array of dates
      new Date(2016, 9, 16),
      new Date(2016, 9, 17),
      new Date(2016, 9, 18)
    ],
    // a custom function that returns true of the date is highlighted
    // this can be used for wiring you own logic to highlight a date if none
    // of the above conditions serve your purpose
    // this function should accept a date and return true if is highlighted
    customPredictor: function(date) {
      // highlights the date if it is a multiple of 4
      if(date.getDate() % 4 == 0){
        return true
      }
    },
    includeDisabled: true // Highlight disabled dates
  }
}
</script>
<datepicker :highlighted="state.highlighted"></datepicker>
```
## Slots

Slots will help you customize content.  .

#### beforeCalendarHeader

Sometimes you need to show custom content before the calendar header. For such cases you can use the named slot `beforeCalendarHeader`.

An example would be to use bootstrap's `input-group-prepend` and `input-group-append`
to show some custom text:
``` html
<datepicker :bootstrap-styling="true">
  <div slot="beforeCalendarHeader" class="calender-header">
    Choose a Date
  </div>
</datepicker>
```

#### beforeDateInput

To implement some custom styling on DateINput, you might need to add elemnt beore the DateInput. Similar to afterDateInput, just it is before in the html DOM.

#### afterDateInput

To implement some custom styling (for instance to add an animated placeholder) on DateInput, you might need to add elements as DateInput siblings. Slot named
`afterDateInput` allows you to do that:

``` html
<datepicker>
  <span slot="afterDateInput" class="animated-placeholder">
    Choose a Date
  </span>
</datepicker>
```


## Translations

### How to apply language

See also https://momentjs.com/docs/#/i18n/loading-into-browser/
Especially if you use webpack!

1. You need to load the language file for the locale, e.g. 
Node:
```javascript
import 'moment/locale/de';
```

Browser:
```html
<script src="locale/de.js" charset="UTF-8"></script>
```

There is also a minified version including all versions:
```javascript
import 'moment/min/locales.min'
```

2. specify the language in the datepicker component:
```html
<datepicker language="de"></datepicker>
```
  
Available languages are all that moment.js supports.
See demo file or https://github.com/moment/moment/tree/develop/locale for a list of available languages and the correct language code for it.

