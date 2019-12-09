import Vue from 'vue'
import App from './components/App.vue'


Vue.config.productionTip = false;

document.addEventListener('DOMContentLoaded', async (newChild, refChild)=> {

  const app = new Vue({
    el: '#app',
    render: h => h(App)
  });

  const _MOCK_DATA_CSV_PATH_ = './MOCK_DATA.csv';
  const _MOCK_DATA_CSV_ = fetch(_MOCK_DATA_CSV_PATH_);
  const _OPTION_TYPE_ = 1;

  const htmlText = text => `<span>${text}</span>`;
  const htmlChevron =`<span class="chevron"></span>`;
  const htmlTitle = (i,t) =>  `<a href="#" onClick="htmlOrderedListTitles(this); render(${i});">${t[i]}<br/>${htmlChevron}</a>`;

  let lastSortByColumn = null;
  let lastSortByColumnInverted = false;

  /**
   *
   */

  window.htmlOrderedListTitles = (e, inverted)=>{

    document.querySelectorAll('.active').forEach(e=>e.className = "chevron");
    e.children[1].classList.add('active');

    if (!inverted) {

      e.children[1].classList.add('top');
      e.children[1].classList.remove('bottom');
    } else {

      e.children[1].classList.add('bottom');
      e.children[1].classList.remove('top');
    }
  }

  const response = await _MOCK_DATA_CSV_;
  const responseText = await response.text();
  document.getElementById(`file`).innerText=_MOCK_DATA_CSV_PATH_;

  let csvArray;
  let time = new Date().getTime();
  let parsingTime = 0;
      console.log('Opening vanilla...');
      const CSVToArray = (await require("../../csv-to-javascript/csvToArray"));
      parsingTime = await new Date().getTime();
      console.log('Parsing w/vanilla...',parsingTime-time+"ms");
      csvArray = await CSVToArray( responseText || ',' );
      console.log('Finished Parsing w/vanilla...', (new Date().getTime()-parsingTime) + "ms");




  const csvTitles = await csvArray.shift();
  const columnCount = await csvTitles.length;
  const htmlOrderedList = document.getElementsByTagName(`ol`)[0];

  const sort = (column) => {
    csvArray.sort(function (a, b) {
      if (column===3)
        return Number(new Date(b[column])) - Number(new Date(a[column]));
      return ('' + a[column]).localeCompare(b[column]);
    })
  };

  // adjust title html
  csvTitles[0] = htmlTitle(0,csvTitles)
  csvTitles[1] = htmlTitle(1,csvTitles)
  csvTitles[2] = htmlTitle(2,csvTitles)
  csvTitles[3] = htmlTitle(3,csvTitles)

  // because for me at least, there is an empty item at the end of the file
  await csvArray.pop();

  // expose the render function globally

  window.render = async (sortByColumn = (lastSortByColumn || 0)) => {

    const templateRow = (row, first = false)=>{
      html+=`<li ${first===true?'id="table-titles"':''}>`;
      for(let i = 0; i<columnCount; i++){
        html+=htmlText(row[i])
      }
      html+="</li>";
    };

    let html = ``;
    htmlOrderedList.innerHTML = "";

    // sort

    if (lastSortByColumn===sortByColumn){
      lastSortByColumnInverted = !lastSortByColumnInverted;
    }

    lastSortByColumn = sortByColumn;

    await sort(sortByColumn);

    if (lastSortByColumnInverted){
      await csvArray.reverse();
    }

    // update the html
    await templateRow(csvTitles, true);
    await csvArray.forEach(templateRow);

    /// update the list
    await htmlOrderedList.insertAdjacentHTML(`afterbegin`,html);
    await htmlOrderedListTitles(document.querySelectorAll('li span a')[sortByColumn],lastSortByColumnInverted);
  };

  return await render();
});
