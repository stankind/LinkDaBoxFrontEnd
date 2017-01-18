import React, { Component, PropTypes } from 'react'
import LdbTextbox from './LdbTextbox'
//import { LdbConstants, LdbManipulationModes, LdbHoverModes, getTextboxCenter } from '../stateMgmt/LdbState'
import { connect } from 'react-redux'
//import { stringifyIgnoreCyclic } from '../misc/StansUtils'

export class LdbTextboxCollection extends Component {

  constructor() {
    super();
  }

  render() {

      var ldbTextboxes = []

      var textboxIds = this.props.textboxes.keySeq().toArray()

      for(var i in textboxIds) {

        const id = textboxIds[i]
        const textbox = this.props.textboxes.get(id)

        ldbTextboxes.push(

          <LdbTextbox key={'textbox'+id} id={id} x={textbox.x} y={textbox.y}
                      width={textbox.width} height={textbox.height}
                      dragbarColor={textbox.dragbarColor} linkBtnColor={textbox.linkBtnColor}
                      closeBtnColor={textbox.closeBtnColor} resizerColor={textbox.resizerColor} 
                      dragbarCursorStyleIsPointer={textbox.dragbarCursorStyleIsPointer}

                      onMouseEnterDragbar={ (id)=>this.props.onMouseEnterDragbar(id) }
                      onLeftMouseDownOnDragbar={ (e,id)=>this.props.onLeftMouseDownOnDragbar(e,id) }
                      onMouseLeaveDragbar={ (id)=>this.props.onMouseLeaveDragbar(id) }
                      onMouseEnterLinkBtn={ (id)=>this.props.onMouseEnterLinkBtn(id) }
                      onMouseLeaveLinkBtn={ (id)=>this.props.onMouseLeaveLinkBtn(id) }
                      onLeftClickLinkBtn={ (id)=>this.props.onLeftClickLinkBtn(id) }
                      onMouseEnterCloseBtn={ (id)=>this.props.onMouseEnterCloseBtn(id) }
                      onMouseLeaveCloseBtn={ (id)=>this.props.onMouseLeaveCloseBtn(id) }
                      onLeftClickCloseBtn={ (id)=>this.props.onLeftClickCloseBtn(id) }
                      onMouseEnterResizer={ (id)=>this.props.onMouseEnterResizer(id) }
                      onMouseLeaveResizer={ (id)=>this.props.onMouseLeaveResizer(id) }
                      onLeftMouseDownOnResizer={ (e,id)=>this.props.onLeftMouseDownOnResizer(e,id) }
                      onLeftMouseUpOnResizer={ (id)=>this.props.onLeftMouseUpOnResizer(id) }
                      onLeftMouseDownOnEditor={ (id)=>this.props.onLeftMouseDownOnEditor(id) }
                      tellCollectionThatEditorChanged={ (s)=>this.props.onSomeEditorChanged(id,s) }
            />
        )
    }

    return ( 
        <div> { ldbTextboxes } </div> );
  }
}

LdbTextboxCollection.propTypes = {
    textboxes:                    PropTypes.object.isRequired,

    onMouseEnterDragbar:          PropTypes.func.isRequired,
    onLeftMouseDownOnDragbar:     PropTypes.func.isRequired,
    onMouseLeaveDragbar:          PropTypes.func.isRequired,

    onMouseEnterLinkBtn:          PropTypes.func.isRequired,
    onMouseLeaveLinkBtn:          PropTypes.func.isRequired,
    onLeftClickLinkBtn:           PropTypes.func.isRequired,

    onMouseEnterCloseBtn:         PropTypes.func.isRequired,
    onMouseLeaveCloseBtn:         PropTypes.func.isRequired,
    onLeftClickCloseBtn:          PropTypes.func.isRequired,

    onMouseEnterResizer:          PropTypes.func.isRequired,
    onMouseLeaveResizer:          PropTypes.func.isRequired,
    onLeftMouseDownOnResizer:     PropTypes.func.isRequired,
    onLeftMouseUpOnResizer:       PropTypes.func.isRequired,

    onLeftMouseDownOnEditor:      PropTypes.func.isRequired,
    onSomeEditorChanged:          PropTypes.func.isRequired
}


//  END OF PURE (DUMB) COMPONENT
//  START OF CONNECTED (SMART, CONTAINER) COMPONENT


function mapStateToProps( reduxState) {

    return { textboxes: reduxState.textboxes };
}

