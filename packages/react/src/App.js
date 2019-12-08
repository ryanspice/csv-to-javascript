import React from 'react';
import logo from './logo.svg';
import './App.scss';

function App() {
  return (
      <main>
    <section>
    <h1>assignment <small>by ryanspice for backbase</small></h1>
    <p>Create an app that is capable of importing the attached MOCK_DATA.csv and visualize it on the screen.</p>
    </section>
    <section>
    <h3>angular</h3>
    <p>This page was created using "cdk-virtual-scroll-viewport" with the latest Angular, Material, and Webpack + 'csv-loader'.</p>
    </section>
    <section>
    <h4>File: <span id="file">./MOCK_DATA.csv</span></h4>
    </section>
    <ol></ol>
    <app-table ></app-table>
    </main>
  );
}

export default App;
