<template>
    <div id="app">
        <datepicker value="2016-02-17" format="yyyy-MM-dd" :disabled="state1"></datepicker>
    

        <div>
        <label>Disabled to:</label>
        <datepicker name="to" :disabled="state2"></datepicker>
        </div>
        <div>
        <label>Disabled from:</label>
        <datepicker name="from" :disabled="state3"></datepicker>
        </div>


<hr>
<div><pre>state1: {{ state1 | json }}</pre></div>
<div><pre>state2: {{ state2 | json }}</pre></div>
<div><pre>state3: {{ state3 | json }}</pre></div>


    </div>
</template>

<script>
import Datepicker from './components/Datepicker.vue'



export default {
    components: {
        Datepicker
    },
    data() {
        return {
            format: 'd MMMM yyyy',
            state1: {},
            state2: {},
            state3: {}
            
        }
    },
    ready() {
        this.$on('datepicker.to', (val)=> {

            if (typeof this.state1.to === 'undefined') {
                this.state1 = Object.assign({}, this.state1, {
                    to: null,
                });
            }

            this.state1.to = new Date(val.value);
        });

        this.$on('datepicker.from', (val)=> {

            if (typeof this.state1.from === 'undefined') {
                this.state1 = Object.assign({}, this.state1, {
                    from: null
                });
            }
        
            this.state1.from = new Date(val.value);

        });
    }
}
</script>

<style>
body {
  font-family: Helvetica, sans-serif;
}
</style>
