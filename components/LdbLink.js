import React, { Component, PropTypes } from 'react'
import { LdbConstants } from '../stateMgmt/LdbState'
import { getDirectionCwFromEastDeg } from '../misc/StansUtils'
//import { stringifyIgnoreCyclic } from '../misc/StansUtils'

export default class LdbLink extends Component {

  constructor() {
    super();
  }

  handleDoubleClickByIgnoring(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  onMouseEnter() {
    this.props.handleMouseEnter();
  }

  onMouseLeave() {
    this.props.handleMouseLeave();
  }

  onClick(e) {
    e.stopPropagation();
    e.preventDefault();
    this.props.handleClick(e, this.props.id);
  }

  handleMouseUpByIgnoring(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  render() {

      const x1    = this.props.x1;
      const x2    = this.props.x2;
      const y1    = this.props.y1;
      const y2    = this.props.y2;
      const color = this.props.color;

      const arrowDirectionDeg = getDirectionCwFromEastDeg( x1,y1,x2,y2);
      const arrowTransformStr = 'translate(' + x2.toString() + ',' + y2.toString() +
                                     '), rotate(' + arrowDirectionDeg.toString() + ')';
      const gStyle = {
          position: 'absolute',
          top:  0,
          left: 0,
          width:  LdbConstants.MAX_CANVAS_WIDTH,
          height: LdbConstants.MAX_CANVAS_HEIGHT,
          stroke: color,
          fill:   color
      };

      return (
        <g style={gStyle}
                onMouseEnter={this.onMouseEnter.bind(this)} 
                onMouseLeave={this.onMouseLeave.bind(this)}
                onClick={this.onClick.bind(this)}
                onMouseUp={(e)=>this.handleMouseUpByIgnoring(e)}
                onDoubleClick={(e)=>this.handleDoubleClickByIgnoring(e)} >
            <line x1={x1} y1={y1} x2={x2} y2={y2}
                  strokeWidth="3" filter="url(#shadowFilterForLine)" />
            <polygon points="-36,-9  0,0  -36,9" transform={arrowTransformStr}
                     strokeWidth="0" filter="url(#shadowFilterForPoly)" />
        </g>
      );
  }
}

LdbLink.propTypes = {

  id:      PropTypes.string.isRequired,
  x1:      PropTypes.number.isRequired,
  y1:      PropTypes.number.isRequired,
  x2:      PropTypes.number.isRequired,
  y2:      PropTypes.number.isRequired,
  color:   PropTypes.string.isRequired,

  handleMouseEnter: PropTypes.func.isRequired,
  handleMouseLeave: PropTypes.func.isRequired,
  handleClick:      PropTypes.func.isRequired
}