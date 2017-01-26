import React, { Component, PropTypes } from 'react'
import LdbLink from './LdbLink'
import { LdbConstants, LdbManipulationModes, LdbHoverModes, getTextboxCenter } from '../stateMgmt/LdbState'
import { getWhereArrowTouchesTextbox } from './LdbCanvasUtils'
import { connect } from 'react-redux'
import { Map } from 'immutable'
//import { stringifyIgnoreCyclic } from '../misc/StansUtils'

export class LdbLinkCollection extends Component {

  constructor() {
    super();
  }

  render() {

      var ldbLinks = []

      var linkIds = this.props.links.keySeq().toArray()

      for(var i in linkIds) {

        const id = linkIds[i]
        const link = this.props.links.get(id)

        ldbLinks.push(
            <LdbLink key={'link'+link.id} id={link.id} 
                     x1={link.x1} y1={link.y1} x2={link.x2} y2={link.y2} 
                     color={link.color}
                                        
                     handleMouseEnter={ ()=>this.props.mouseEnteredLink(link.id) }
                     handleMouseLeave={ ()=>this.props.mouseLeftLink(link.id) }
                     handleClick={ (e,linkId) => this.props.handleClick(e,linkId) }
            />
        )
    }

        const svgCanvasStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: LdbConstants.MAX_CANVAS_WIDTH,
      height: LdbConstants.MAX_CANVAS_HEIGHT,
    };

    return ( 
        <svg style={svgCanvasStyle}>
          <defs>
            <filter id="shadowFilterForLine" x="0" y="0" width="200%" height="200%">
                <feOffset result="offOut" in="SourceAlpha" dx="15" dy="15" />
                <feGaussianBlur result="blurOut" in="offOut" stdDeviation="6" />
                <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
            </filter>
            <filter id="shadowFilterForPoly" y="-10" height="40" x="-10" width="150">
                <feOffset in="SourceAlpha" dx="15" dy="15" result="offset2" />
                <feGaussianBlur in="offset2" stdDeviation="6"  result="blur2"/>
                <feMerge>
                    <feMergeNode in="blur2" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
          </defs>

          { ldbLinks }
           
        </svg> );
  }
}

LdbLinkCollection.propTypes = {
    links:             PropTypes.object.isRequired,

    mouseEnteredLink:  PropTypes.func.isRequired,
    mouseLeftLink:     PropTypes.func.isRequired,
    handleClick:       PropTypes.func.isRequired
}


//  END OF PURE (DUMB) COMPONENT
//  START OF CONNECTED (SMART, CONTAINER) COMPONENT


function getLinkColor(link, ldbHoverMode, ldbHoverId, ldbManipulationMode, ldbManipulationId) {

    var color = 'gray';
    if(    ldbHoverMode == LdbHoverModes.HOVERING_OVER_LINK
        && ldbHoverId == link.id) {

        color = 'blue';
    }
    if(    ldbManipulationMode == LdbManipulationModes.LINK_SELECTED
        && ldbManipulationId == link.id) {

        color = 'red';
    }

    return color;
}

function mapStateToProps( reduxState) {

    if( reduxState === undefined)
      console.log('reduxState is undefined!!!')

    var augmentedLinks = Map();
    
    var linkKeys = reduxState.links.keySeq().toArray();
    for(var i in linkKeys)
    {
        var linkId       = linkKeys[i];

        var link         = reduxState.links.get( linkId);
        var startTextbox = reduxState.textboxes.get( link.startId);
        var endTextbox   = reduxState.textboxes.get( link.endId);

        //console.log('LdbLinkCollection.mapStateToProps(): link.endId=' + link.endId); // + '  endTextbox = ' + stringifyIgnoreCyclic(endTextbox))

        const startTextboxCenter = getTextboxCenter( startTextbox);
        const arrowTipLocation   = getWhereArrowTouchesTextbox( startTextbox, endTextbox);

        const color = getLinkColor( link, reduxState.hoverMode,        reduxState.hoverId,
                                          reduxState.manipulationMode, reduxState.manipulationTargetId);
        link.x1    = startTextboxCenter.x,
        link.y1    = startTextboxCenter.y,
        link.x2    = arrowTipLocation.x,
        link.y2    = arrowTipLocation.y,
        link.color = color

       augmentedLinks = augmentedLinks.set( link.id, link);
    }

    return { links: augmentedLinks };
}

function mapDispatchToProps( dispatch) {
    return {
      mouseEnteredLink: (linkId) =>
        dispatch( {type: 'HOVERING_OVER_LINK', data: {id: linkId}}),

      mouseLeftLink: (linkId) =>
        dispatch( {type: 'UNHOVERED_OVER_LINK', data: {id: linkId}}),

      handleClick: (e, linkId) => {
        if( e.button == 0 || e.nativeEvent.which == 1) {
            e.stopPropagation();
            e.preventDefault();
            dispatch( {type: 'LINK_LEFT_CLICKED', data: {id: linkId}})
        }
      }
    }
}

export const LdbLinkCollectionContainer = connect( mapStateToProps, mapDispatchToProps)(LdbLinkCollection)