/**
 * Copyright (c) 2017-present, Viro, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
 
 /**
  * Helper function for conditional rendering. Takes two arguments:
  * condition - any condition that evaluates to true or false,
  * content - JS content to render if the give condition evaluates to true
  */
export default function renderIf(condition, content) {
    if (condition) {
        return content;
    } else {
        return null;
    }
}
