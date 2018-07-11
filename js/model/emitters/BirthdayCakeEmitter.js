'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';

import {
  ViroNode,
  ViroParticleEmitter,
} from 'react-viro';

// Particle Emitter Behavior for the "Flame" on top of the birthday cake objects
class BirthdayCakeEmitter extends Component {
  constructor(props) {
    super(props);

  }
  render() {
    return (
      <ViroNode position={[0.18,.68,0.01]} scale={[.5,.5,.5]}>
          <ViroParticleEmitter
              position={[0,0,0]}
              duration={1200}
              visible={true}
              run={true}
              loop={true}
              fixedToEmitter={true}

              image={{
                source:require("../../res/particle_fire.png"),
                height:0.3,
                width:0.3,
              }}

              spawnBehavior={{
                particleLifetime:[500,500],
                emissionRatePerSecond:[30, 40],
                maxParticles:800
              }}

              particleAppearance={{
                opacity:{
                  initialRange:[0.2, 0.2],
                  factor:"Time",
                  interpolation:[
                    {endValue:0.2, interval:[0,200]},
                    {endValue:0.0, interval:[200,500]},
                  ]
                },
                scale:{
                  initialRange:[[1,1,1], [1,1,1]],
                  factor:"Time",
                  interpolation:[
                    {endValue:[0,0,0], interval:[150,500]},
                  ]
                },

              }}

              particlePhysics={{
                velocity:{initialRange:[[0,.3,0], [0,.5,0]]}
              }}
            />
      </ViroNode>
    );
  }
}

export default BirthdayCakeEmitter;