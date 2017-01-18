import React, { Component, PropTypes } from 'react'
import { LdbConstants } from '../stateMgmt/LdbState'
import { connect } from 'react-redux'
//import { stringifyIgnoreCyclic }     from '../misc/StansUtils'
import { LdbLinkCollectionContainer } from './LdbLinkCollection'
import { LdbTextboxCollectionContainer } from './LdbTextboxCollection'

class LdbCanvas extends Component {

  constructor() {
    super();
  }

  handleClickOnBigDiv(e) {

    if( e.button == 0 || e.nativeEvent.which == 1) {
      e.stopPropagation();
      e.preventDefault();
      this.props.handleLeftClickOnBigDiv();
    }
  }

  handleDoubleClickOnBigDiv(e) {

    if( e.button == 0 || e.nativeEvent.which == 1) {
      e.stopPropagation();
      e.preventDefault();

      var divElem = e.currentTarget;
      var rect = divElem.getBoundingClientRect();
      var x = parseInt(e.clientX - rect.left);
      var y = parseInt(e.clientY - rect.top);

      this.props.handleLeftDoubleClickOnBigDiv(x,y);
    }
  }

  handleMouseMoveOnBigDiv(e) {

      e.stopPropagation();
      e.preventDefault(); 
      
      var theBigDivElem = e.currentTarget;
      var rect = theBigDivElem.getBoundingClientRect();
      var mouseBigDivX = parseInt(e.clientX - rect.left);
      var mouseBigDivY = parseInt(e.clientY - rect.top); 

      this.props.handleMouseMovedOnBigDiv( mouseBigDivX, mouseBigDivY);
  }

  handleMouseUpOnBigDiv(e) {

    if( e.button == 0 || e.nativeEvent.which == 1) {
        this.props.resetManipulationMode();
      }
  }

  handleMouseLeaveBigDiv() {

    //this.props.resetManipulationMode();
  }


  /*
  handleMouseWheel(e) {
    e.stopPropagation();
    e.preventDefault();
    console.log('MOUSE WHEEL: e.wheelDelta=' + e.wheelDelta + '  e.detail=' + e.originalEvent.detail);
  }
*/


  render() {

    const bigDivStyle = {
      margin: 5,
      width:  LdbConstants.MAX_CANVAS_WIDTH,
      height: LdbConstants.MAX_CANVAS_HEIGHT,
      border: 2,
      borderStyle: 'inset',
      backgroundColor: '#e8e8e8',
      position: 'relative',
      transform: 'scale(1.0)',        // TODO - use
      transformOrigin: 'left top',
    };

    return (
    
      <div style={bigDivStyle}
           onDoubleClick={ (e)=>this.handleDoubleClickOnBigDiv(e) }
           onClick={ (e)=>this.handleClickOnBigDiv(e) }
           onMouseMove={ (e)=>this.handleMouseMoveOnBigDiv(e) }
           onMouseUp={ (e)=>this.handleMouseUpOnBigDiv(e) }
           onMouseLeave={ this.handleMouseLeaveBigDiv.bind(this) }

           onWheel={ this.handleMouseWheel }>

         <LdbLinkCollectionContainer />
         <LdbTextboxCollectionContainer />

      </div>
    );

  }
}         

LdbCanvas.propTypes = {
  handleLeftClickOnBigDiv:        PropTypes.func.isRequired,
  handleLeftDoubleClickOnBigDiv:  PropTypes.func.isRequired,
  handleMouseMovedOnBigDiv:       PropTypes.func.isRequired,
  resetManipulationMode:          PropTypes.func.isRequired
}


// THE CONNECTED (CONTAINER) COMPONENT


function mapStateToProps() {
  return {}
}

function mapDispatchToProps( dispatch) {
  return {
    handleLeftClickOnBigDiv: ()=>
      dispatch( {type: 'RESET_MANIPULATION_MODE'} ),
    handleLeftDoubleClickOnBigDiv: (x,y)=>
      dispatch( {type: 'ADD_TEXTBOX', data:{x:x,y:y}} ),
    handleMouseMovedOnBigDiv: ( mouseBigDivX, mouseBigDivY)=>
      dispatch( {type: 'MOUSE_MOVED', data:{mouseBigDivX:mouseBigDivX, mouseBigDivY:mouseBigDivY}} ),
    resetManipulationMode: ()=>
      dispatch( {type: 'RESET_MANIPULATION_MODE'})
  }
}

export const LdbCanvasContainer = connect( mapStateToProps, mapDispatchToProps)(LdbCanvas);