/**
 * Copyright (c) 2017-present, Viro Media, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */
'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as LoadConstants from '../redux/LoadingStateConstants';
import * as UIConstants from '../redux/UIConstants';
import * as ModelData from  '../model/ModelItems';
import TimerMixin from 'react-timer-mixin';
import ParticleEmitter from '../model/emitters/ParticleEmitter';
import renderIf from '../helpers/renderIf';
import {
  ViroMaterials,
  ViroNode,
  Viro3DObject,
  ViroSpotLight,
  ViroQuad,
} from 'react-viro';

var createReactClass = require('create-react-class');


/**
 * Class that encapsulates everything needed to be added to the scene when a user adds a Model (3D Object)
 * from the listview. This configures position, rotation, etc. for the objects, as well as click / pinch gesture
 * behaviors. Additionally this also configures a SpotLight and a corresponding ViroQuad for shadows below the object
 */
var ModelItemRender = createReactClass({
    mixins: [TimerMixin],
    propTypes: {
        // All props retreived from the data model for Models (See js/model/ModelItems.js)
        modelIDProps: PropTypes.any,
        // Callback function that gets triggered once the model is loaded
        onLoadCallback: PropTypes.func,
        // Callback function thats fired when a user clicks the model
        onClickStateCallback: PropTypes.func,
        // A callback method thats provided here, gets triggered when the model loads that resolves to the correct
        // position and orientation for the model to be placed at initially
        hitTestMethod: PropTypes.func,
    },

    componentDidMount() {
      this._modelData = ModelData.getModelArray();
    },

    getInitialState() {
      return {
        scale : ModelData.getModelArray()[this.props.modelIDProps.index].scale,
        rotation : [0, 0, 0],
        nodeIsVisible : false,
        position: [0, 10, 1], // make it appear initially high in the sky
        shouldBillboard : true,
        runAnimation: true,
        showParticles: true,
        itemClickedDown: false,
      }
    },

    render: function() {
        var modelItem = ModelData.getModelArray()[this.props.modelIDProps.index];
        let transformBehaviors = {};
        if (this.state.shouldBillboard) {
          transformBehaviors.transformBehaviors = this.state.shouldBillboard ? "billboardY" : [];
        }

        return (

          <ViroNode
            {...transformBehaviors}
            key={this.props.modelIDProps.uuid}
            ref={this._setARNodeRef}
            visible={this.state.nodeIsVisible}
            position={this.state.position}
            scale={this.state.scale}
            rotation={this.state.rotation}
            onDrag={()=>{}}
            dragType="FixedToWorld">

            {/* This SpotLight is placed directly above the 3D Object, directed straight down,
                is responsible for creating "shadows" underneath the object in addition to providing lighting (castsShadow = true, influenceBitMask = this.props.bitMask). 
                The bitMask comes from figment.js where it is calculated each time a new object is added to the scene
                The position of the spotlight is either default or is configured in the data model (ModelItems.js).
                Rest of the props (innerAngle, outerAngle, attenautionDistances, nearZ, farZ) are configured so that
                they create "as tight as possible" spotlight frustrum around the object for optimizing performance
                (see https://docs.viromedia.com/docs/virospotlight1). */}
            <ViroSpotLight
              ref={component=>{this.spotLight = component}}
              intensity={modelItem.lighting_mode == "IBL" ? 100 : 1000}
              innerAngle={5}
              outerAngle={20}
              attenuationStartDistance={0.1}
              attenuationEndDistance={22}
              direction={[0,-1,0]}
              position={[modelItem.spotlight_position_x == undefined ? 0 : modelItem.spotlight_position_x, modelItem.spotlight_position_y == undefined ? 6 : modelItem.spotlight_position_y, modelItem.spotlight_position_z == undefined ? 0 : modelItem.spotlight_position_z]}
              color="#ffffff"
              castsShadow={true}
              influenceBitMask={this.props.bitMask}
              shadowNearZ={.1}
              shadowFarZ={modelItem.shadowfarz == undefined ? 6 : modelItem.shadowfarz * this.state.scale[0]}
              shadowOpacity={.9} />

            {/* This ViroNode is used as a parent for 3 children - 3D Object, Particle Emitters (if present in data model) and shadows. 
                This is done so that all three children are positioned in relation to each other in the scene graph, and any touch events
                that change their position of the object, affect all three */}
            <ViroNode position={modelItem.position}>

              <Viro3DObject
                source={modelItem.obj}
                type={modelItem.type}
                materials={"pbr"}
                resources={modelItem.resources}
                animation={{...modelItem.animation, "run": this.state.runAnimation}}
                lightReceivingBitMask={this.props.bitMask | 1}
                shadowCastingBitMask={this.props.bitMask}
                onClickState={this._onClickState(this.props.modelIDProps.uuid)}
                onClick={()=>{}}
                onError={this._onError(this.props.modelIDProps.uuid)}
                onRotate={this._onRotate}
                onPinch={this._onPinch}
                onLoadStart={this._onObjectLoadStart(this.props.modelIDProps.uuid)}
                onLoadEnd={this._onObjectLoadEnd(this.props.modelIDProps.uuid)}/>
              
              {/* Some of the objects (Birthcake and Angry Emoji) 
                  also have Particle Emitters that are rendered with them (configured in data model with prop "emitter_name".
                  For those, we add corresponding particle emitters identified by the modelName*/}
              {renderIf(this.state.showParticles && modelItem.emitter_name !== undefined, <ParticleEmitter modelName={modelItem.name}/>)}

            </ViroNode>

            {/* The surface used to render shadow below the object. Below we OR the light bitmask with 1 on the object because the default bitmask for lights
                is 1 and we want the object to be lit up by all lights, but only have shadows casted by one SpotLight contain within this component */}
            <ViroQuad
              rotation={[-90, 0, 0]}
              position={[0, -.001, 0]}
              width={modelItem.shadow_width == undefined ? 2.5 : modelItem.shadow_width} 
              height={modelItem.shadow_height == undefined ? 2.5 : modelItem.shadow_height}
              lightReceivingBitMask={this.props.bitMask | 1}
              arShadowReceiver={true}
              ignoreEventHandling={true} />

          </ViroNode>
        );
    },

    _setARNodeRef(component) {
      this.arNodeRef = component;
    },

    /**
     * This method handles various state changes that happen when a user "Clicks" a model in the scene. For every "click" on a model, 
       a user can have different intentions:
       1. a quick tap to start/stop animation
       2. a quick tap to bring up the contextmenu
       3. a long tap where the intention is actually "drag" the model to reposition it
       Each "click" is comprised of two events - ClickDown : trigged when the user's finger touches the screen and a ClickUp: when the finger leaves the screen
     */
    _onClickState(uuid) {
        return (clickState, position, source)=> {
          if (clickState == 1) { 
            // clickState == 1 -> "ClickDown", we set the state itemClickedDown = true here,
            // which gets "reset" in 200 miliseconds. If a "ClickUp" happens in these 200 ms then
            // the user most likely just wanted to click the model (handled in the clickState == 2). 
            //After 200 ms, most likely the user intended to "drag" the object.
            this.setState({
              itemClickedDown : true,
            });
            TimerMixin.setTimeout(
              () => {
                this.setState({
                  itemClickedDown: false,
                });
              },
              200
            );
          }

          if (clickState == 2) { // clickstate == 2 -> "ClickUp"
            // As explained above, within 200 ms, the user's intention is to "tap" the model -> toggle the animation start/stop
            if (this.state.itemClickedDown) {
              {this._onItemClicked()}
            }
            // Irrespective of 200 ms, we call the callback provided in props -> this brings up the context menu on top right
            this.props.onClickStateCallback(uuid, clickState, UIConstants.LIST_MODE_MODEL);
          }
        }
    },
    _onItemClicked() {
            let currentAnimationState = this.state.runAnimation;
            let currentParticlesState = this.state.showParticles;
            this.setState({
              runAnimation: !currentAnimationState,
              showParticles: !currentParticlesState,
              itemClickedDown: false,
            });
    },
    /*
     Rotation should be relative to its current rotation *not* set to the absolute
     value of the given rotationFactor.
     */
    _onRotate(rotateState, rotationFactor, source) {

      if (rotateState == 3) {
        this.setState({
          rotation : [this.state.rotation[0], this.state.rotation[1] + rotationFactor, this.state.rotation[2]]
        });
        this.props.onClickStateCallback(this.props.modelIDProps.uuid, rotateState, UIConstants.LIST_MODE_MODEL);
        return;
      }

      this.arNodeRef.setNativeProps({rotation:[this.state.rotation[0], this.state.rotation[1] + rotationFactor, this.state.rotation[2]]});
    },

    /*
     Pinch scaling should be relative to its last value *not* the absolute value of the
     scale factor. So while the pinching is ongoing set scale through setNativeProps
     and multiply the state by that factor. At the end of a pinch event, set the state
     to the final value and store it in state.
     */
    _onPinch(pinchState, scaleFactor, source) {

      var newScale = this.state.scale.map((x)=>{return x * scaleFactor})

      if (pinchState == 3) {
        this.setState({
          scale : newScale
        });
        this.props.onClickStateCallback(this.props.modelIDProps.uuid, pinchState, UIConstants.LIST_MODE_MODEL);
        return;
      }

      this.arNodeRef.setNativeProps({scale:newScale});
      //this.spotLight.setNativeProps({shadowFarZ: 6 * newScale[0]});
    },

    _onError(uuid) {
        return () => {
          this.props.loadCallback(uuid, LoadConstants.ERROR);
          //this.props.arSceneNavigator.viroAppProps.loadingObjectCallback(index, LoadingConstants.LOAD_ERROR);
        };

      },

    _onObjectLoadStart(uuid) {
        return () => {
          this.props.onLoadCallback(uuid, LoadConstants.LOADING);
        };
    },

    _onObjectLoadEnd(uuid) {
        return () => {
          this.props.onLoadCallback(uuid, LoadConstants.LOADED);
          this.props.hitTestMethod(this._onARHitTestResults);
        };
    },

    /**
     * This method is executed once a model finishes loading. The arguments position, forward and results are used to
     * find the correct position of the model. position, forward and results are calculated when user adds a model to 
     * the scene by performing an AR Hit Test (see https://docs.viromedia.com/docs/viroarscene). arguments:
     * position - intersection of a Ray going out from the camera in the forward direction and the AR point returned by underlying AR platform
     * forward - forward vector of the ray
     * results - All feature points returned
     */
    _onARHitTestResults(position, forward, results) {
      // default position is just 3 forward of the user
      let newPosition = [forward[0] * 1.5, forward[1]* 1.5, forward[2]* 1.5];

      // try to find a more informed position via the hit test results
      if (results.length > 0) {
        let hitResultPosition = undefined;
        // Go through all the hit test results, and find the first AR Point that's close to the position returned by the AR Hit Test
        // We'll place our object at that first point
        for (var i = 0; i < results.length; i++) {
          let result = results[i];
          if (result.type == "ExistingPlaneUsingExtent" || result.type == "FeaturePoint" && !hitResultPosition) {
            // Calculate distance of the "position" from this hit test result
            // math = Sqr root {(x1-x2)^2 + (y1-y2)^2 + (z1-z2)^2} ->regular "distance" calculation
            var distance = Math.sqrt(((result.transform.position[0] - position[0]) * (result.transform.position[0] - position[0])) + ((result.transform.position[1] - position[1]) * (result.transform.position[1] - position[1])) + ((result.transform.position[2] - position[2]) * (result.transform.position[2] - position[2])));
            if(distance > .2 && distance < 10) {
              hitResultPosition = result.transform.position;
              break;
            }
          } 
        }

        // If we found a hitResultPosition above after doing the distance math, set the position to this new place
        if (hitResultPosition) {
          newPosition = hitResultPosition;
        }
      }

      this._setInitialPlacement(newPosition);
    },

    // we need to set the position before making the node visible because of a race condition
    // in the case of models, this could cause the model to appear where the user is before
    // moving to it's location causing the user to accidentally be "inside" the model.
    // This sets an initial timeout of 500 ms to avoid any race condition in setting 
    // position and rotation while the object is being loaded.
    _setInitialPlacement(position) {
      this.setState({
          position: position,
      });
      this.setTimeout(() =>{this._updateInitialRotation()}, 500);
    },

    // This function gets the rotation transform of the parent ViroNode that was placed in the scene by the user
    // and applies that rotation to the model inside the ViroNode (by setting state). This is done to ensure that
    // the portal faces the user at it's initial placement.
    _updateInitialRotation() {
      this.arNodeRef.getTransformAsync().then((retDict)=>{
         let rotation = retDict.rotation;
         let absX = Math.abs(rotation[0]);
         let absZ = Math.abs(rotation[2]);

         let yRotation = (rotation[1]);

         // if the X and Z aren't 0, then adjust the y rotation.
         if (absX > 1 && absZ > 1) {
           yRotation = 180 - (yRotation);
         }
         this.setState({
           rotation : [0,yRotation,0],
           shouldBillboard : false,
           nodeIsVisible: true,
         });
       });
    },
});

ViroMaterials.createMaterials({
  pbr: {
    lightingModel: "PBR",
  },
});

module.exports = ModelItemRender;
