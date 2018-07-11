'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';

import {
  ViroNode,
  ViroParticleEmitter,
} from 'react-viro';

// Particle Emitter Behavior for the "Smoke" coming from both ears of the Angry Emoji object
class EmojiAngryEmitter extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <ViroNode>
          <ViroParticleEmitter
              position={[-.6, 0, .2]}
              scale={[.4, .2, .2]}
              duration={1100}
              delay={1100}
              visible={true}
              run={true}
              loop={true}
              fixedToEmitter={true}

              image={{
                source:require("../../res/particle_smoke.png"),
                height:1,
                width:1,
              }}

              spawnBehavior={{
                particleLifetime:[500,500],
                emissionRatePerSecond:[200,200],
                maxParticles:200,
                spawnVolume:{
                  shape:"box",
                  params:[.7, .1, .1],
                  spawnOnSurface:false
                },
              }}

              particleAppearance={{
                opacity:{
                  initialRange:[0.0, 0.0],
                  interpolation:[
                    {endValue:0.4, interval:[0,200]},
                    {endValue:0.0, interval:[900,1500]}
                  ]
                },
              }}

              particlePhysics={{
                velocity:{initialRange:[[-2,2,0], [-2,-2,0]]},
                acceleration:{initialRange:[[0,0,0], [0,0,0]]}
              }}
          />

          <ViroParticleEmitter
              position={[.6, 0, .2]}
              scale={[.4, .2, .2]}
              duration={1100}
              delay={1100}
              visible={true}
              run={true}
              loop={true}
              fixedToEmitter={true}

              image={{
                source:require("../../res/particle_smoke.png"),
                height:1,
                width:1,
              }}

              spawnBehavior={{
                particleLifetime:[500,500],
                emissionRatePerSecond:[200,200],
                maxParticles:200,
                spawnVolume:{
                  shape:"box",
                  params:[.7, .1, .1],
                  spawnOnSurface:false
                },
              }}

              particleAppearance={{
                opacity:{
                  initialRange:[0.0, 0.0],
                  interpolation:[
                    {endValue:0.4, interval:[0,200]},
                    {endValue:0.0, interval:[900,1500]}
                  ]
                },
              }}

              particlePhysics={{
                velocity:{initialRange:[[2,2,0], [2,-2,0]]},
                acceleration:{initialRange:[[0,0,0], [0,0,0]]}
              }}
          />
      </ViroNode>
    );
  }
}

export default EmojiAngryEmitter;