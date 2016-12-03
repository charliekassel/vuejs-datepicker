# Datepicker

![](https://travis-ci.org/charliekassel/vuejs-datepicker.svg?branch=master) [![Coverage Status](https://coveralls.io/repos/github/charliekassel/vuejs-datepicker/badge.svg?branch=master)](https://coveralls.io/github/charliekassel/vuejs-datepicker?branch=master)

A datepicker Vue component. Compatible with Vue 1.x and Vue 2.x

## Demo

http://www.webpackbin.com/N1vgz1XRb

## Install

``` bash
npm install vuejs-datepicker --save
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
Emits events
``` html
<datepicker v-on:selected="doSomethingInParentComponentFunction" v-on:opened="datepickerOpenedFunction">
```
Inline always open version
``` html
<datepicker :inline="true"></datepicker>
```
## Available props

| Prop         | Type         | Default     | Description                         |
|--------------|--------------|-------------|-------------------------------------|
| value        | Date         |             | Date value of the datepicker        |
| name         | String       |             | input name property                 |
| format       | String       | dd MMM yyyy | Date formatting string              |
| language     | String       | en          | Translation for days and months     |
| disabled     | Object       |             | See below for configuration         |
| placeholder  | String       |             | input placeholder text              |   
| inline       | Boolean      |             | to show the datepicker always open  |
| inputClass   | String       |             | css class applied to the input el   |
| wrapperClass | String       |             | css class applied to the outer div  |

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
| hr          | Croatian         |          |
| it          | Italian          |          |
| nl          | Dutch            |          |
| de          | German           |          |
| da          | Danish           |          |
| cs          | Czech            |          |
| pt-br       | Portuguese-Brazil|          |
| vi          | Vietnamese       |          |
| zh          | Chinese          |          |
| ja          | Japanese         |          |
| he          | Hebrew           |          |
