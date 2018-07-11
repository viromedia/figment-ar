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

import *  as UIConstants from '../redux/UIConstants';
import * as LoadingConstants from '../redux/LoadingStateConstants';
import { connect } from 'react-redux'
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableHighlight, ActivityIndicator, View, ListView, Image, YellowBox} from 'react-native';
import renderIf from '../helpers/renderIf';
import ListViewItem from './ListViewItem';

/**
 * ListView wrapper that encapsulates behavior for the Listview seen at the bottom of the screen
 * in the app. 
 */
class FigmentListView extends Component {
    constructor(props) {
      super(props);

      // The app was written before React-Native's Flatlist was ready for prime time
      // ListView necessitates relying on componentWillReceiveProps, which since updating
      // react-native dependency to v55.1 has started throwing these warnings
      YellowBox.ignoreWarnings([
           'Warning: componentWillUpdate is deprecated',
           'Warning: componentWillReceiveProps is deprecated',
      ]);

      this._renderListItem = this._renderListItem.bind(this);
      this._isSelected = this._isSelected.bind(this);
      this._onAnimationDone = this._onAnimationDone.bind(this);
      this._onListItemPressed = this._onListItemPressed.bind(this);

      var ds = new ListView.DataSource({rowHasChanged: (r1, r2) =>  r1 !== r2 });
      this.state = {
        rowChanged: 0,
        dataRows: this.props.items,
        dataSource: ds.cloneWithRows(this.props.items),
        selectedItem: -1,
        animationDone:false
      }
    }

    componentWillReceiveProps(nextProps) {
      var newRows = nextProps.items.slice(0);
      newRows[this.state.rowChanged] = {
          ...nextProps.items[this.state.rowChanged],
      };

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(newRows),
        dataRows: newRows
      });
    }

    render(){
      if(this.state.dataSource == undefined) {
          return (<View/>);
      }
      return (
      <ListView
        horizontal={true}
        contentContainerStyle={styles.listViewContainer}
        dataSource={this.state.dataSource}
        renderRow={this._renderListItem}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        pageSize={5}
        directionalLockEnabled={true}
        removeClippedSubviews={false}/>);
    }

    _renderListItem(data, sectionid, rowId) {
        return (
          <View style={{marginLeft: 10}}>
              <ListViewItem onPress={this._onListItemPressed(rowId)} 
                    key={data.icon_img + this.props.currentSelectedEffect}
                    stateImageArray={[data.icon_img]}
                    style={styles.photo}
                    animationDoneCallBack = {this._onAnimationDone}/>
                {renderIf(data.loading == LoadingConstants.LOADING,
                    <ActivityIndicator style={{position:'absolute', marginLeft: 12, marginTop: 19, }} animating={true} size='large'/>
                )}
                
                {renderIf(this._isSelected(data, rowId),
                  <Image source={require("../res/icon_effects_selected_pink.png")} style={styles.photoSelection} />
                )}
          </View>                    
        );
    }

    // Check if given rowId in the listView is selected, used to render the pink border around chosen effect
    _isSelected(data, rowId) {
      return (this.props.listMode == UIConstants.LIST_MODE_EFFECT 
        && this.state.animationDone
        && this.state.selectedItem == rowId);
    }

    // Called when animation on the listViewItem is done
    _onAnimationDone() {
      this.setState({
        animationDone:true,
      })
    }

    _onListItemPressed(rowId) {
        let selectedItem = this.props.listMode == UIConstants.LIST_MODE_EFFECT ? rowId : this.state.selectedItem;
        
        return () => {
          this.setState({
             rowChanged: parseInt(rowId),
             selectedItem: selectedItem,
          });
          this.props.onPress(rowId);
        }
    }
};

FigmentListView.propTypes = {
  items: PropTypes.array,
  onPress: PropTypes.func,
};

function selectProps(store) {
  return {
    listMode: store.ui.listMode,
    currentSelectedEffect: store.ui.currentEffectSelectionIndex,
  }
}
var styles = StyleSheet.create({
  listViewContainer: {
      height:72,
  },
  photo: {
    height: 53,
    width: 56.8,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
    marginTop: 10,
  },
  photoSelection: {
    position: 'absolute',
    height: 53,
    width: 56.8,
    marginTop: 10,
  },
  submitText: {
    color:'#fff',
    textAlign:'center',
    fontSize : 20
  }
});

module.exports = connect(selectProps)(FigmentListView);
