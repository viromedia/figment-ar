/**
 * Copyright (c) 2017-present, Viro, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

import React from 'react';
import {View,
        Image,
        StyleSheet,
        } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Animation from 'lottie-react-native';
import renderIf from '../helpers/renderIf';
import SuccessAnimation from './SuccessAnimation';

/**
 * Component for showing AR initialization UI to user to move device around until AR tracking is initialized
 */
class ARInitializationUI extends React.Component {
  constructor(props) {
    super(props);

    this._setAnimation = this._setAnimation.bind(this);
    this._onSuccessAnimFinished = this._onSuccessAnimFinished.bind(this);
    this.state = {
      initializing_text_src_img: require('../res/icon_initializing_text_1.png')
    }
  }

  // Method required by lottie-react-native to set the animation in the render() function
  _setAnimation(animation) {
      this.animation = animation;
        if (this.animation != undefined) {
              this.animation.play();
      }
  }
  render() {
    // if AR tracking is not initialized show animation to guide user to move device around 
    if (!this.props.arSceneInitialized) {
      return (
        <View pointerEvents={'none'} style={this.props.style}>
            <View style={{width: this.props.width,height: this.props.height}}>
              <Animation
                ref={this._setAnimation}
                style={{
                  width: this.props.width,
                  height: this.props.height,
                  alignSelf: 'center'
                }}
                loop={true}
                source={require('../res/animations/data.json')}
              />
              </View>
            <Image source={this.state.initializing_text_src_img}/>
          </View>
          );
    } else {
      // if AR tracking is initialized show animation for Successfully initialized device
      return (
        <View pointerEvents={'none'} style={{position: 'absolute', top: 50, left: 0, right: 0, width: '100%', height: 120, flexDirection:'column', justifyContent: 'space-between', alignItems: 'center'}}>
          <SuccessAnimation onPress={()=>{}} 
                        stateImageArray={[require("../res/icon_initializing_device_2.png")]}
                        style={localStyles.arSceneInitializeSuccess} />
          <SuccessAnimation onPress={()=>{}} 
                      onFinish={this._onSuccessAnimFinished}
                      stateImageArray={[require("../res/icon_initializing_text_2.png")]}/>
        </View>
      );
    }
  }

  // Callback function passed to <SuccessAnimation> component
  // This is so that first time user sees "Initializing ...", later times user sees "Re-Calibrating ...."
  _onSuccessAnimFinished() {
    this.setState({
      initializing_text_src_img: require('../res/icon_initializing_device_3.png')
    });
  }
}

// Connecting props to redux store
function selectProps(store) {
  return {
    arSceneInitialized: store.ui.arTrackingInitialized
  };
}

ARInitializationUI.propTypes = {
    style: PropTypes.any,
};

ARInitializationUI.defaultProps = {
    width: 172.075,
    height: 100
};

var localStyles = StyleSheet.create({
  arSceneInitializeSuccess : {
    height : 61,
    width: 35,
    alignSelf: 'center',
  },

});

export default connect(selectProps)(ARInitializationUI)