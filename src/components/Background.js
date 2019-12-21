import React, { Component } from 'react';
import Particles from 'react-particles-js'

import themes from '../utils/themes';
import { withRouter } from 'react-router-dom'
@withRouter
class Background extends Component {
  constructor(props) {
    super(props);
    console.log(this.props)
  }
  render() {
    let index = 0;
    const search = this.props.location.search;
    if (search) {
      index = search.substring(1).split('=')[1]
    }
    return (
      <div className={'particles'}>
        <Particles
          params={
            Object.assign(themes[index],{
              polygon: {
              enable: false,
              type: 'inside',
              move: {
                radius: 10
              },
              // url: require('../assets/snowflaker.svg')
              }
            })
              }
                
       
          
          style={{
            position: 'fixed',
            width: '100%',
            height: '100%',
            // background: '#1a1a1a',
            // backgroundSize: 'cover',
            pointerEvents: 'none',
          }}
        />
        {this.props.children}
      </div>
    );
  }
}

export default Background;