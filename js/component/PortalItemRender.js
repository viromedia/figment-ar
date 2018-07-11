
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
import * as PortalData from  '../model/PortalItems';
import TimerMixin from 'react-timer-mixin';
import * as PSConstants from './PSConstants';


import {
  ViroNode,
  Viro3DObject,
  Viro360Image,
  ViroPortalScene,
  ViroPortal,
  ViroMaterials,
  ViroImage,
  ViroSphere,
  ViroVideo,
  ViroSpotLight,
  Viro360Video,
} from 'react-viro';

var createReactClass = require('create-react-class');


/**
 * Class that encapsulates configuration and behavior of Portals placed in AR Scene by the user.
 * Portals <ViroPortal> represent an entry way into a <ViroPortalScene>. They contain a 3D Object
 * for the entry "door frame" that the user can walk into, and ViroPortalScene which represent a
 * sub-scene that the user can only access once they are inside the Portal 
 */
var PortalItemRender = createReactClass({
    mixins: [TimerMixin],
    propTypes: {
        // All props retreived from the data model for Portals (See js/model/PortalItems.js)
        portalIDProps: PropTypes.any,
        // Callback function that gets triggered once the portal is loaded
        onLoadCallback: PropTypes.func,
        // Callback function thats fired when a user clicks the portal
        onClickStateCallback: PropTypes.func,
        // A callback method thats provided here, gets triggered when the portal loads that resolves to the correct
        // position and orientation for the portal to be placed at 
        hitTestMethod: PropTypes.func,
    },

    getInitialState() {
      return {
        scale : PortalData.getPortalArray()[this.props.portalIDProps.index].scale,
        rotation : [0, 0, 0],
        nodeIsVisible : false,
        position: [0, 2, 1], // make it appear initially high in the sky
        shouldBillboard : true,
        insidePortal: false,
        itemClickedDown: false,
      }
    },

    componentDidMount() {
        this._portalData = PortalData.getPortalArray();
    },

    /**
     * This render() function adds a ViroNode to the scene containing a ViroPortalScene,
     * with ViroPortal and the required 3D Object for the "entry way", and views to render "inside the portal"
     */
    render: function() {
      var portalItem = PortalData.getPortalArray()[this.props.portalIDProps.index];
      let transformBehaviors = {}
      if (this.state.shouldBillboard) {
        transformBehaviors.transformBehaviors = this.state.shouldBillboard ? "billboardY" : [];
      }
      return (
        <ViroNode
          {...transformBehaviors}
          key={this.props.portalIDProps.uuid}
          ref={this._setARNodeRef}
          visible={this.state.nodeIsVisible}
          position={this.state.position}
          scale={this.state.scale}
          rotation={this.state.rotation}
          onDrag={()=>{}} >

          {/* Spotlight to light the Portal entry way (Viro3DObject)*/}
          <ViroSpotLight
            innerAngle={5}
            outerAngle={20}
            direction={[0,-1,-.2]}
            position={[0, 5, 1]}
            color="#ffffff"
            castsShadow={true}
            influenceBitMask={this.props.bitMask}
            shadowNearZ={.1}
            shadowFarZ={5}
            shadowOpacity={.9} />

            {/* Configures the portal in the AR Scene, with 3D Object for the entry way and 
                views rendered inside the portal */}
            <ViroPortalScene
              position={portalItem.position}
              onRotate={this._onRotate}
              onPinch={this._onPinch}
              passable={true}
              scale={portalItem.portalScale}
              onClickState={this._onClickState(this.props.portalIDProps.uuid)}
              onPortalEnter={this._onPortalEnter}
              onPortalExit={this._onPortalExit} >

              <ViroPortal>
                {/* 3D Object for the entry way */}
                <Viro3DObject
                  source={portalItem.obj}
                  materials={portalItem.materials}
                  resources={portalItem.resources}
                  type={portalItem.frameType}
                  onLoadStart={this._onObjectLoadStart(this.props.portalIDProps.uuid)}
                  onLoadEnd={this._onObjectLoadEnd(this.props.portalIDProps.uuid)}
                  lightReceivingBitMask={this.props.bitMask | 1}
                  shadowCastingBitMask={this.props.bitMask} />
                }
              </ViroPortal>

              {/* Sub-scene that renders content "inside" the portal*/}
              {this._renderPortalInside(portalItem)}

            </ViroPortalScene>
        </ViroNode>
      );
    },

    _setARNodeRef(component) {
      this.arNodeRef = component;
    },

    /**
     * This method handles various state changes that happen when a user "Clicks" a portal in the scene. For every "click" on a portal, 
       a user can have different intentions:
       1. a quick tap to bring up the contextmenu
       3. a long tap where the intention is actually "drag" the model to reposition it
       Each "click" is comprised of two events - ClickDown : trigged when the user's finger touches the screen and a ClickUp: when the finger leaves the screen
     */
    _onClickState(uuid) {
        return (clickState, position, source)=> {
          if (clickState == 1) { // clickState == 1 -> "ClickDown"
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

          if (clickState == 2) { // clickState == 2 -> "ClickUp"
            this.props.onClickStateCallback(uuid, clickState, UIConstants.LIST_MODE_PORTAL);
          }
        }
    },

    /**
     * This method takes a portalItem as argument - which is all the props retreived from the data model
     * for portals. Based on type of the content (360 image / video, 2D image / video) it adds relevant 
     * ViroComponents to render the inside of the portals.
     */
    _renderPortalInside(portalItem) {
        var portalSource = (this.props.portalIDProps.portal360Image != undefined && this.props.portalIDProps.portal360Image != null) ? this.props.portalIDProps.portal360Image: portalItem.portal360Image;
        if(this._is360Photo(portalSource, portalSource.width, portalSource.height)) {
           if (portalSource.type == PSConstants.PS_TYPE_360_VIDEO) {
            return (
              <Viro360Video key="background_portal_video" muted={!this.state.insidePortal} volume={1.0} source={portalSource.source} loop={true} />
            );
          } else {
            return (
              <Viro360Image key="background_portal" source={portalSource.source} />
            );
          }
        } else {
          // If the content selected is a 2D video, we create a sub-scene with a "theater" background sphere with a Video rendering inside the portal
          // If it's a 2D image, we add a 3D "pedestal" like object to create an art gallery inside the portal.
          var viewArray = [];
          if(this._isVideo(portalSource.source.uri)) {
            viewArray.push(<ViroSphere  position={[0,0,0]} radius={56} facesOutward={false} key="background_portal" materials="theatre" />);
            viewArray.push(<ViroVideo key="image_portal" width={1} height={1}  source={portalSource.source}
                         position={[0, 3.9, -39]} scale={[42, 21, 1]} />);
          } else {
            viewArray.push(  <ViroSpotLight key="obj_spotlight"
                innerAngle={5}
                outerAngle={20}
                direction={[0,-1,0]}
                position={[0, 6, 0]}
                color="#ffffff"
                castShadows={true}
                shadowNearZ={.1}
                shadowFarZ={5}
                shadowOpacity={.9} />);
            viewArray.push(<Viro3DObject
                  key="obj_3d"
                  position={[0,-2,-6]}
                  scale={[0.5,0.5,0.5]}
                  source={require('../res/art_gallery/artgallery3.vrx')}
                  resources={[require('../res/art_gallery/art_gallery_projector_diffuse.png'),
                       require('../res/art_gallery/art_gallery_projector_specular.png'),
                       require('../res/art_gallery/art_gallery_walls_diffuse.png'),
                       require('../res/art_gallery/art_gallery_walls_specular.png')]}
                  type="VRX" />
              );

            viewArray.push(<ViroImage key="image_portal" width={2} height={4}  resizeMode='ScaleToFill' imageClipMode='None' source={portalSource.source}
                        position={[0, 0.8,-5.8]} scale={[1, 1, 1]} />);
            viewArray.push(<Viro360Image key="background_portal_image" source={require('../res/360_space.jpg')} />);

          }
          return viewArray;
        }
    },

     _isVideo(videoUri) {
      return (videoUri.toLowerCase().endsWith("mov") || videoUri.toLowerCase().endsWith("mp4"));
    },

    _is360Photo(source, width, height) {
      let ratio = width / height;
      return (ratio > 1.9 && ratio < 2.2);
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
        this.props.onClickStateCallback(this.props.portalIDProps.uuid, rotateState, UIConstants.LIST_MODE_MODEL);
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

      if(pinchState == 3) {
        this.setState({
          scale : newScale
        });
        this.props.onClickStateCallback(this.props.portalIDProps.uuid, pinchState, UIConstants.LIST_MODE_MODEL);
        return;
      }

      this.arNodeRef.setNativeProps({scale:newScale});
    },

    _onError(uuid) {
        return () => {
          this.props.loadCallback(uuid, LoadConstants.ERROR);
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
     * This method is executed once a portal finishes loading, the position and forward argument are used to
     * find the correct position of the portal. position, forward and results are calculated when user adds a portal to 
     * the scene by performing an AR Hit Test (see https://docs.viromedia.com/docs/viroarscene)
     */
    _onARHitTestResults(position, forward, results) {
      // default position is just 3 forward of the user
      let scaledForwardVector = [forward[0] * 1.2, forward[1]* 1.2, forward[2]* 1.2];
      let newPosition = [position[0] + scaledForwardVector[0], position[1] + scaledForwardVector[1], position[2] + scaledForwardVector[2]];

      // we need to set the position before making the node visible because of a race condition
      // in the case of portals, this could cause the portal to appear where the user is before
      // moving to it's location causing the user to accidentally "pass" through the portal.
      this._setInitialPlacement(newPosition);
    },
    _onPortalEnter() {
      this.setState({
        insidePortal:true,
      });
    },

    _onPortalExit() {
      this.setState({
        insidePortal:false,
      });
    },

    _setInitialPlacement(position) {
      this.setState({
          position: position,
      });
      this.setTimeout(() =>{this._updateInitialRotation()}, 500);
    },

    // This function gets the rotation transform of the parent ViroNode that was placed in the scene by the user
    // and applies that rotation to the portal inside the ViroNode (by setting state). This is done to ensure that
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

module.exports = PortalItemRender;
