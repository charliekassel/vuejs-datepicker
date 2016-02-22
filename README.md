# Datepicker

## Install

``` bash
npm i vuejs-datepicker
```

## Usage
``` html

<datepicker value="2016-02-22"></datepicker>
<datepicker value="2016-02-22" name="uniquename"></datepicker>
<datepicker value="2016-02-22" name="uniquename" :disabled="state.disabled"></datepicker>


var state = {
    disabled: {
        to: new Date(2016, 0, 25),
        from: new Date(2016, 6, 1)    
    }
}

```


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

For more information see the [docs for vueify](https://github.com/vuejs/vueify).
