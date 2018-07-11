/**
 * Copyright (c) 2017-present, Viro Media, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

var nextImageId = 0;
/**
 * Redux actions used to change app state based on events in the app
 */

 // action to change the visible UI screen
 // uiScreenToShow - toggles between SHOW_RECORDING_SCREEN, SHOW_SHARE_SCREEN and SHOW_MAIN_SCREEN
export function displayUIScreen(uiScreenToShow) {
  return {
    type: 'DISPLAY_UI_SCREEN',
    ui: uiScreenToShow,
  }
}

// action to add, to the AR Scene, the model at the given index from data model at path: js/model/ModelItems.js
export function addModelWithIndex(index) {
  return {
      type:'ADD_MODEL',
      index: index,
  }
}

// action to remove model with given UUID from AR Scene
export function removeModelWithUUID(uuid) {
  return {
      type:'REMOVE_MODEL',
      uuid: uuid,
  }
}

// action to add, to the AR Scene, the portal at the given index from data model at path: js/model/PortalItems.js
export function addPortalWithIndex(index) {
  return {
      type:'ADD_PORTAL',
      index: index,
  }
}

// action to remove Portal with given UUID from AR Scene
export function removePortalWithUUID(uuid) {
  return {
      type:'REMOVE_PORTAL',
      uuid: uuid,
  }
}

// action to remove everything from the AR Scene
export function removeAll() {
  return {
    type:'REMOVE_ALL',
  }
}

// action to select model at index, in the listview from data model at path: js/model/ModelItems.js
export function toggleModelSelection(index) {
  return {
    type: 'TOGGLE_MODEL_SELECTED',
    index: index,
  };
}

// action to select effect at index, in the listview from data model at path: js/model/EffectItems.js
export function toggleEffectSelection(index) {
  return {
    type: 'TOGGLE_EFFECT_SELECTED',
    index: index,
  };
}

// action to switch ListView to show Objects, Effects or Portals
export function switchListMode(listMode, listTitle) {
  return {
    type: 'SWITCH_LIST_MODE',
    listMode: listMode,
    listTitle: listTitle,
  };
}

// action to change state of individual ListView items between NONE, LOADING, ERROR, LOADED (path: js/redux/LoadingStateConstants.js)
export function changeModelLoadState(uuid, loadState) {
  return {
    type: 'CHANGE_MODEL_LOAD_STATE',
    uuid: uuid,
    loadState: loadState,
  };
}

// action to change the background of a given portal (identified by uuid) in the scene.
export function changePortalPhoto(uuid, photo) {
  return {
    type: 'CHANGE_PORTAL_PHOTO',
    uuid: uuid,
    photoSource: photo,
  }
}

// action to change state of individual ListView items between NONE, LOADING, ERROR, LOADED (path: js/redux/LoadingStateConstants.js)
export function changePortalLoadState(uuid, loadState) {
  return {
    type: 'CHANGE_PORTAL_LOAD_STATE',
    uuid: uuid,
    loadState: loadState,
  };
}

// action to change state of individual ListView items to determine while item is clicked -> for triggering listview animations
export function changeItemClickState(index, clickState, itemType) {
  return {
    type: 'CHANGE_ITEM_CLICK_STATE',
    index: index,
    clickState: clickState,
    itemType: itemType,
  };
}

// action to show / hide AR Initialization UI to guide user to move device around
export function ARTrackingInitialized(trackingNormal) {
  return {
    type: 'AR_TRACKING_INITIALIZED',
    trackingNormal: trackingNormal,
  };
}

