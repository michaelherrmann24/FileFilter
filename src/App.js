import React from 'react';
import {FileLoader} from './components/file-loader/file-loader';
import './App.css';

export class App extends React.Component {
  render() {
    return  <div className="content-holder">
              <header></header>
              <div className="content">
                <FileLoader></FileLoader>
              </div>
              <footer ></footer>
            </div>
  }
}
