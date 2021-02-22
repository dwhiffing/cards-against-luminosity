import React from 'react'
import ReactDOM from 'react-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Cards } from './components/Cards'
import './index.css'

ReactDOM.render(
  <React.StrictMode>
    <div className="container">
      <Header />

      <Cards />

      <Footer />
    </div>
  </React.StrictMode>,
  document.getElementById('root'),
)
