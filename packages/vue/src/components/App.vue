<template>
  <main>
    <section>
      <h1>csv-to-javascript <small>by ryanspice for backbase</small></h1>
      <p>Create an app that is capable of importing the attached MOCK_DATA.csv and visualize it on the screen.</p>
      <h3>vue</h3>
      <p>This page was created using 'create-vue-app' and my 'csv-to-javascript' solution enabling a multiple ways to parse CSV.</p>
      <p>'csv-to-javascript' includes support for all of the example's methods of importing *.csv files.</p>
      <p>e.g. vanilla parse, csv-loader, papaparse, and cli using custom algorithm</p>
    </section>
    <section>
      <h4>File: <span id="file"></span>/span></h4>
    </section>
    <ol></ol>
  </main>
</template>

<script>
  export default {
    name: 'app'
  }
</script>

<!-- CSS libraries -->

<style src="normalize.css/normalize.css"></style>

<!-- CSS  -->

<style>
  @import url("https://fonts.googleapis.com/css?family=Niramit");
  :root {
    --alizarin-crimson:#E32636;
    --sap-green:#0A3410;
    --van-dyke-brown:#221B15;
  }
  body {
    max-width:1080px;
    margin:0px auto;
    background: #FAFAFA;
    font-family:Niramit;
  }
  ol {
    border-top:1px solid;
    padding-inline-start: 0px;
  }
  li span.chevron {
    margin-top:2px;
    opacity:0;
    transition: opacity 200ms;
    width:100%;
  }
  li span.chevron.active {
    margin-top:4px;
    opacity:1;
    transition: opacity 200ms;
  }
  li span:hover .chevron {
    margin-top:4px;
    opacity:1;
    transition: opacity 100ms;
  }
  li:hover {
    transition: all 100ms;
    text-shadow: var(--van-dyke-brown) 0px 0px 2px;
    cursor:pointer;
  }
  li:first-child:hover {
    transition: all 200ms;
    text-shadow: none;
    cursor:pointer
  }
  li:first-child span:hover {
    transition: all 100ms;
    text-shadow: var(--alizarin-crimson) 0px 0px 2px;
    cursor:pointer
  }
  li {
    padding-top:2px;
    padding-bottom:2px;
    margin:0px auto;
    list-style: none;
    width:100%;
    font-size:1.2rem;
    transition: all 500ms;
  }
  li:first-child{
    user-select: none;
    font-size:1.3rem;
    font-weight: bold;
  }
  li a {
    text-decoration: none;
    width:100%;
    display:block;
  }
  li a:hover {
    outline:1px solid rgba(25,25,25,0.01);
  }
  li span {
    width:25%;
    display:inline-block;
    text-align:center;
  }
  /* chevron stuff :: https://codepen.io/egf/pen/jzylw*/
  .chevron::before {
    border-style: solid;
    border-width: 0.15em 0.15em 0 0;
    content: '';
    display: inline-block;
    height: 0.45em;
    left: 0.15em;
    position: relative;
    top: 0.15em;
    transform: rotate(-45deg);
    vertical-align: top;
    width: 0.45em;
  }
  .chevron.right:before {
    left: 0;
    transform: rotate(45deg);
  }
  .chevron.bottom:before {
    top: 0;
    transform: rotate(135deg);
  }
  .chevron.left:before {
    left: 0.25em;
    transform: rotate(-135deg);
  }
</style>
<script>

