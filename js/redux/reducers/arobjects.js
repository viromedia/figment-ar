/**
 * Copyright (c) 2017-present, Viro Media, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */
import * as ModelData from  '../../model/ModelItems';
import * as PortalData from  '../../model/PortalItems';
import * as EffectData from  '../../model/EffectItems';
import * as LoadingConstants from '../LoadingStateConstants';
import * as EffectsConstants from '../EffectsConstants';
import * as PSConstants from '../../component/PSConstants';

/**
 * Reducers for handling state or AR objects (Objects, Portals, Effects) in the AR Scene
 */
const uuidv1 = require('uuid/v1');


// Initial state of the app with empty models, portals and showing no emitters / post proccessing effect
const initialState = {
  modelItems: {},
  portalItems: {},
  effectItems: EffectData.getInitEffectArray(),
  postProcessEffects: EffectsConstants.EFFECT_NONE,
}

// Creates a new model item with the given index from the data model in ModelItems.js
function newModelItem(indexToCreate) {
  return {uuid: uuidv1(), selected: false, loading: LoadingConstants.NONE, index: indexToCreate};
}

// action to change state of individual ListView items between NONE, LOADING, ERROR, LOADED (path: js/redux/LoadingStateConstants.js)
function changeLoadState(state = {}, action) {
 switch (action.type) {
   case 'CHANGE_MODEL_LOAD_STATE':
     return {
       ...state,
       loading: action.loadState,
     };
   default:
     return state;
 }
}

// change the background of a given portal (identified by uuid) in the scene.
function changePortalPhoto(state = {}, action) {
  switch (action.type) {
      case 'CHANGE_PORTAL_PHOTO':
        if(state[action.uuid] != null || state[action.uuid] != undefined) {
          var model = state[action.uuid];
          var newModel = {...model};
          newModel.portal360Image = {...action.photoSource};
          state[action.uuid] = newModel;
        }
        return state;
      default:
        return state;
  }
}

// change effect selection in the Effects Listview (changes which effect has pink border around it)
function modifyEffectSelection(state = [], action) {
  switch(action.type) {
    case 'TOGGLE_EFFECT_SELECTED':
      var effectToggleArray = [];
      // for each effect in the listview, set selected = false for everything, except for the selected index (action.index)
      for(var i =0; i<state.length; i++) {
        if(i != action.index) {
          state[i].selected = false;
        } else {
          if (!state[i].selected) {
            state[i].selected = true;
          } // else if this effect was already selected; do nothing
        }
        effectToggleArray.push(state[i]);
      }
      return effectToggleArray;
    case 'REMOVE_ALL':
      // reset selected = false for every effect
      var effectToggleArray = [];
      for(var i =0; i<state.length; i++) {
          state[i].selected = false;
          effectToggleArray.push(state[i]);
      }
      return effectToggleArray;
  }
}

// Add model at the given index to the AR Scene
function addModelItem(state = {}, action) {
  var model = newModelItem(action.index);
  state[model.uuid] = model;
  return state;
}

// Remove model with given UUID from the AR Scene
function removeModelItem(state = {}, action) {
  state[action.uuid] = null;
  return state;
}

// Change state of individual ListView items between NONE, LOADING, ERROR, LOADED
function modifyLoadState(state = {}, action) {
  if(state[action.uuid] != null || state[action.uuid] != undefined) {
    var model = state[action.uuid];
    var newModel = {...model};
    newModel.loading = action.loadState;
    state[action.uuid] = newModel;
  }
  return state;
}

function arobjects(state = initialState, action) {
  switch (action.type) {

    case 'ADD_MODEL':
      return {
        ...state,
        modelItems: {...addModelItem(state.modelItems, action)},
      }
    case 'REMOVE_MODEL':
      return {
        ...state,
        modelItems: {...removeModelItem(state.modelItems, action)},
      }
    case 'ADD_PORTAL':
      return {
        ...state,
        portalItems: {...addModelItem(state.portalItems, action)},
      }
    case 'REMOVE_PORTAL':
      return {
        ...state,
        portalItems: {...removeModelItem(state.portalItems, action)},
      }
    case 'REMOVE_ALL':
      //clear efffects
      var updatedEffects = modifyEffectSelection(state.effectItems.slice(0), action);
      return {
        ...state,
        portalItems:{},
        modelItems:{},
        effectItems: updatedEffects.slice(0),
        postProcessEffects: EffectsConstants.EFFECT_NONE,
      }
    case 'CHANGE_MODEL_LOAD_STATE':
      return {
        ...state,
        modelItems: {...modifyLoadState(state.modelItems, action)},
      }
    case 'CHANGE_PORTAL_LOAD_STATE':
      return {
        ...state,
        portalItems: {...modifyLoadState(state.portalItems, action)},
      }
    case 'CHANGE_PORTAL_PHOTO':
        return {
          ...state,
          portalItems: {...changePortalPhoto(state.portalItems, action)},
      }
    case 'TOGGLE_EFFECT_SELECTED':
        var updatedEffects = modifyEffectSelection(state.effectItems.slice(0), action);
        return  {
          ...state,
          effectItems: updatedEffects.slice(0),
          postProcessEffects: updatedEffects[action.index].postProcessEffects,
        }
    default:
      return state;
  }
}

module.exports = arobjects;
