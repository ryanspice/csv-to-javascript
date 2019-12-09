import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

it('does not crash', () => {
  const Ctor = Vue.extend(App)
  const vm = new Ctor().$mount()
  expect(vm.$el.textContent).toMatch("csv-to-javascript by ryanspice for backbase Create an app that is capable of importing the attached MOCK_DATA.csv and visualize it on the screen. vue This page was created using 'create-vue-app' and my 'csv-to-javascript' solution enabling a multiple ways to parse CSV. 'csv-to-javascript' includes support for all of the example's methods of importing *.csv files. e.g. vanilla parse, csv-loader, papaparse, and cli using custom algorithm File:  ")
})
