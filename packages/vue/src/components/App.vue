
<template>

  <main>

    <section>
      <h1 id="header">csv-to-javascript <small>by ryanspice</small></h1>
      <h3>vue</h3>
      <p>This page was created using 'create-vue-app' and local package 'csv-to-javascript'.</p>
    </section>

    <section>
      <h4>File: <span id="file"></span></h4>
    </section>

    <ol></ol>

  </main>

</template>

<script>

  export default {
    name: 'app',
    mounted:()=>{

      setTimeout(()=>{

        //Remove header inside iframe
        function inIframe () {
          try {
            return window.self !== window.top;
          } catch (e) {
            return true;
          }
        }
        if (!inIframe()) {
          document.getElementById('header').removeAttribute('hidden');
        } else {
          document.getElementById('header').setAttribute('hidden','hidden');
        }

      },200);

    }
  }

</script>

<style>
  @import url("https://fonts.googleapis.com/css?family=Niramit");
  :root {
    --alizarin-crimson:#E32636;
    --sap-green:#0A3410;
    --van-dyke-brown:#221B15;
    --shadow-fang-black:rgba(25,25,25,0.25);
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
    text-overflow: clip;
    white-space: nowrap;
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

  #content {

    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }
  article {
    user-select: none;
    box-shadow: var(--shadow-fang-black) 0px 0px 5px;
    border:1px solid var(--shadow-fang-black);
    padding:1rem;
    border-radius: 12px;
    outline:none;
    transition: border 350ms;
    display:flex;
    flex-wrap: wrap;
    width:475px;height:580px;
    margin:1rem;

  }
  iframe {
    display:block;
    outline:none;
    border:1px solid var(--shadow-fang-black);
  }
  h4 {
    margin:0px;
  }
  h3 {
    margin-top:0px;
  }
  h1 {

    font-size:24px;
  }
  article {
    cursor:pointer;
  }
  article:hover {
    transition: all 200ms;
  //box-shadow: var(--shadow-fang-black) 0px 0px 15px;
  //border:1px solid rgba(25,25,25,0.55);
  }
  article:active {
    transition: all 200ms;
    box-shadow: rgba(25,25,25,0.125) 0px 0px 105px;
    border:1px solid rgba(25,25,25,0.155);
  }
  article:first-child {
  //width:100vw;
  }
  iframe {  border: 0px solid black; }
  iframe {
    overflow: visible;
    position: relative;

    pointer-events:none;
    width:100%;
    height:100%;
    overflow-x:hidden;
    display:none;
  }
  .loader {
    border: 1px solid var(--shadow-fang-black);
    border-top: 1px solid  var(--van-dyke-brown);
    border-radius: 50%;
    width: 100px;
    height: 100px;
    margin-left:calc(50% - 50px);
    margin-top:calc(50% - 50px);
    animation: spin 1200ms cubic-bezier(.17,.67,.83,.47) infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  /*! CSS Used from: Embedded */
  a{background-color:transparent;}
  a:active,a:hover{outline:0;}
  @media print{
    *,:after,:before{color:#000!important;text-shadow:none!important;background:0 0!important;-webkit-box-shadow:none!important;box-shadow:none!important;}
  }
  *{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;
    font-family:monospace;text-align:center;
    font-size:16px;
  }
  :after,:before{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;}
  //a{color:#3277b3;}
  a,a:visited{text-decoration:underline;}
  a:focus,a:hover{color:#23527c;cursor:pointer;opacity:0.5;-webkit-transform:scale(1.1) 0.2s ease;transform:scale(1.1) 0.2s ease;animation:bubble 1.0s forwards;-webkit-animation:bubble 1.0s forwards;}
  a:focus{outline:5px auto -webkit-focus-ring-color;outline-offset:-2px;}
  /*! CSS Used from: Embedded */
  *{-webkit-transition:all 0.3s ease;transition:all 0.3s ease;}
  ::-webkit-scrollbar{width:0.5em;height:0.5em;}
  ::-webkit-scrollbar-thumb{background:slategray;}
  ::-webkit-scrollbar-track{background:#b8c0c8;}

  //main a{color:#88b5dd;}
  copy{
    font-family:monospace;text-align:center;display:block!important;padding:2rem;display:block;min-width:320;margin:0 auto;
  }
  copy{font-size:16px;}
  @media screen and (min-width: 420px){
    copy{font-size:calc(16px + 2 * ((100vw - 420px) / 300));}
  }
  @media screen and (min-width: 720px){
    copy{font-size:16px;}
  }
  copy p:first-child{text-align:center;font-family:monospace;display:block!important;padding-top:2rem;padding-bottom:2rem;display:block;min-width:320;max-width:780px;margin:0 auto;

  }
  copy img{width:40px;}
  /*! CSS Used from: Embedded */
  //a{color:#ddc1ab!important;}


</style>
