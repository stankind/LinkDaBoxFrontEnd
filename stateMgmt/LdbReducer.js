import { getFreeNumKeyAsString } from '../misc/StansUtils'
import { LdbConstants, LdbManipulationModes, LdbHoverModes, canLink } from './LdbState'
//import { stringifyIgnoreCyclic } from '../misc/StansUtils'
import { Map } from 'immutable'

function getDefaultRawContentJson() {
    const defaultRawContentJson =
    
//              '{"entityMap":{},"blocks":[\
//                  {"key":"ed6so","text":"Type here!","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},\
//                  {"key":"61oan","text":"Line 2","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},\
//                  {"key":"eeaq8", "text":"Line 3","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}\
//              ]}'

              '{"entityMap":{},"blocks":[\
                  {"key":"ed6so","text":"Type here!","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}\
              ]}'

    return defaultRawContentJson
}

export function getDefaultLdbState() {

  const defaultRawContentJson = getDefaultRawContentJson()

  const defaultState0 = {
    manipulationMode: LdbManipulationModes.NONE,
    manipulationTargetId: '-1',
    hoverMode: LdbHoverModes.NONE,
    hoverId: '-1',
    textboxes: Map(),
    links:     Map(),
    textboxDragData: null,
    textboxResizeData: null,
    rawContentJson: defaultRawContentJson
  };

  const stateOneTb    = ldbReducer( defaultState0, {type:'ADD_TEXTBOX', data: {x:20, y:20 }});
  const stateTwoTbs   = ldbReducer( stateOneTb,    {type:'ADD_TEXTBOX', data: {x:320, y:80 }});
  const stateThreeTbs = ldbReducer( stateTwoTbs,   {type:'ADD_TEXTBOX', data: {x:160, y:220 }});
  const defaultState2 = ldbReducer( stateThreeTbs, {type:'ADD_LINK',    data: {startId:'0', endId:'1' }});
  const defaultState3 = ldbReducer( defaultState2, {type:'ADD_LINK',    data: {startId:'0', endId:'2' }});

  return defaultState3;
}

export const defaultState = getDefaultLdbState();

function setTextboxColors( textboxes, textboxId, dragbarColor, linkBtnColor, 
                           closeBtnColor, resizerColor, cursorIsPointer=false) {

  var oldTextbox = textboxes.get(textboxId);

  var newTextbox = {
    id: oldTextbox.id,
    x: oldTextbox.x,
    y: oldTextbox.y,
    width: oldTextbox.width,
    height: oldTextbox.height,
    dragbarColor: dragbarColor,
    linkBtnColor: linkBtnColor,
    closeBtnColor: closeBtnColor,
    resizerColor: resizerColor,
    dragbarCursorStyleIsPointer: cursorIsPointer, // oldTextbox.dragbarCursorStyleIsPointer,
    rawContentJson: oldTextbox.rawContentJson
  }

  var newTextboxes = textboxes.set(textboxId, newTextbox);
  return newTextboxes;
}

function setTextboxRawContentJson( textboxes, textboxId, rawContentJson) {

  var oldTextbox = textboxes.get(textboxId);

  var newTextbox = {
    id: oldTextbox.id,
    x: oldTextbox.x,
    y: oldTextbox.y,
    width: oldTextbox.width,
    height: oldTextbox.height,
    dragbarColor: oldTextbox.dragbarColor,
    linkBtnColor: oldTextbox.linkBtnColor,
    closeBtnColor: oldTextbox.closeBtnColor,
    resizerColor: oldTextbox.resizerColor,
    dragbarCursorStyleIsPointer: oldTextbox.dragbarCursorStyleIsPointer,
    rawContentJson: rawContentJson
  }

  var newTextboxes = textboxes.set(textboxId, newTextbox);
  return newTextboxes;
}

