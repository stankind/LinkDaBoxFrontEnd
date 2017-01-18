import React, { Component, PropTypes } from 'react'
import { LdbEditor } from './LdbEditor'

export default class LdbTextbox extends Component {

  constructor() {
    super();
    this.rawContentJson = ''
  }

  handleLeftDoubleClickByIgnoring(e) {
      if( e.button == 0 || e.nativeEvent.which == 1) {      
        e.stopPropagation();
        e.preventDefault();
      }
  }

  handleMouseEnterDragbar() {
      this.props.onMouseEnterDragbar(this.props.id);
  }

  handleMouseDownOnDragbar(e) {
      if( e.button == 0 || e.nativeEvent.which == 1) {
          e.stopPropagation()
          e.preventDefault()
          this.props.onLeftMouseDownOnDragbar(e, this.props.id)
      }
  }

  handleMouseLeaveDragbar() {
      this.props.onMouseLeaveDragbar(this.props.id)
  }

  handleMouseEnterLinkBtn() {
      this.props.onMouseEnterLinkBtn(this.props.id)
  }

  handleMouseLeaveLinkBtn() {
      this.props.onMouseLeaveLinkBtn(this.props.id)
  }

  handleClickOnLinkBtn(e) {
      if( e.button == 0 || e.nativeEvent.which == 1) {
          e.stopPropagation()
          e.preventDefault()
          this.props.onLeftClickLinkBtn(this.props.id)
      }
  }

  handleMouseUpOnLinkBtn(e) {
      if( e.button == 0 || e.nativeEvent.which == 1) {
          e.stopPropagation();
          e.preventDefault();
      }
  }

  handleMouseEnterCloseBtn() {
      this.props.onMouseEnterCloseBtn(this.props.id)
  }

  handleMouseLeaveCloseBtn() {
      this.props.onMouseLeaveCloseBtn(this.props.id)
  }

  handleClickOnCloseBtn(e) {
      if( e.button == 0 || e.nativeEvent.which == 1) {
          e.stopPropagation()
          e.preventDefault()
          this.props.onLeftClickCloseBtn(this.props.id)
      }
  }

  handleMouseEnterResizer() {
      this.props.onMouseEnterResizer(this.props.id)
  }

  handleMouseLeaveResizer() {
      this.props.onMouseLeaveResizer(this.props.id)
  }

  handleMouseDownOnResizer(e) {
      if( e.button == 0 || e.nativeEvent.which == 1) {
          e.stopPropagation()
          e.preventDefault()
          this.props.onLeftMouseDownOnResizer(e, this.props.id)
      }
  }

  handleMouseUpOnResizer(e) {
      if( e.button == 0 || e.nativeEvent.which == 1) {
          e.stopPropagation()
          e.preventDefault()
          this.props.onLeftMouseUpOnResizer(this.props.id)
      }
  }

  handleMouseDownOnEditor(e) {
      if( e.button == 0 || e.nativeEvent.which == 1) {
          this.props.onLeftMouseDownOnEditor(this.props.id)
      }      
  }

  handleEditorChanged( rawContentJson) {
      this.props.tellCollectionThatEditorChanged( rawContentJson)
  }

  render() {

      var textboxStyle = {
        position: 'absolute',
        top: this.props.y,
        left: this.props.x,
        width: this.props.width,
        height: this.props.height,
        border: '0 solid gray',
        backgroundColor: 'lightyellow',
        boxShadow: '8px 8px 10px',
        transform: 'scale(1.0)',        // TODO - use
      };

     var dragbarCursorStyle = 'move';
     if( this.props.dragbarCursorStyleIsPointer)
        dragbarCursorStyle = 'pointer';

      var dragbarStyle = {
        backgroundColor: this.props.dragbarColor,
        width: this.props.width - 40,
        cursor: dragbarCursorStyle,
        display: 'inline-block',
        float: 'left',
        height: 20,
      };

      const topbarStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 'auto',
        height: 20
      };

      const linkBtnStyle = {
        backgroundColor: this.props.linkBtnColor,
        width: 20,
        display: 'inline-block',
        float: 'left',
        height: 20
      };

