/**
 * Copyright (c) 2017-present, Viro, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
 
import * as LoadingConstants from '../redux/LoadingStateConstants';

var POSITION_OFFSET = .05 // 5 cm

/**
 * Data model for Portals provided as input to PortalItemRenderer. The schema is as follows:
 * name - string key used to identify / retreive this portal from this data model array
 * selected - Is this portal currently selected by the user. Used in identifying which portal to execute action from Context Menu (example - remove action)
 * loading - initial loading state. Can toggle to LOADING, LOADED, ERROR when user tries to add the portal to the system
 * icon_img - the icon that will be shown on the listview at the bottom for this portal
 * obj - path for VRX format obj for this portal's 3D door frame. Checked in locally
 * materials - materials used in the VRX model (Currently unused since moving to VRX format)
 * animation - VRX skeletal animations that are baked in to the model definition itself (Currently unused for portals, used in ModelItems)
 * portal360Image - the 360 image used as background inside the portal
 * scale - initial scale of the node containing the portal
 * portalScale - scale of the portal 3D door frame
 * position - initial position of the model.
 * frameType - VRX / OBJ format for the frame object in the portal
 * resources - all the materials (textures) used in this object, that are checked in locally.
 */
var PortalItems = [
  {
    "name": "portal_archway",
    "selected": false,
    "loading": LoadingConstants.NONE,
    "icon_img":require("../res/icon_portal_archway.png"),
    "obj": require("../res/portal_archway/portal_archway.vrx"),
    "materials": null,
    "portal360Image": {source:require("../res/360_diving.jpg"), width:2, height:1},
    "animation":undefined,
    "scale": [1, 1, 1],
    "portalScale": [.2, .2, .2], // scale on the portal, normalizes its height to ~1
    "position": [0, 0, 0],
    "frameType": "VRX",
    "resources": [require('../res/portal_archway/portal_archway_normal.png'),
                  require('../res/portal_archway/portal_archway_diffuse.png'),
                  require('../res/portal_archway/portal_archway_specular.png'),
                  require('../res/portal_archway/portal_entry.png')],
  },
  {
    "name": "portal_picture_frame",
    "selected": false,
    "loading": LoadingConstants.NONE,
    "icon_img":require("../res/icon_portal_picture_frame.png"),
    "obj": require("../res/portal_picture_frame/portal_picture_frame.vrx"),
    "materials": null,
    "portal360Image": {source:require("../res/360_guadalupe.jpg"), width:2, height:1},
    "animation":null,
    "scale": [1, 1, 1],
    "portalScale": [.45, .45, .45],
    "position": [0, 0, 0],
    "frameType": "VRX",
    "physics": undefined,
    "ref_pointer": undefined,
    "resources": [require('../res/portal_picture_frame/portal_picture_frame_specular.png'), require('../res/portal_picture_frame/portal_picture_frame_diffuse.png'), require('../res/portal_picture_frame/portal_picture_frame_normal.png')],
  },
  {
    "name": "portal_window_frame",
    "selected": false,
    "loading": LoadingConstants.NONE,
    "icon_img":require("../res/icon_portal_windowframe.png"),
    "obj": require("../res/portal_window_frame/portal_window_frame.vrx"),
    "materials": null,
    "portal360Image": {source:require("../res/360_guadalupe.jpg"), width:2, height:1},
    "animation":null,
    "scale": [1, 1, 1],
    "portalScale": [.275, .275, .275],
    "position": [0, 0, 0],
    "frameType": "VRX",
    "physics": undefined,
    "ref_pointer": undefined,
    "resources": [require('../res/portal_window_frame/portal_window_frame_specular.png'), require('../res/portal_window_frame/portal_window_frame_diffuse.png'), require('../res/portal_window_frame/portal_window_frame_normal.png')],
  },
    {
    "name": "portal_wood_frame",
    "selected": false,
    "loading": LoadingConstants.NONE,
    "icon_img":require("../res/icon_portal_wood_doorframe.png"),
    "obj": require("../res/portal_wood_frame/portal_wood_frame.vrx"),
    "materials": null,
    "portal360Image": {source:require("../res/360_westlake.jpg"), width:2, height:1},
    "animation":null,
    "scale": [1, 1, 1],
    "portalScale": [.2, .2, .2],
    "position": [0, 0, 0],
    "frameType": "VRX",
    "physics": undefined,
    "ref_pointer": undefined,
    "resources": [require('../res/portal_wood_frame/portal_wood_frame_specular.png'), require('../res/portal_wood_frame/portal_wood_frame_diffuse.png'), require('../res/portal_wood_frame/portal_wood_frame_normal.png')],
  },
  {
    "name": "portal_ship",
    "selected": false,
    "loading": LoadingConstants.NONE,
    "icon_img":require("../res/icon_portal_shipdoor.png"),
    "obj": require("../res/portal_ship/portal_ship.vrx"),
    "materials": null,
    "portal360Image": {source:require("../res/360_waikiki.jpg"), width:2, height:1},
    "animation":null,
    "scale": [1, 1, 1],
    "portalScale": [.07, .07, .07],
    "position": [0, .5, 0],
    "frameType": "VRX",
    "physics": undefined,
    "ref_pointer": undefined,
    "resources": [ require('../res/portal_ship/portal_ship_normal.png'), require('../res/portal_ship/portal_ship_diffuse.png')],
  },
]


module.exports = {
  getPortalArray: function() {
    return PortalItems;
  }
};
