# Datepicker

![](https://travis-ci.org/charliekassel/vuejs-datepicker.svg?branch=master) [![Coverage Status](https://coveralls.io/repos/github/charliekassel/vuejs-datepicker/badge.svg?branch=master)](https://coveralls.io/github/charliekassel/vuejs-datepicker?branch=master)

## Demo

http://www.webpackbin.com/N1vgz1XRb

## Install

``` bash
npm install vuejs-datepicker --save
```

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# run unit tests
npm test
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
| ----------- |:----------------:|---------:|
| en          | English          | *Default*| 
| es          | Spanish          |          |
| fr          | French           |          |
| nl          | Dutch            |          |
| pt-br       | Portuguese-Brazil|          |
| vi          | Vietnamese       |          |
| zh          | Chinese          |          |
