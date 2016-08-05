# Datepicker

![](https://travis-ci.org/charliekassel/vuejs-datepicker.svg?branch=master)

![Screenshot](screenshots/screenshot.png)

## Install

``` bash
npm install vuejs-datepicker --save
```

## Usage

*value* prop if passed should be a Date object

``` html

<datepicker></datepicker>
<datepicker :value="state.value" name="uniquename"></datepicker>
<datepicker :value.sync="state.value" name="uniquename" :disabled="state.disabled"></datepicker>
<datepicker :inline="true"></datepicker>
```

``` javascript

var state = {
    value: new Date(2016, 0, 15),
    disabled: {
        to: new Date(2016, 0, 5),
        from: new Date(2016, 0, 26)    
    }
}

```


#### Translations
Added support to languages.

``` html
<datepicker language="es"></datepicker>
```
###### Languages available
| Abbr        | Language         |          |
| ----------- |:----------------:|---------:|
| en          | English          | *Default*| 
| es          | Spanish          |          |
| fr          | French           |          |
| pt-br       | Portuguese-Brazil|          |

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# lint all *.js and *.vue files
npm run lint

# run unit tests
npm test
```
