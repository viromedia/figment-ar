/**
 * Copyright (c) 2017-present, Viro Media, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as LoadingConstants from './redux/LoadingStateConstants';
import * as UIConstants from './redux/UIConstants';
import ModelItemRender from './component/ModelItemRender';
import PortalItemRender from './component/PortalItemRender';
import EffectItemRender from './component/EffectItemRender';
import { ARTrackingInitialized } from './redux/actions';

import {
  ViroARScene,
  ViroConstants,
  ViroMaterials,
  ViroAmbientLight,
  ViroDirectionalLight,
  ViroSpotLight
} from 'react-viro';

import renderIf from './helpers/renderIf';


/**
 * AR Scene shown in the App. All 3D Viro Components handled and rendered here.
 * ViroComponents (Objects, Portals, Effects) added, removed, manipulated using 2D RN UI components via redux.
 * Objects - 3D animating objects (OBJ, VRX)
 * Portals - Represent an entry way into virtual world where the virtual world can be a 360 image / video or a 2D image / video
 * Effects - Add interesting effects in the AR Scene such as Particle Emitters (fireworks, smoke, bubble, etc) or Post Processing effects (black & white, sepia, etc.)
 */
export class figment extends Component {

  constructor(props) {
    super(props);

    this.state = {
      text : "not tapped",
      currentObj: 0,
      isLoading: false,
      scaleSurface: [1,1,1],
    }

    this._renderModels = this._renderModels.bind(this);
    this._renderPortals = this._renderPortals.bind(this);
    this._renderEffects = this._renderEffects.bind(this);
    this._onTrackingUpdated = this._onTrackingUpdated.bind(this);
    this._performARHitTest = this._performARHitTest.bind(this);
    this._onLoadCallback = this._onLoadCallback.bind(this);
    this._onModelsClickStateCallback = this._onModelsClickStateCallback.bind(this);
    this._onPortalsClickStateCallback = this._onPortalsClickStateCallback.bind(this);
  }

  render() {
    // the starting bitmask is 2 because the default is 1 (2^0 = 1)
    let startingBitMask = 2;
    // fetch models
    let models = this._renderModels(this.props.modelItems, startingBitMask);
    // increment startingBitMask by the number of models
    startingBitMask += Object.keys(this.props.modelItems).length;
    // fetch portals (portals don't have shadows, so not incrementing bitmask)
    let portals = this._renderPortals(this.props.portalItems, startingBitMask);
    // fetch effects
    let effects = this._renderEffects(this.props.effectItems);

    return (
        <ViroARScene ref="arscene" physicsWorld={{gravity:[0, -9.81, 0]}} postProcessEffects={[this.props.postProcessEffects]}
            onTrackingUpdated={this._onTrackingUpdated}>
          <ViroAmbientLight color="#ffffff" intensity={20}/>
          
          {/* DirectionalLight with the direction away from the user, pointed upwards, to light up the "face" of the model */}
          <ViroDirectionalLight color="#ffffff" direction={[0,-1,-.2]}/>
          
          {/* Spotlight on top of the model to highlight this model*/}
          <ViroSpotLight
            innerAngle={5}
            outerAngle={90}
            direction={[0,1,0]}
            position={[0, -7, 0]}
            color="#ffffff"
            intensity={250}/>
          {models}
          {portals}
          {effects}
        </ViroARScene>
    );
  }

  // Render models added to the scene. 
  // modelItems - list of models added by user; comes from redux, see js/redux/reducers/arobjects.js
  // startingBitMask - used for adding shadows for each of the, for each new object added to the scene,
  //           pass a bitMask as {Math.pow(2,objBitMask)}. This is done since each object has it's own 
  //           spotlight and a corresponding shadow plane. So each new set of these components are assigned a 
  //           consistent bitMask that's used in SpotLight's "influenceBitMask",
  //           Viro3DObject's "shadowCastingBitMask" and "lightReceivingBitMask" and Shadow plane (ViroQuad)'s "lightReceivingBitMask"
  _renderModels(modelItems, startingBitMask) {
    var renderedObjects = [];
    if(modelItems) {
      var root = this;
      let objBitMask = startingBitMask;
      Object.keys(modelItems).forEach(function(currentKey) {
        if(modelItems[currentKey] != null && modelItems[currentKey] != undefined) {
          renderedObjects.push(
            <ModelItemRender key={modelItems[currentKey].uuid}
              modelIDProps={modelItems[currentKey]}
              hitTestMethod={root._performARHitTest}
              onLoadCallback={root._onLoadCallback}
              onClickStateCallback={root._onModelsClickStateCallback}
              bitMask={Math.pow(2,objBitMask)} />
          );
        }
        objBitMask++;
      });

    }
    return renderedObjects;
  }

