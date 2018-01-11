# Datepicker

![](https://travis-ci.org/charliekassel/vuejs-datepicker.svg?branch=master) [![Coverage Status](https://coveralls.io/repos/github/charliekassel/vuejs-datepicker/badge.svg?branch=master)](https://coveralls.io/github/charliekassel/vuejs-datepicker?branch=master)

A datepicker Vue component. Compatible with Vue 2.x

NB. Vue 1.x was supported up to version v0.9.9. If you want to use this component with 1.x you can install with `npm install vuejs-datepicker@0.9.9`

## Demo

To view a demo online:
https://codesandbox.io/s/mpklq49wp

To view demo examples locally clone the repo and run `npm install && npm run dev`

## Install

``` bash
$ npm install vuejs-datepicker --save
```
``` javascript
import Datepicker from 'vuejs-datepicker';

Vue.component('my-component', {
    components: {
        Datepicker
    }
});
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
Use `v-model` for two-way binding
``` html
<datepicker v-model="state.date" name="uniquename"></datepicker>
```
Emits events
``` html
<datepicker v-on:selected="doSomethingInParentComponentFunction" v-on:opened="datepickerOpenedFunction" v-on:closed="datepickerClosedFunction">
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
| language                      | String          | en          | Translation for days and months          |
| disabled                      | Object          |             | See below for configuration              |
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
| bootstrapStyling              | Boolean         | false       | Output bootstrap styling classes         |
| initial-view                  | String          | minimumView | If set, open on that view                |
| disabled-picker               | Boolean         | false       | If true, disable Datepicker on screen    |
| required                      | Boolean         | false       | Sets html required attribute on input    |
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
Dates can disabled in a number of ways.

``` html
<script>
var state = {
    disabled: {
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
<datepicker :disabled="state.disabled"></datepicker>
```

## Highlight Dates
Dates can be highlighted (e.g. for marking an appointment) in a number of ways. Important: You can only highlight dates, that aren't disabled.
Note: Both `to` and `from` properties are require to define a range of dates to highlight

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
        }
    }
}
</script>
<datepicker :highlighted="state.highlighted"></datepicker>
```


## Translations

Contributing guide - please use appropriate code from this [list](http://www.iana.org/assignments/language-subtag-registry/language-subtag-registry) as the translation property.

- Add your language object to the DateLanguages.js file. Please keep in alphabetical order.
- Add the Language to the available languages in the readme file.
- Run `npm run lint` to make sure your code formatting is in line with the required code style.

``` html
<datepicker language="es"></datepicker>
```
Available languages

| Abbr        | Language         |          |
| ----------- |------------------|----------|
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