function mapDispatchToProps( dispatch) {
    return {

      onMouseEnterDragbar: (textboxId) =>
          dispatch( {type: 'HOVERING_OVER_DRAGBAR', data: {id: textboxId}}),

      onLeftMouseDownOnDragbar: (e, textboxId) => {

          var dragbar = e.currentTarget;
          var dragbarRect = dragbar.getBoundingClientRect();

          var mouseDownDragbarX = parseInt(e.clientX - dragbarRect.left);
          var mouseDownDragbarY = parseInt(e.clientY - dragbarRect.top);

          var bigDivElem = dragbar.parentElement.parentElement;
          var bigDivRect = bigDivElem.getBoundingClientRect();

          var mouseDownBigDivX = parseInt(e.clientX - bigDivRect.left);
          var mouseDownBigDivY = parseInt(e.clientY - bigDivRect.top);

          dispatch( {type: 'LEFT_MOUSE_DOWN_ON_DRAGBAR',
                     data: {
                                id:                textboxId,
                                mouseDownDragbarX: mouseDownDragbarX,
                                mouseDownDragbarY: mouseDownDragbarY,
                                mouseDownBigDivX:  mouseDownBigDivX,
                                mouseDownBigDivY:  mouseDownBigDivY
                            }
                      })
      },

      onMouseLeaveDragbar: (textboxId) =>
          dispatch( {type: 'UNHOVERED_OVER_DRAGBAR', data: {id: textboxId}}),

      onMouseEnterLinkBtn: (textboxId) =>
          dispatch( {type: 'HOVERING_OVER_LINK_BTN', data: {id: textboxId}}),

      onMouseLeaveLinkBtn: (textboxId) =>
          dispatch( {type: 'UNHOVERED_OVER_LINK_BTN', data: {id: textboxId}}),

      onLeftClickLinkBtn: (textboxId) =>
          dispatch( {type: 'LEFT_CLICK_LINK_BTN', data: {id: textboxId}}),

      onMouseEnterCloseBtn: (textboxId) =>
          dispatch( {type: 'HOVERING_OVER_CLOSE_BTN', data: {id: textboxId}}),

      onMouseLeaveCloseBtn: (textboxId) =>
          dispatch( {type: 'UNHOVERED_OVER_CLOSE_BTN', data: {id: textboxId}}),

      onLeftClickCloseBtn: (textboxId) =>
          dispatch( {type: 'REMOVE_TEXTBOX', data: {id: textboxId}}),

      onMouseEnterResizer: (textboxId) =>
          dispatch( {type: 'HOVERING_OVER_RESIZER', data: {id: textboxId}}),
      
      onMouseLeaveResizer: (textboxId) =>
          dispatch( {type: 'UNHOVERED_OVER_RESIZER', data: {id: textboxId}}),
      
      onLeftMouseDownOnResizer: (e, textboxId) => {

          var resizer = e.currentTarget;
          var bigDivElem = resizer.parentElement.parentElement.parentElement;
          var bigDivRect = bigDivElem.getBoundingClientRect();
          var mouseDownBigDivX = parseInt(e.clientX - bigDivRect.left);
          var mouseDownBigDivY = parseInt(e.clientY - bigDivRect.top);

          dispatch({ type: 'LEFT_MOUSE_DOWN_ON_RESIZER', 
                     data: {
                                id:                textboxId,
                                mouseDownBigDivX:  mouseDownBigDivX,
                                mouseDownBigDivY:  mouseDownBigDivY
                            }
                     })
      },

      onLeftMouseUpOnResizer: () =>
           dispatch( {type: 'RESET_MANIPULATION_MODE'}),

      onLeftMouseDownOnEditor: (textboxId) =>    // TODO - does nothing, so remove!
           dispatch( {type: 'POP_TEXTBOX_TO_TOP',
                      data: {id: textboxId} }),

      onSomeEditorChanged: (textboxId, rawContentJson) => {        
            dispatch( { type: 'SET_TEXTBOX_RAW_CONTENT_JSON', 
                        data: {id: textboxId, rawContentJson: rawContentJson} })
 //           ,
 //          dispatch( {type: 'POP_TEXTBOX_TO_TOP',   TODO - forces 2 clicks to start typing!
 //                     data: {id: textboxId} })
      },
    }
}

export const LdbTextboxCollectionContainer = connect( mapStateToProps, mapDispatchToProps)(LdbTextboxCollection)