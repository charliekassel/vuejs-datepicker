<template>
    <div id="app">

        <h1>Datepicker Examples</h1>

        <div class="example">
            <h3>Default datepicker</h3>
            <datepicker placeholder="Hello"></datepicker>
            <code>
                &lt;datepicker&gt;&lt;/datepicker&gt;
            </code>
        </div>

        <div class="example">
            <h3>Sync picked value to external object</h3>
            <datepicker :value.sync="state.date1"></datepicker>
            <pre>
&lt;datepicker :value.sync="state.date1"&gt;&lt;/datepicker&gt;

var state = {
    date1 = new Date()
}
            </pre>
            <div class="settings">
                <h5>External state</h5>
                <p>state = {{ state | json }}</p>
            </div>
        </div>

        <div class="example">
            <h3>Format datepicker</h3>
            <datepicker :format="format"></datepicker>
            <code>
                &lt;datepicker :format="format"&gt;&lt;/datepicker&gt;
            </code>
            <div class="settings">
                <h5>Settings</h5>
                <div class="form-group">
                    <label>Format</label>
                    <select v-model="format">
                        <option value="d MMM yyyy" selected>d MMM yyyy - e.g 12 Feb 2016</option>
                        <option value="d MMMM yyyy">d MMMM yyyy - e.g 12 February 2016</option>
                        <option value="yyyy-MM-dd">yyyy-MM-dd - e.g 2016-02-12</option>
                        <option value="dsu MMM yyyy">dsu MMM yyyy - e.g 12th Feb 2016</option>
                        <option value="D dsu MMM yyyy">D dsu MMM yyyy - e.g Sat 12th Feb 2016</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="example">
            <h3>Events</h3>
            <datepicker name="eventtest"></datepicker>
            <code>
                &lt;datepicker  name="eventtest"&gt;&lt;/datepicker&gt;
            </code>
            <div class="settings">
                <h5>Output</h5>
                <div class="form-group">
                    <p>{{ eventMsg }}</p>
                </div>
            </div>
        </div>


        <div class="example">
            <h3>With minimum and maximum date range</h3>
            <datepicker :disabled="disabled"></datepicker>
            <code>
                &lt;datepicker :disabled="disabled"&gt;&lt;/datepicker&gt;
            </code>
            <div class="settings">
                <h5>Settings</h5>
                <div class="form-group">
                    <label>Disabled to:</label>
                    <datepicker name="to"></datepicker>
                </div>
                <div class="form-group">
                    <label>Disabled from:</label>
                    <datepicker name="from"></datepicker>
                </div>
                <pre>disabled: {{ disabled | json }}</pre>
            </div>
        </div>

        <div class="example">
            <h3>Translations</h3>
            <h5>Spanish datepicker</h5>
            <datepicker language="es"></datepicker>
            <code>
                &lt;datepicker language="es"&gt;&lt;/datepicker&gt;
            </code>
            <h5>French datepicker</h5>
            <datepicker language="fr"></datepicker>
            <code>
                &lt;datepicker language="fr"&gt;&lt;/datepicker&gt;
            </code>
        </div>

        <div class="example">
            <h3>Inline datepicker</h3>
            <datepicker :inline="true"></datepicker>
            <code>
                &lt;datepicker :inline="true"&gt;&lt;/datepicker&gt;
            </code>
        </div>

    </div>
</template>

<script>

import Datepicker from './components/Datepicker.vue'

var state = {
    date1: new Date()
}

export default {
    components: {
        Datepicker
    },
    data() {
        return {
            format: 'd MMMM yyyy',
            disabled: {},
            eventMsg: null,
            state: state
        }
    },
    ready() {
        this.$on('datepicker.to', (val)=> {
            if (typeof this.disabled.to === 'undefined') {
                this.disabled = Object.assign({}, this.disabled, {
                    to: null,
                });
            }
            this.disabled.to = new Date(val.value);
        });

        this.$on('datepicker.from', (val)=> {
            if (typeof this.disabled.from === 'undefined') {
                this.disabled = Object.assign({}, this.disabled, {
                    from: null
                });
            }
            this.disabled.from = new Date(val.value);
        });

        this.$on('datepicker.eventtest', (val)=> {
            this.eventMsg = 'Date picked! ' + new Date(val.value)
        })
    }
}
</script>

<style>
body {
    font-family: 'Helvetica Neue Light', Helvetica, sans-serif;
    padding: 1em 2em 2em;
}
input, select {
    padding: .75em .5em;
    font-size: 100%;
    border: 1px solid #ccc;
    width: 100%
}

select {
    height: 2.5em;
}

.example {
    background: #f2f2f2;
    border: 1px solid #ddd;
    padding: 0em 1em 1em;
    margin-bottom: 2em;
}

code,
pre {
    margin: 1em 0;
    padding: 1em;
    border: 1px solid #bbb;
    display: block;
    background: #ddd;
    border-radius: 3px;
}

.settings {
    margin: 2em 0;
    /*padding: 0 1.5em 1.5em;*/
    border-top : 1px solid #bbb;
    background: #eee;
}

h5 {
    font-size:100%;
    padding: 0;
}

.form-group {
    margin-bottom: 1em;
}

.form-group label {
    font-size: 80%;
    display: block;
}

</style>
