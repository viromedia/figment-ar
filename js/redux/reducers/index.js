/**
 * Copyright (c) 2017-present, Viro, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

import { combineReducers } from 'redux';
import arobjects from './arobjects';
import ui from './ui';

// Combine Reducers for redux for handling state changes in the AR Scene (3D Viro Components) and React-Native UI components
module.exports = combineReducers({
  arobjects, ui
});
