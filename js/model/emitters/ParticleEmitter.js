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

import EmojiAngryEmitter from './EmojiAngryEmitter';
import BirthdayCakeEmitter from './BirthdayCakeEmitter';

/**
 * Helpful wrapper to return the correct Particle Emitter for Angry Emoji or Birthday Cake.
 * Used in tying together objects and particle emitters in the datamodel at path: js/model/ModelItems.js
 */
class ParticleEmitter extends Component {
	constructor(props) {
		super(props);
	}

	render() {
			if (this.props.modelName == undefined) return null
			switch(this.props.modelName) {
				case 'emoji_angry': {
					return (<EmojiAngryEmitter onClick={this.props.onClick}/>);
				}
				case 'object_bday_cake': {
					return (<BirthdayCakeEmitter onClick={this.props.onClick}/>);
				}
				default: {
					return null;
				}
			}
	}
}

ParticleEmitter.propTypes = {
	onClick: PropTypes.func,
	modelName: PropTypes.string,
}

export default ParticleEmitter;