export function ldbReducer( currentState = defaultState, action) {

  //console.log('\naction.type = ' + action.type)
  //console.log('ldbReducer: action = ' + stringifyIgnoreCyclic(action));

  var newId, newState;

  const defaultRawContentJson = getDefaultRawContentJson();

  switch( action.type) {


    case 'ADD_TEXTBOX':

      newId = getFreeNumKeyAsString( currentState.textboxes);

      var x = action.data.x;
      var y = action.data.y;

      if( x < 0)
        x = 0;
      if( y < 0)
        y = 0;
      if( x > LdbConstants.MAX_CANVAS_WIDTH-LdbConstants.TEXTBOX_WIDTH)
        x = LdbConstants.MAX_CANVAS_WIDTH-LdbConstants.TEXTBOX_WIDTH;
      if( y > LdbConstants.MAX_CANVAS_WIDTH-LdbConstants.TEXTBOX_HEIGHT)
        y = LdbConstants.MAX_CANVAS_HEIGHT-LdbConstants.TEXTBOX_HEIGHT;

      var newTextbox = {
        id:                           newId,
        x:                            x,
        y:                            y,
        width:                        LdbConstants.TEXTBOX_WIDTH,
        height:                       LdbConstants.TEXTBOX_HEIGHT,
        dragbarColor:                 'gray',
        linkBtnColor:                 'gray',
        closeBtnColor:                'gray',
        resizerColor:                 'gray',
        dragbarCursorStyleIsPointer:  false,
        rawContentJson:               defaultRawContentJson
      };

      var newTextboxes = currentState.textboxes.set(newId, newTextbox);

      if( currentState.manipulationMode == LdbManipulationModes.LINKING_TEXTBOXES) {
            redId = currentState.manipulationTargetId;
            newTextboxes = setTextboxColors( currentState.textboxes, redId, 'gray',
                                              'gray','gray','gray', false)    
      }

      newState = {
        manipulationMode: LdbManipulationModes.NONE, 
        manipulationTargetId: '-1',
        hoverMode: LdbHoverModes.NONE,
        hoverId: '-1',
        textboxes: newTextboxes,
        links:     currentState.links,
        textboxDragData: null,
        textboxResizeData: null
      };
      return newState;


    case 'REMOVE_TEXTBOX':
      var idToRemove = action.data.id;

      newTextboxes = currentState.textboxes.delete(idToRemove);
      newLinks = currentState.links;

      var linkIds = currentState.links.keySeq().toArray();
      for(var i in linkIds)
      {
        var linkKey = linkIds[i];
        var link = currentState.links.get(linkKey);
        if( link.startId != idToRemove && link.endId != idToRemove) {
          //console.log('keeping link id ' + link.id);
        }
        else
        {
          newLinks = newLinks.delete(link.id);
        }
      }

      newState = {
        manipulationMode: LdbManipulationModes.NONE, 
        manipulationTargetId: '-1',
        hoverMode: LdbHoverModes.NONE,
        hoverId: '-1',
        textboxes: newTextboxes,
        links:     newLinks,
        textboxDragData: null,
        textboxResizeData: null
      };
      return newState;      


    case 'HOVERING_OVER_DRAGBAR':

        var textboxId = action.data.id;

        var cursorIsPointer = false;
        if( currentState.manipulationMode == LdbManipulationModes.LINKING_TEXTBOXES
            && canLink( currentState, currentState.manipulationTargetId, textboxId)) {
              cursorIsPointer = true;
            }

        var linkBtnColor = 'gray'
        if( currentState.manipulationMode == LdbManipulationModes.LINKING_TEXTBOXES
            && currentState.manipulationTargetId == textboxId)
          linkBtnColor = 'red'

        newState = {
            manipulationMode: currentState.manipulationMode,
            manipulationTargetId: currentState.manipulationTargetId,
            hoverMode: LdbHoverModes.HOVERING_OVER_DRAGBAR,
            hoverId: textboxId,        
            textboxes: setTextboxColors( currentState.textboxes, textboxId, 'blue', linkBtnColor, 'gray','gray', cursorIsPointer),
            links:     currentState.links,
            textboxDragData: currentState.textboxDragData,
            textboxResizeData: currentState.textboxResizeData     
        }
        return newState;


    case 'UNHOVERED_OVER_DRAGBAR':

        textboxId = action.data.id;    

        linkBtnColor = 'gray'
        if( currentState.manipulationMode == LdbManipulationModes.LINKING_TEXTBOXES
            && currentState.manipulationTargetId == textboxId)
          linkBtnColor = 'red'

        newState = {
            manipulationMode:      currentState.manipulationMode,
            manipulationTargetId:  currentState.manipulationTargetId,
            hoverMode:             LdbHoverModes.NONE,
            hoverId:               '-1',        
            textboxes:             setTextboxColors( currentState.textboxes, textboxId, 'gray', linkBtnColor, 'gray','gray'),
            links:                 currentState.links,
            textboxDragData:       currentState.textboxDragData,
            textboxResizeData:     currentState.textboxResizeData  
        };
        return newState;


    case 'START_DRAGGING_TEXTBOX':

      newState = {
        manipulationMode:     LdbManipulationModes.DRAGGING_TEXTBOX,
        manipulationTargetId: action.data.id,
        hoverMode:            currentState.hoverMode,
        hoverId:              currentState.hoverId,
        textboxes:            currentState.textboxes,
        links:                currentState.links,
        textboxDragData:      { mouseDownDragbarX: action.data.mouseDownDragbarX,
                                mouseDownDragbarY: action.data.mouseDownDragbarY,
                                mouseDownBigDivX:  action.data.mouseDownBigDivX,
                                mouseDownBigDivY:  action.data.mouseDownBigDivY },
        textboxResizeData:    null  
      };
      return newState;


    case 'HOVERING_OVER_LINK_BTN':

      textboxId = action.data.id;  

      linkBtnColor = 'black'
      if( currentState.manipulationMode == LdbManipulationModes.LINKING_TEXTBOXES
          && currentState.manipulationTargetId == textboxId)
        linkBtnColor = 'red'

      newState = {
        manipulationMode:     currentState.manipulationMode,
        manipulationTargetId: currentState.manipulationTargetId,
        hoverMode:            LdbHoverModes.HOVERING_OVER_LINK_BTN,
        hoverId:              action.data.id,
        textboxes:            setTextboxColors( currentState.textboxes, textboxId, 'gray', linkBtnColor, 'gray','gray'),
        links:                currentState.links,
        textboxDragData:      currentState.textboxDragData,
        textboxResizeData:    currentState.textboxResizeData  
      };
      return newState;      


    case 'UNHOVERED_OVER_LINK_BTN':

      textboxId = action.data.id; 

      linkBtnColor = 'gray'
      if( currentState.manipulationMode == LdbManipulationModes.LINKING_TEXTBOXES)
        linkBtnColor = 'red'

      newState = {
        manipulationMode:     currentState.manipulationMode,
        manipulationTargetId: currentState.manipulationTargetId,
        hoverMode:            LdbHoverModes.NONE,
        hoverId:              '-1',
        textboxes:            setTextboxColors( currentState.textboxes, textboxId, 'gray', linkBtnColor, 'gray','gray'),
        links:                currentState.links,
        textboxDragData:      currentState.textboxDragData,
        textboxResizeData:    currentState.textboxResizeData 
      };
      return newState;  


    case 'HOVERING_OVER_CLOSE_BTN':

      textboxId = action.data.id; 

      linkBtnColor = 'gray'
      if( currentState.manipulationMode == LdbManipulationModes.LINKING_TEXTBOXES
          && currentState.manipulationTargetId == textboxId)
        linkBtnColor = 'red'

      newState = {
        manipulationMode:     currentState.manipulationMode,
        manipulationTargetId: currentState.manipulationTargetId,
        hoverMode:            LdbHoverModes.HOVERING_OVER_CLOSE_BTN,
        hoverId:              action.data.id,
        textboxes:            setTextboxColors( currentState.textboxes, textboxId, 'gray', linkBtnColor, 'black','gray'),
        links:                currentState.links,
        textboxDragData:      currentState.textboxDragData,
        textboxResizeData:    currentState.textboxResizeData 
      };
      return newState;      


    case 'UNHOVERED_OVER_CLOSE_BTN':

      textboxId = action.data.id; 

      linkBtnColor = 'gray'
      if( currentState.manipulationMode == LdbManipulationModes.LINKING_TEXTBOXES
          && currentState.manipulationTargetId == textboxId)
        linkBtnColor = 'red'

      newState = {
        manipulationMode:     currentState.manipulationMode,
        manipulationTargetId: currentState.manipulationTargetId,
        hoverMode:            LdbHoverModes.NONE,
        hoverId:              '-1',
        textboxes:            setTextboxColors( currentState.textboxes, textboxId, 'gray', linkBtnColor ,'gray','gray'),
        links:                currentState.links,
        textboxDragData:      currentState.textboxDragData,
        textboxResizeData:    currentState.textboxResizeData 
      };
      return newState;  


    case 'HOVERING_OVER_RESIZER':

      textboxId = action.data.id;

      linkBtnColor = 'gray'
      if( currentState.manipulationMode == LdbManipulationModes.LINKING_TEXTBOXES
          && currentState.manipulationTargetId == textboxId)
        linkBtnColor = 'red'

      newState = {
        manipulationMode:     currentState.manipulationMode,
        manipulationTargetId: currentState.manipulationTargetId,
        hoverMode:            LdbHoverModes.HOVERING_OVER_RESIZER,
        hoverId:              action.data.id,
        textboxes:            setTextboxColors( currentState.textboxes, textboxId, 'gray', linkBtnColor, 'gray','blue'),
        links:                currentState.links,
        textboxDragData:      currentState.textboxDragData,
        textboxResizeData:    currentState.textboxResizeData 
      };
      return newState;      


    case 'UNHOVERED_OVER_RESIZER':

      textboxId = action.data.id;     

      linkBtnColor = 'gray'
      if( currentState.manipulationMode == LdbManipulationModes.LINKING_TEXTBOXES
          && currentState.manipulationTargetId == textboxId)
        linkBtnColor = 'red'

      newState = {
        manipulationMode:     currentState.manipulationMode,
        manipulationTargetId: currentState.manipulationTargetId,
        hoverMode:            LdbHoverModes.NONE,
        hoverId:              '-1',
        textboxes:            setTextboxColors( currentState.textboxes, textboxId, 'gray', linkBtnColor, 'gray','gray'),
        links:                currentState.links,
        textboxDragData:      currentState.textboxDragData,
        textboxResizeData:    currentState.textboxResizeData
      };
      return newState;  


    case 'LEFT_MOUSE_DOWN_ON_RESIZER':

      textboxId = action.data.id;
      var textbox = currentState.textboxes.get( textboxId)

      newState = ldbReducer( currentState, {type: 'POP_TEXTBOX_TO_TOP',
                                            data: { id: action.data.id }})

      newState.textboxes = setTextboxColors( newState.textboxes, textboxId, 'gray','gray','gray','blue')

      newState = {
        manipulationMode:     LdbManipulationModes.RESIZING_TEXTBOX,
        manipulationTargetId: textboxId,
        hoverMode:            LdbHoverModes.NONE,
        hoverId:              '-1',
        textboxes:            newState.textboxes,
        links:                newState.links,
        textboxDragData:      null,
        textboxResizeData:    { mouseDownWidth:    textbox.width,
                                mouseDownHeight:   textbox.height,
                                mouseDownBigDivX:  action.data.mouseDownBigDivX,
                                mouseDownBigDivY:  action.data.mouseDownBigDivY },
      };
      return newState;


   case 'MOUSE_MOVED':

     if( currentState.manipulationMode == LdbManipulationModes.DRAGGING_TEXTBOX) {
        if( currentState.textboxDragData != null) {
          textboxId = currentState.manipulationTargetId;

          var dxSinceMouseDown = action.data.mouseBigDivX - currentState.textboxDragData.mouseDownBigDivX;
          var dySinceMouseDown = action.data.mouseBigDivY - currentState.textboxDragData.mouseDownBigDivY;          

          var newTextboxX =   currentState.textboxDragData.mouseDownBigDivX
                            - currentState.textboxDragData.mouseDownDragbarX
                            + dxSinceMouseDown

          var newTextboxY =   currentState.textboxDragData.mouseDownBigDivY
                            - currentState.textboxDragData.mouseDownDragbarY
                            + dySinceMouseDown

          return ldbReducer( currentState, {type:'SET_TEXTBOX_POSITION',
                                            data:{id: textboxId, x:newTextboxX, y:newTextboxY}})
        }
     }
     else if( currentState.manipulationMode == LdbManipulationModes.RESIZING_TEXTBOX) {
        if( currentState.textboxResizeData != null) {
          textboxId = currentState.manipulationTargetId
          var dx = action.data.mouseBigDivX - currentState.textboxResizeData.mouseDownBigDivX
          var dy = action.data.mouseBigDivY - currentState.textboxResizeData.mouseDownBigDivY
          var newWidth = currentState.textboxResizeData.mouseDownWidth + dx
          var newHeight = currentState.textboxResizeData.mouseDownHeight + dy

          return ldbReducer( currentState, {type:'SET_TEXTBOX_SIZE', data:{id: textboxId, width: newWidth, height: newHeight}})
        }
     }

     return currentState;


    case 'RESET_MANIPULATION_MODE':

      newTextboxes = currentState.textboxes

      if( currentState.manipulationMode == LdbManipulationModes.LINKING_TEXTBOXES) {
            var redId = currentState.manipulationTargetId;
            newTextboxes = setTextboxColors( currentState.textboxes, redId, 'gray',
                                              'gray','gray','gray', false)    
      }

      newState = {
        manipulationMode:       LdbManipulationModes.NONE,
        manipulationTargetId:  '-1',
        hoverMode:              currentState.hoverMode,
        hoverId:                currentState.hoverId, 
        textboxes:               newTextboxes,
        links:                   currentState.links,
        textboxDragData:         null,
        textboxResizeData:       null
      };


      // TODO - push newState onto undo/redo stack, when ready
      if( currentState.manipulationMode == LdbManipulationModes.DRAGGING_TEXTBOX) {
        console.log('WAS DRAGGING, TIME TO PUSH A NEW LOCATION')
      }
      else if( currentState.manipulationMode == LdbManipulationModes.RESIZING_TEXTBOX) {
        console.log('WAS RESIZING, TIME TO PUSH A NEW SIZE')
      }


      return newState;   


   case 'LEFT_MOUSE_DOWN_ON_DRAGBAR':

     textboxId = action.data.id

     if( currentState.manipulationMode == LdbManipulationModes.LINKING_TEXTBOXES &&
         textboxId != currentState.manipulationTargetId) {

           const startId = currentState.manipulationTargetId
           const endId   = textboxId
           if( canLink(currentState, startId, endId)) {
             newState     = ldbReducer( currentState, {type: 'ADD_LINK', 
                                  data: {startId: startId, endId: endId}})
             
             newTextboxes = setTextboxColors( newState.textboxes, startId, 'gray',
                                              'gray','gray','gray', false)

             newTextboxes = setTextboxColors( newTextboxes, endId, 'blue',
                                              'gray','gray','gray', false)
             newState = {
                manipulationMode:       newState.manipulationMode,
                manipulationTargetId:   newState.manipulationTargetId,
                hoverMode:              newState.hoverMode,
                hoverId:                newState.hoverId,
                textboxes:               newTextboxes,
                links:                   newState.links,
                textboxDragData:         newState.textboxDragData,
                textboxResizeData:       newState.textboxResizeData
             };
             return newState;
           }
     }

     // start dragging the textbox

     newState = ldbReducer( currentState, {type: 'POP_TEXTBOX_TO_TOP', data: { id: textboxId }})
     
     newState = ldbReducer( newState, { type: 'START_DRAGGING_TEXTBOX',
                                        data: {
                                          id: textboxId,
                                          mouseDownDragbarX: action.data.mouseDownDragbarX,
                                          mouseDownDragbarY: action.data.mouseDownDragbarY,
                                          mouseDownBigDivX:  action.data.mouseDownBigDivX,
                                          mouseDownBigDivY:  action.data.mouseDownBigDivY 
                                        }
                                      }
                          )

     newState.textboxes = setTextboxColors( newState.textboxes, textboxId, 'blue','gray','gray','gray')
     
     return newState;


    case 'LEFT_CLICK_LINK_BTN': {

      newState = currentState

      if( newState.manipulationMode == LdbManipulationModes.LINKING_TEXTBOXES) {
          redId = newState.manipulationTargetId
          newState.textboxes = setTextboxColors( newState.textboxes, redId, 'gray',
                                              'gray','gray','gray', false)        
      }

      textboxId = action.data.id
      newState.textboxes = setTextboxColors( newState.textboxes, textboxId,
                                             'gray', 'red', 'gray', 'gray')

      newState = {
        manipulationMode:      LdbManipulationModes.LINKING_TEXTBOXES,
        manipulationTargetId:  textboxId,
        hoverMode:             newState.hoverMode,
        hoverId:               newState.hoverId,
        textboxes:             newState.textboxes,
        links:                 newState.links,
        textboxDragData:       null,
        textboxResizeData:     null        
      };

      return newState;
    }


    case 'START_LINKING_TEXTBOX': {

      newState = {
        manipulationMode:     LdbManipulationModes.LINKING_TEXTBOXES,
        manipulationTargetId: action.data.id,
        hoverMode:             currentState.hoverMode,
        hoverId:               currentState.hoverId,
        textboxes:            currentState.textboxes,
        links:                currentState.links,
        textboxDragData:      null,
        textboxResizeData:    null        
      };
      return newState;
    }


    case 'POP_TEXTBOX_TO_TOP': {
      var textboxIdToPop = action.data.id;
      const textboxToPop = currentState.textboxes.get( textboxIdToPop);
      newTextboxes = currentState.textboxes.delete(textboxIdToPop);
      newTextboxes = newTextboxes.set( textboxIdToPop, textboxToPop);

      newState = {
        manipulationMode:     currentState.manipulationMode,
        manipulationTargetId: currentState.manipulationTargetId,
        hoverMode:            currentState.hoverMode,
        hoverId:              currentState.hoverId,
        textboxes:            newTextboxes,
        links:                currentState.links,
        textboxDragData:      currentState.textboxDragData,
        textboxResizeData:    currentState.textboxResizeData
      };
      return newState;
    }


    case 'SET_TEXTBOX_POSITION': {

      var textboxIdToMove = action.data.id
      var textboxToMove = currentState.textboxes.get( textboxIdToMove)

      textboxToMove.x = action.data.x
      textboxToMove.y = action.data.y

      if( textboxToMove.x < 0)
        textboxToMove.x = 0;

      if( textboxToMove.y < 0)
        textboxToMove.y = 0;

      if( textboxToMove.x > LdbConstants.MAX_CANVAS_WIDTH-textboxToMove.width)
        textboxToMove.x = LdbConstants.MAX_CANVAS_WIDTH-textboxToMove.width

      if( textboxToMove.y > LdbConstants.MAX_CANVAS_HEIGHT-textboxToMove.height)
        textboxToMove.y = LdbConstants.MAX_CANVAS_HEIGHT-textboxToMove.height

      newTextboxes = currentState.textboxes.delete(textboxIdToMove)
      newTextboxes = newTextboxes.set( textboxIdToMove, textboxToMove)

      newState = {
        manipulationMode:     currentState.manipulationMode,
        manipulationTargetId: currentState.manipulationTargetId,
        hoverMode:            currentState.hoverMode,
        hoverId:              currentState.hoverId,
        textboxes:            newTextboxes,
        links:                currentState.links,
        textboxDragData:      currentState.textboxDragData,
        textboxResizeData:    currentState.textboxResizeData
      };
      return newState;      
    }


    case 'SET_TEXTBOX_SIZE': {

      var textboxIdToResize = action.data.id;
      var textboxToResize = currentState.textboxes.get( textboxIdToResize);

      textboxToResize.width  = Math.max(LdbConstants.MIN_TEXTBOX_WIDTH,  action.data.width)
      textboxToResize.height = Math.max(LdbConstants.MIN_TEXTBOX_HEIGHT, action.data.height)

      if( textboxToResize.x > LdbConstants.MAX_CANVAS_WIDTH-textboxToResize.width)
        textboxToResize.x = LdbConstants.MAX_CANVAS_WIDTH-textboxToResize.width

      if( textboxToResize.y > LdbConstants.MAX_CANVAS_HEIGHT-textboxToResize.height)
        textboxToResize.y = LdbConstants.MAX_CANVAS_HEIGHT-textboxToResize.height

      newTextboxes = currentState.textboxes.delete( textboxIdToResize)
      newTextboxes = newTextboxes.set( textboxIdToResize, textboxToResize)

      newState = {
        manipulationMode:     currentState.manipulationMode,
        manipulationTargetId: currentState.manipulationTargetId,
        hoverMode:            currentState.hoverMode,
        hoverId:              currentState.hoverId,
        textboxes:            newTextboxes,
        links:                currentState.links,
        textboxDragData:      currentState.textboxDragData,
        textboxResizeData:    currentState.textboxResizeData
      };
      return newState;
    }


    case 'ADD_LINK':

      newId = getFreeNumKeyAsString( currentState.links);
      var newLink = {
        id:      newId,
        startId: action.data.startId,
        endId:   action.data.endId
      };

      var newLinks = currentState.links.set(newId, newLink);

      newState = {
          manipulationMode: LdbManipulationModes.NONE, 
          manipulationTargetId: '-1',
          hoverMode: LdbHoverModes.NONE,
          hoverId: '-1',         
          textboxes: currentState.textboxes,
          links:     newLinks,
          textboxDragData: null,
          textboxResizeData:    null
      };
      return newState;


    case 'HOVERING_OVER_LINK':

        var linkId = action.data.id;

        newState = {
            manipulationMode: currentState.manipulationMode,
            manipulationTargetId: currentState.manipulationTargetId,
            hoverMode: LdbHoverModes.HOVERING_OVER_LINK,
            hoverId: linkId,         
            textboxes: currentState.textboxes,
            links:     currentState.links,
            textboxDragData: currentState.textboxDragData,
            textboxResizeData:    currentState.textboxResizeData        
        }
        return newState;


    case 'UNHOVERED_OVER_LINK':

        linkId = action.data.id;

        var newManipMode = currentState.manipulationMode
        var newManipId   = currentState.manipulationTargetId
        if( currentState.manipulationMode == LdbManipulationModes.LINK_SELECTED) {
          newManipMode = LdbManipulationModes.NONE
          newManipId   = '-1'
        }

        newState = {
            manipulationMode: newManipMode,
            manipulationTargetId: newManipId,
            hoverMode: LdbHoverModes.NONE,
            hoverId: '-1',         
            textboxes: currentState.textboxes,
            links:     currentState.links,
            textboxDragData: currentState.textboxDragData,
            textboxResizeData:    currentState.textboxResizeData
        };
        return newState;


    case 'LINK_LEFT_CLICKED':

        linkId = action.data.id;

        if(    currentState.manipulationMode == LdbManipulationModes.LINK_SELECTED
            && linkId == currentState.manipulationTargetId) {

            // same as DELETE_LINK

            newLinks = currentState.links.remove(linkId);
            newState = {
                manipulationMode: LdbManipulationModes.NONE, 
                manipulationTargetId: '-1',
                hoverMode: LdbHoverModes.NONE,
                hoverId: '-1',          
                textboxes: currentState.textboxes,
                links:     newLinks,
                textboxDragData: null,
                textboxResizeData:    null
            };
            return newState;   
        }
        else { // same as SELECT_LINK

          newState = {
              manipulationMode: LdbManipulationModes.LINK_SELECTED,
              manipulationTargetId: linkId,
              hoverMode: LdbHoverModes.HOVERING_OVER_LINK,
              hoverId: linkId,         
              textboxes: currentState.textboxes,
              links:     currentState.links,
              textboxDragData: null,
              textboxResizeData:    null
          };

          return newState;
        }


    case 'SET_TEXTBOX_RAW_CONTENT_JSON':

        textboxId          = action.data.id
        var rawContentJson = action.data.rawContentJson
        newTextboxes = setTextboxRawContentJson( currentState.textboxes, textboxId, rawContentJson)
        newState = {
            manipulationMode:      currentState.manipulationMode,
            manipulationTargetId:  currentState.manipulationTargetId,
            hoverMode:             currentState.hoverMode,
            hoverId:               currentState.hoverId,        
            textboxes:             newTextboxes,
            links:                 currentState.links,
            textboxDragData:       currentState.textboxDragData,
            textboxResizeData:     currentState.textboxResizeData
        }     
        return newState

    default: {
      return currentState;
    }
  }
}