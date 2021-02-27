import React from 'react'
import ReactDOM from 'react-dom'
import { Cards } from './components/Cards'
import './index.css'

ReactDOM.render(
  <React.StrictMode>
    <div className="container">
      <Cards />
    </div>
  </React.StrictMode>,
  document.getElementById('root'),
)