  // Render Portals added to the scene. 
  // portalItems - list of portals added by user; comes from redux, see js/redux/reducers/arobjects.js
  // startingBitMask - used for adding shadows for each of the 
  _renderPortals(portalItems, startingBitMask) {
    var renderedObjects = [];
    if(portalItems) {
      var root = this;
      let portalBitMask = startingBitMask;
      Object.keys(portalItems).forEach(function(currentKey) {
        if(portalItems[currentKey] != null && portalItems[currentKey] != undefined) {
          renderedObjects.push(
            <PortalItemRender
            key={portalItems[currentKey].uuid}
            portalIDProps={portalItems[currentKey]}
            hitTestMethod={root._performARHitTest}
            onLoadCallback={root._onLoadCallback}
            onClickStateCallback={root._onPortalsClickStateCallback}
            bitMask={Math.pow(2,portalBitMask)}/>
          );
        }
        portalBitMask++;
      });
    }
    return renderedObjects;
  }

  // Render Effects added to the scene. Handled differently compared to Objects and Portals,
  // since a user can enable only 1 effect to the scene at a time
  // effectItems - list of effects; from the data model, see js/model/EffectItems.js
  _renderEffects(effectItems) {
    if(effectItems){
      for(var i =0; i<effectItems.length; i++) {
          if(effectItems[i].selected) {
            return (<EffectItemRender index={i} effectItem={effectItems[i]} />);
          }
      }
    }
  }

  // Callback fired when the app receives AR Tracking state changes from ViroARScene.
  // If the tracking state is not NORMAL -> show the user AR Initialization animation 
  // to guide them to move the device around to get better AR tracking.
  _onTrackingUpdated(state, reason) {
    var trackingNormal = false;
    if (state == ViroConstants.TRACKING_NORMAL) {
      trackingNormal = true;
    } 
    this.props.dispatchARTrackingInitialized(trackingNormal);
  }
  
  // Performed to find the correct position where to place a new object being added to the scene
  // Get's camera's current orientation, and performs an AR Hit Test with Ray along the camera's orientation
  // the object is then placed at the intersection of the Ray and identified AR point returned by the system
  // along that ray.
  _performARHitTest(callback) {
    this.refs["arscene"].getCameraOrientationAsync().then((orientation) => {
      this.refs["arscene"].performARHitTestWithRay(orientation.forward).then((results)=>{
        callback(orientation.position, orientation.forward, results);
      })
    });
  }

  _onLoadCallback(uuid, loadState) {
    this.props.arSceneNavigator.viroAppProps.loadingObjectCallback(uuid, loadState);
  }
  _onModelsClickStateCallback(uuid, clickState, itemType) {
    this.props.arSceneNavigator.viroAppProps.clickStateCallback(uuid, clickState, itemType);
  }
  _onPortalsClickStateCallback(index, clickState, itemType) {
    this.props.arSceneNavigator.viroAppProps.clickStateCallback(index, clickState, itemType);
  }
}

ViroMaterials.createMaterials({
  shadowCatcher: {
    writesToDepthBuffer: false,
    readsFromDepthBuffer: false,
    diffuseColor: "#ff9999"

  },
  ground: {
    lightingModel: "Lambert",
    cullMode: "None",
    shininess: 2.0,
    diffuseColor: "#ff999900"
  },
  theatre: {
    diffuseTexture: require('./res/360_dark_theatre.jpg'),
  },
});

// -- REDUX STORE
function selectProps(store) {
  return {
    modelItems: store.arobjects.modelItems,
    portalItems: store.arobjects.portalItems,
    effectItems: store.arobjects.effectItems,
    postProcessEffects: store.arobjects.postProcessEffects,
  };
}

// -- dispatch REDUX ACTIONS map
const mapDispatchToProps = (dispatch) => {
  return {
    dispatchARTrackingInitialized:(trackingNormal) => dispatch(ARTrackingInitialized(trackingNormal)),
  }
}
module.exports = connect(selectProps, mapDispatchToProps)(figment);
