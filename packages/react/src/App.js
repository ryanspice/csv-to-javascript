import React from 'react';
import { List, ListItem, ListItemText } from '@material-ui/core';
import { FixedSizeList } from 'react-window';
import './App.scss';

import Papa from 'papaparse';



/*
// Convert back to CSV
var csv = Papa.unparse(data);

// Parse local CSV file
Papa.parse(file, {
    complete: function(results) {
        console.log("Finished:", results.data);
    }
});

// Stream big file in worker thread
Papa.parse(bigFile, {
    worker: true,
    step: function(results) {
        console.log("Row:", results.data);
    }
});
*/
let hasFetched = false;
const test = [
];

 class App extends React.Component {
     lastSortByColumn = 0;
     lastSortByColumnInverted = false;
    constructor(){
        super();
        this.list = React.createRef();
        this.state = {
            data:test,
            titles:['','','',''],
            complete:false
        };

        fetch(require('./MOCK_DATA.csv')).then(async (response)=>{
            const data = (await response.text());

            await Papa.parse(data, {
                worker: true,
                complete: (results)=> {
                    console.log("Finished:", this.state.data);
                    let finalResults = this.state.data;
                    let titleResults = finalResults.shift();
                    finalResults.pop(); // remove empty at end of file
                    console.log(titleResults)
                     this.setState({
                         titles:titleResults,
                         data: finalResults.sort(),
                         complete:true
                     });
                },
                step:(results) => {
                    this.setState({
                        data: [...this.state.data, results.data],
                        complete:false
                    });
                }
            });
            if (this.list)
                if (document.querySelector('#root > main > div'))
                document.querySelector('#root > main > div').scrollTo(0,1)
        });

        window.addEventListener('resize', ()=>{
            this.setState({complete:!this.state.complete});
            this.setState({complete:!this.state.complete});
        })
    }

     row = (props) => {
         const { index, style, dataOverride } = props;
         const data = dataOverride || this.state.data[index];

         if ((!data) || (data[0]===""))
             return (
                <span hidden></span>
             );

         return (
             <ListItem button style={style || {}} key={index}>
                 <ListItemText primary={`${data[0]}`} />
                 <ListItemText primary={`${data[1]}`} />
                 <ListItemText primary={`${data[2]}`} />
                 <ListItemText primary={`${data[3]}`} />
             </ListItem>
         );
     };

     title = (props) => {
         const { index, style, dataOverride } = props;
         const data = dataOverride || this.state.data[index];

         const sort = (column) => {

             if (this.lastSortByColumn===column){
                 this.lastSortByColumnInverted = !this.lastSortByColumnInverted;
             }

             let state = ({data:this.state.data.sort(function (a, b) {
                     if (column===3)
                         return Number(new Date(b[column])) - Number(new Date(a[column]));
                     return ('' + a[column]).localeCompare(b[column]);
                 })
             });
             if (this.lastSortByColumnInverted)
                 state.data.reverse();

             this.lastSortByColumn = column;
             this.setState(state);
         };

         if ((!data) || (data[0]===""))
             return (
                <span hidden/>
             );

        return (
            <div id={"table-titles"}>
                <span><a href="#" onClick={()=>{sort(0)}}>{data[0]}<br/> <span className={`chevron ${this.lastSortByColumn===0?'active':''} ${this.lastSortByColumnInverted?'bottom':''}`}></span></a></span>
                <span><a href="#" onClick={()=>{sort(1)}}>{data[1]}<br/><span  className={`chevron ${this.lastSortByColumn===1?'active':''} ${this.lastSortByColumnInverted?'bottom':''}`}></span></a></span>
                <span><a href="#" onClick={()=>{sort(2)}}>{data[2]}<br/><span className={`chevron ${this.lastSortByColumn===2?'active':''} ${this.lastSortByColumnInverted?'bottom':''}`}></span></a></span>
                <span><a href="#" onClick={()=>{sort(3)}}>{data[3]}<br/><span className={`chevron ${this.lastSortByColumn===3?'active':''} ${this.lastSortByColumnInverted?'bottom':''}`}></span></a></span>
            </div>
        );

     };
    htmlOrderedListTitles = ()=>{

    }
     render(){

         return (
             <main>
                 <section>
                     <h1>csv-to-javascript <small>by ryanspice</small></h1>
                     <p>Create an app that is capable of importing the attached MOCK_DATA.csv and visualize it on the
                         screen.</p>
                 </section>
                 <section>
                     <h3>react</h3>
                     <p>This page was created using "react-window" with the latest "create-react-app" and a
                         popular parsing library for *.csv files, PapaParse.</p>
                 </section>
                 <section>
                     <h4>File: <span id="file">./MOCK_DATA.csv</span></h4>
                 </section>

                 {this.state.complete?(
                     this.title({index:-1,style:"", dataOverride:this.state.titles})
                     ):null}
                 {this.state.complete?(
                     <FixedSizeList ref={this.list} height={((window.innerHeight*0.75)-250)} width={"100%"} data={this.state.data} style={{height:"50vh"}} itemSize={30}   itemCount={this.state.data.length}>
                         {this.row}
                     </FixedSizeList>
                 ):<span></span>}
             </main>
         );
     }
 }

export default App;
