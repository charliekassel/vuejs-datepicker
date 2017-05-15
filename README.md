# Datepicker

![](https://travis-ci.org/charliekassel/vuejs-datepicker.svg?branch=master) [![Coverage Status](https://coveralls.io/repos/github/charliekassel/vuejs-datepicker/badge.svg?branch=master)](https://coveralls.io/github/charliekassel/vuejs-datepicker?branch=master)

A datepicker Vue component. Compatible with Vue 1.x and Vue 2.x

## Demo

https://www.webpackbin.com/bins/-KhQbtTSVuU6r8VCrIdC

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

| Prop                  | Type         | Default     | Description                              |
|-----------------------|--------------|-------------|------------------------------------------|
| value                 | Date/String  |             | Date value of the datepicker             |
| name                  | String       |             | input name property                      |
| id                    | String       |             | input id                                 |
| format                | String       | dd MMM yyyy | Date formatting string                   |
| language              | String       | en          | Translation for days and months          |
| disabled              | Object       |             | See below for configuration              |
| placeholder           | String       |             | input placeholder text                   |
| inline                | Boolean      |             | to show the datepicker always open       |
| input-class           | String       |             | css class applied to the input el        |
| wrapper-class         | String       |             | css class applied to the outer div       |
| monday-first          | Boolean      | false       | To start the week on Monday              |
| clear-button          | Boolean      | false       | Show an icon for clearing the date       |
| clear-button-icon     | String       |             | Use icon for button (ex: fa fa-times)    |
| calendar-button       | Boolean      | false       | Show an icon that that can be clicked    |
| calendar-button-icon  | String       |             | Use icon for button (ex: fa fa-calendar) |
| bootstrapStyling      | Boolean      | false       | Output bootstrap styling classes         |
| disabled-picker       | Boolean      | false       | If true, disable Datepicker on screen    |
| required              | Boolean      | false       | Sets html required attribute on input    | 

## Events

These events are emitted on actions in the datepicker

| Event         | Output     | Description                   |
|---------------|------------|-------------------------------|
| opened        |            | The picker is opened          |
| closed        |            | The picker is closed          |
| selected      | Date\|null | A date has been selected      |
| input         | Date\|null | Input value has been modified |
| cleared       |            | Selected date has been cleared|
| changedMonth  | Object     | Month page has been changed   |
| changedYear   | Object     | Year page has been changed    |
| changedDecade | Object     | Decade page has been changed  |


## Date formatting

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


#### Disabled Dates
Dates can disabled in a number of ways.

``` html
<script>
var state = {
    disabled: {
        to: new Date(2016, 0, 5), // Disable all dates up to specific date
        from: new Date(2016, 0, 26), // Disable all dates after specific date
        days: [6, 0], // Disable Saturday's and Sunday's
        dates: [ // Disable an array of dates
            new Date(2016, 9, 16),
            new Date(2016, 9, 17),
            new Date(2016, 9, 18)
        ]
    }
}
</script>
<datepicker :disabled="state.disabled"></datepicker>
```

#### Highlight Dates
Dates can be highlighted (e.g. for marking an appointment) in a number of ways. Important: You can only highlight dates, that aren't disabled.
Note: Both `to` and `from` properties are require to define a range of dates to highlight

``` html
<script>
var state = {
    highlighted: {
        to: new Date(2016, 0, 5), // Highlight all dates up to specific date
        from: new Date(2016, 0, 26), // Highlight all dates after specific date
        days: [6, 0], // Highlight Saturday's and Sunday's
        dates: [ // Highlight an array of dates
            new Date(2016, 9, 16),
            new Date(2016, 9, 17),
            new Date(2016, 9, 18)
        ]
    }
}
</script>
<datepicker :highlighted="state.highlighted"></datepicker>
```


#### Translations

``` html
<datepicker language="es"></datepicker>
```
Available languages

| Abbr        | Language         |          |
| ----------- |------------------|----------|
| en          | English          | *Default*|
| es          | Spanish          |          |
| fi          | Finnish          |          |
| fr          | French           |          |
| hu          | Hungarian        |          |
| hr          | Croatian         |          |
| id          | Indonesian       |          |
| it          | Italian          |          |
| nl          | Dutch            |          |
| de          | German           |          |
| da          | Danish           |          |
| nb-no       | Norwegian Bokmål |          |
| cs          | Czech            |          |
| pt-br       | Portuguese-Brazil|          |
| ro          | Romanian         |          |
| vi          | Vietnamese       |          |
| zh          | Chinese          |          |
| ja          | Japanese         |          |
| he          | Hebrew           |          |
| ru          | Russian          |          |
| sk          | Slovak           |          |
| sl-si       | Slovenian        |          |
| sv          | Swedish          |          |
| th          | Thai             |          |
| bg          | Bulgarian        |          |
| lt          | Lithuanian       |          |
| pl          | Polish           |          |
| ar          | Arabic           |          |
| ee          | Estonian         |          |
| ko          | Korean           |          |
| tr          | Turkish          |          |
| uk          | Ukrainian        |          |
