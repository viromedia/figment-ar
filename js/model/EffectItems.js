/**
 * Copyright (c) 2017-present, Viro, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
 
import * as LoadingConstants from '../redux/LoadingStateConstants';
import {getSmoke, getEmptyEffect, getGrayScale, getSepia, getSnow, getBubbles, getThermal, getSinCity, getBarrel, getPinCushion, getFireWorks} from '../effects/effects.js'
import * as EffectsConstants from '../redux/EffectsConstants';

/**
 * Data model for Effects provided as input to EffectItemRender. The schema is as follows:
 * effect - the method name in js/effects/effects.js that defines the configuration of this effect
 * loading - Initial state before the effect is added by the user by clicking the listview item. From NONE, it will go to LOADED or LOADERROR when the user tries to add this effect
 * postProcessEffect - Video post process effect to apply to the AR frames in the scene
 * icon_img - the icon that will be shown on the listview at the bottom for this effect
 * selected - Is this effect currently selected by the user. Figment only allows one effect at a given time.
 * name - string key used to identify / retreive this effect from this array
 */
var EffectItems = [
  {
    "effect": getEmptyEffect,
    "loading": LoadingConstants.NONE,
    "postProcessEffects": EffectsConstants.EFFECT_NONE,
    "icon_img":require("../res/icon_effects_none_darkgrey.png"),
    "selected": true,
    "name": "effect_none",
  },
  {
    "effect": getSnow,
    "loading": LoadingConstants.NONE,
    "postProcessEffects": EffectsConstants.EFFECT_NONE,
    "icon_img":require("../res/icon_effects_snow.png"),
    "selected": false,
    "name": "effect_snow",
    "key": "effect_snow",
  },
  {
    "effect": getBubbles,
    "loading": LoadingConstants.NONE,
    "postProcessEffects": EffectsConstants.EFFECT_NONE,
    "icon_img":require("../res/icon_effects_bubbles.png"),
    "selected": false,
    "name": "effect_bubbles",
    "key": "effect_bubbles",
  },
  {
    "effect": getFireWorks,
    "loading": LoadingConstants.NONE,
    "postProcessEffects": EffectsConstants.EFFECT_NONE,
    "icon_img":require("../res/icon_effects_fireworks.png"),
    "selected": false,
    "name": "effect_fireworks",
    "key": "effect_fireworks",
  },
  {
    "effect": getSmoke,
    "loading": LoadingConstants.NONE,
    "postProcessEffects": EffectsConstants.EFFECT_NONE,
    "icon_img":require("../res/icon_effects_smoke.png"),
    "selected": false,
    "name": "effect_smoke",
    "key": "effect_smoke",

  },
  {
    "effect": getGrayScale,
    "loading": LoadingConstants.NONE,
    "postProcessEffects": EffectsConstants.EFFECT_GRAYSCALE,
    "icon_img":require("../res/icon_effects_bw.png"),
    "selected": false,
    "name": "effect_black_white",
  },
  {
    "effect": getSepia,
    "loading": LoadingConstants.NONE,
    "postProcessEffects": EffectsConstants.EFFECT_SEPIA,
    "icon_img":require("../res/icon_effects_sepia.png"),
    "selected": false,
    "name": "effect_sepia",
  },
  {
    "effect": getThermal,
    "loading": LoadingConstants.NONE,
    "postProcessEffects": EffectsConstants.EFFECT_THERMAL,
    "icon_img":require("../res/icon_effects_thermal.png"),
    "selected": false,
    "name": "effect_thermal",
  },
  {
    "effect": getSinCity,
    "loading": LoadingConstants.NONE,
    "postProcessEffects": EffectsConstants.EFFECT_SINCITY,
    "icon_img":require("../res/icon_effects_spotcolor.png"),
    "selected": false,
    "name": "effect_sincity",
  },
  {
    "effect": getBarrel,
    "loading": LoadingConstants.NONE,
    "postProcessEffects": EffectsConstants.EFFECT_BARREL_DISTORT,
    "icon_img":require("../res/icon_effects_barreldistort.png"),
    "selected": false,
    "name": "effect_barrel_distort",
  },
  {
    "effect": getPinCushion,
    "loading": LoadingConstants.NONE,
    "postProcessEffects": EffectsConstants.EFFECT_PINCUSHION_DISTORT,
    "icon_img":require("../res/icon_effects_pincushion.png"),
    "selected": false,
    "name": "effect_pincushion",
  },
]

module.exports = {
  getInitEffectArray: function() {
    return EffectItems;
  }
};