      const closeBtnStyle = {
        backgroundColor: this.props.closeBtnColor,
        width: 20,
        display: 'inline-block',
        float: 'left',
        height: 20
      };

      var draftJsDivContainerStyle = {
        position: 'relative',
        top: 20,
        left: 0,
        width: 'auto',
        height: this.props.height - 20,
        borderLeft: '2px solid gray',
        borderRight: '2px solid gray',
        borderBottom: '2px solid gray'
      };

      var editorStyle = { // TODO - does anything??
        boxSizing: 'border-box'
      };

      var resizerStyle = {
        //boxShadow: '8px 8px 10px'    TODO - use?
      }

      return (
        <div key={'textbox'+this.props.id} style={textboxStyle}
             onDoubleClick={ (e)=>this.handleLeftDoubleClickByIgnoring(e) }>

          <div style={topbarStyle}>
            <div ref={'d'+this.props.id} id={'d'+this.props.id} style={dragbarStyle}     
                 onMouseEnter={ this.handleMouseEnterDragbar.bind(this) }
                 onMouseDown={ (e) => this.handleMouseDownOnDragbar(e) }            
                 onMouseLeave={ this.handleMouseLeaveDragbar.bind(this)} >
            </div>

            <div id={'L'+this.props.id} style={linkBtnStyle} 
                 onMouseEnter={ this.handleMouseEnterLinkBtn.bind(this) }
                 onMouseLeave={ this.handleMouseLeaveLinkBtn.bind(this) }
                 onClick={ (e) => this.handleClickOnLinkBtn(e) }
                 onMouseUp={ (e) => this.handleMouseUpOnLinkBtn(e) } >
              <svg width="20" height="20">
                <rect x="3" y="7" width="5" height="5" stroke="white" fill="transparent" />
                <rect x="13" y="7" width="5" height="5" stroke="white" fill="transparent" />
                <line x1="8" y1="10" x2="13" y2="10" stroke="white" />
              </svg>
            </div>

            <div id={'c'+this.props.id} style={closeBtnStyle} 
                 onMouseEnter={ this.handleMouseEnterCloseBtn.bind(this) }
                 onMouseLeave={ this.handleMouseLeaveCloseBtn.bind(this) }
                 onClick={ (e) => this.handleClickOnCloseBtn(e) }>
              <svg width="20" height="20">
                <line x1="3" y1="3" x2="17" y2="17" stroke="white" />
                <line x1="3" y1="17" x2="17" y2="3" stroke="white" />
              </svg>
            </div>
          </div>



          <div style={draftJsDivContainerStyle}>
            <LdbEditor style={editorStyle} rawContentJson={this.rawContentJson}
                       onMouseDown={ (e)=>this.handleMouseDownOnEditor(e) }
                       onEditorChangedHandler={ (rawContentJson)=>this.handleEditorChanged(rawContentJson)} />
          </div>



          <svg width={this.props.width+3} height="30" style={resizerStyle}>
            <rect id={'r'+this.props.id} x={this.props.width-7} y="20" width="10" height="10"
                  fill={this.props.resizerColor} filter='url(#shadowFilterForPoly)' 
                
                onMouseEnter={ this.handleMouseEnterResizer.bind(this) }
                onMouseLeave={ this.handleMouseLeaveResizer.bind(this) }
                onMouseDown={ (e) => this.handleMouseDownOnResizer(e) }
                onMouseUp={ (e) => this.handleMouseUpOnResizer(e) } />
          </svg>
        </div>
      );
  }
}

LdbTextbox.propTypes = {

  id:                           PropTypes.string.isRequired,
  x:                            PropTypes.number.isRequired,
  y:                            PropTypes.number.isRequired,
  width:                        PropTypes.number.isRequired,
  height:                       PropTypes.number.isRequired,
  dragbarColor:                 PropTypes.string.isRequired,
  linkBtnColor:                 PropTypes.string.isRequired,
  closeBtnColor:                PropTypes.string.isRequired,
  resizerColor:                 PropTypes.string.isRequired,
  dragbarCursorStyleIsPointer:  PropTypes.bool.isRequired,

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

  onLeftMouseDownOnEditor:          PropTypes.func.isRequired,
  tellCollectionThatEditorChanged:  PropTypes.func.isRequired
}