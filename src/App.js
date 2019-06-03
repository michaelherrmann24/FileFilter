import React from 'react';
import {FileLoader} from './components/file-loader/file-loader';
import './App.css';

export class App extends React.Component {
  render() {
    return  <div class="content-holder">
              <header></header>
              <div class="content">
                <FileLoader></FileLoader>
              </div>
              <footer ></footer>
            </div>
  }
}
