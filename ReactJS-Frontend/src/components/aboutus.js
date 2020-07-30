import React, { Component } from 'react';
import Page from './aboutus.html';
import ReactDOM from 'react-dom';
var AboutUs = React.createClass({

    getInitialState: function() {
      return {showExternalHTML: false};
    },
    
    render: function() {
      return (
        <div>
          <button onClick={this.toggleExternalHTML}>Toggle Html</button>
          {this.state.showExternalHTML ? <div>
            <div dangerouslySetInnerHTML={this.createMarkup()} ></div>
          </div> : null}
        </div>
      );
    },
    
    toggleExternalHTML: function() {
      this.setState({showExternalHTML: !this.state.showExternalHTML});
    },
    
    createMarkup: function() { 
      return {__html: Page};
    }
  
  });
  
  ReactDOM.render(
    <AboutUs />,
    document.getElementById('container')
  );

  export default AboutUs;