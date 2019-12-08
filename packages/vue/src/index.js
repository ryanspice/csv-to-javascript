import Vue from 'vue'
import App from './components/App.vue'

import CSVToArray from "../../csv-to-javascript/csvToArray";
import CSVToPapa from "../../csv-to-javascript/csvToPapaParse";

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
  switch(_OPTION_TYPE_){
    case 0:
    csvArray = await CSVToArray( responseText || '', ',' );
      break;
    case 1:
    csvArray = await CSVToPapa( responseText || '', ',' );
      break;
    case 2:

      break;
    case 3:

      break;
  }




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

    const templateRow = (row, first)=>{
      html+="<li>";
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
    await templateRow(csvTitles);
    await csvArray.forEach(templateRow);

    /// update the list
    await htmlOrderedList.insertAdjacentHTML(`afterbegin`,html);
    await htmlOrderedListTitles(document.querySelectorAll('li span a')[sortByColumn],lastSortByColumnInverted);
  };

  return await render();
});
