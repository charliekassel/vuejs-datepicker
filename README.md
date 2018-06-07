# Datepicker

[![Travis Build](https://img.shields.io/travis/charliekassel/vuejs-datepicker.svg)](https://travis-ci.org/charliekassel/vuejs-datepicker)
[![Version](https://img.shields.io/npm/v/vuejs-datepicker.svg)](https://www.npmjs.com/package/vuejs-datepicker)
[![Coveralls github](https://img.shields.io/coveralls/github/charliekassel/vuejs-datepicker.svg)](https://coveralls.io/github/charliekassel/vuejs-datepicker?branch=master)
[![Downloads](https://img.shields.io/npm/dm/vuejs-datepicker.svg)](https://www.npmjs.com/package/vuejs-datepicker)

A datepicker Vue component. Compatible with Vue 2.x

- [Demo](#demo)
- [Install](#install)
- [Usage](#usage)
- [Date Formatting](#date-formatting)
- [Props](#available-props)
- [Events](#events)
- [Disabled dates](#disabled-dates)
- [Highlighted dates](#highlighted-dates)
- [Translations](#translations)

NB. Vue 1.x was supported up to version v0.9.9. If you want to use this component with Vue 1.x you can install with `yarn install vuejs-datepicker@0.9.9`

## Fork changes:

Had the need to select a range from date A -> date B, therefore I created a simple range prop.

`<datepicker :range="true"  v-model="exampleRange" placeholder="Select range"></datepicker>`

![](https://i.gyazo.com/1eac7a7af9fe02b58df9d2b45aae2e17.gif)


This prop modifies some of the core functionality of the datepicker;

- The picker is not closed on selection (like inline)
- the picker lets user select two dates, one start and one end date.
- When range prop is true, the picker's input emits an object instead of date: 
`{ "from": "2018-06-07T21:55:00.000Z", "to": "2018-06-15T21:55:00.000Z" }`
- Input field value is updated with two dates: `07 - 15 Jun` (or `01 Jan - 01 Feb` if the months are not the same)
- `:format` prop formats both dates instead of default "selectedDate"
- I modified the highlighted prop to allow for visualisation of the selected dates

## Demo

To view a demo online:
https://codesandbox.io/s/mpklq49wp

To view demo examples locally clone the repo and run `yarn install && yarn serve`

## Install

``` bash
npm install vuejs-datepicker --save
```
or
``` bash
yarn add vuejs-datepicker
```

``` javascript
import Datepicker from 'vuejs-datepicker';

export default {
  // ...
  components: {
    Datepicker
  }
  // ...
}
```

Or use directly from a CDN
``` html
<div id="app">
  <vuejs-datepicker></vuejs-datepicker>
</div>
<script src="https://unpkg.com/vue"></script>
<script src="https://unpkg.com/vuejs-datepicker"></script>
<script>
const app = new Vue({
  el: '#app',
  components: {
  	vuejsDatepicker
  }
})
</script>
```

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
| format                        | String\|Function| dd MMM yyyy | Date formatting string or function       |
| full-month-name               | Boolean         | false       | To show the full month name              |
| language                      | Object          | en          | Translation for days and months          |
| disabled-dates                | Object          |             | See below for configuration              |
| placeholder                   | String          |             | Input placeholder text                   |
| range                         | Boolean         |             | Let user select a date range             |
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
| bootstrap-styling             | Boolean         | false       | Output bootstrap styling classes         |
| initial-view                  | String          | minimumView | If set, open on that view                |
| disabled                      | Boolean         | false       | If true, disable Datepicker on screen    |
| required                      | Boolean         | false       | Sets html required attribute on input    |
| typeable                      | Boolean         | false       | If true, allow the user to type the date |
| open-date                     | Date\|String    |             | If set, open on that date                |
| minimum-view                  | String          | 'day'       | If set, lower-level views won't show     |
| maximum-view                  | String          | 'year'      | If set, higher-level views won't show    |


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

NB. This is not very robust at all - use at your own risk! Needs a better implementation.

| Token | Desc                   | Example     |
|-------|------------------------|-------------|
| d     | day                    | 1           |
| dd    | 0 prefixed day         | 01          |
| D     | abbr day               | Mon         |
| su    | date suffix            | st, nd, rd  |
| M     | month number (1 based) | 1 (for Jan) |
| MM    | 0 prefixed month       | 01          |
| MMM   | abbreviated month name | Jan         |
| MMMM  | month name             | January     |
| yy    | two digit year         | 16          |
| yyyy  | four digit year        | 2016        |

#### Function formatter

Delegates date formatting to provided function.
Function will be called with date and it has to return formated date as a string.
This allow us to use moment, date-fns, globalize or any other library to format date.

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

Contributing guide - please use appropriate code from this [list](http://www.iana.org/assignments/language-subtag-registry/language-subtag-registry) as the translation property.

- Add your language as a module in the `src/locale/translations` dir.
- Import and export it in the `src/locale/index` file
- Add the Language to the available languages in the readme file.
- Run `npm run lint` to make sure your code formatting is in line with the required code style.

```javascript
import {en, es} from 'vuejs-datepicker/dist/locale'
<datepicker :language="es"></datepicker>
```
Available languages

| Abbr        | Language         |          |
| ----------- |------------------|----------|
| af          | Afrikaans        |          |
| ar          | Arabic           |          |
| bg          | Bulgarian        |          |
| bs          | Bosnian          |          |
| ca          | Catalan          |          |
| cs          | Czech            |          |
| da          | Danish           |          |
| de          | German           |          |
| ee          | Estonian         |          |
| el          | Greek            |          |
| en          | English          | *Default*|
| es          | Spanish          |          |
| fa          | Persian (Farsi)  |          |
| fi          | Finnish          |          |
| fo          | Faroese          |          |
| fr          | French           |          |
| ge          | Georgia          |          |
| he          | Hebrew           |          |
| hu          | Hungarian        |          |
| hr          | Croatian         |          |
| id          | Indonesian       |          |
| is          | Icelandic        |          |
| it          | Italian          |          |
| ja          | Japanese         |          |
| ko          | Korean           |          |
| lb          | Luxembourgish    |          |
| lt          | Lithuanian       |          |
| lv          | Latvian          |          |
| mn          | Mongolian        |          |
| nb-no       | Norwegian Bokmål |          |
| nl          | Dutch            |          |
| pl          | Polish           |          |
| pt-br       | Portuguese-Brazil|          |
| ro          | Romanian         |          |
| ru          | Russian          |          |
| sk          | Slovak           |          |
| sl-si       | Slovenian        |          |
| sv          | Swedish          |          |
| sr          | Serbian (Latin)  |          |
| sr-Cyrl     | Serbian (Cyrl)   |          |
| th          | Thai             |          |
| tr          | Turkish          |          |
| uk          | Ukrainian        |          |
| ur          | Urdu             |          |
| vi          | Vietnamese       |          |
| zh          | Chinese          |          |
