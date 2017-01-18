
export const LdbConstants = {
  MAX_CANVAS_WIDTH: 2000,
  MAX_CANVAS_HEIGHT: 2000,
  TEXTBOX_WIDTH: 180,
  TEXTBOX_HEIGHT: 100,
  MIN_TEXTBOX_WIDTH: 50,
  MIN_TEXTBOX_HEIGHT: 50
};

export const LdbManipulationModes = {
  NONE: 0,
  LINKING_TEXTBOXES: 1,
  DRAGGING_TEXTBOX: 2,
  RESIZING_TEXTBOX: 3,
  TYPING_INTO_TEXTBOX: 4,
  LINK_SELECTED: 5
};

export const LdbHoverModes = {
  NONE: 0,
  HOVERING_OVER_DRAGBAR: 1,
  HOVERING_OVER_LINK: 2,
  HOVERING_OVER_LINK_BTN: 3,
  HOVERING_OVER_CLOSE_BTN: 4,
  HOVERING_OVER_RESIZER: 5
};

export function canLink( state, startTextboxId, endTextboxId) {
    var linkKeys = state.links.keySeq().toArray();
    for(var i in linkKeys)
    {
      var linkId = linkKeys[i];
      var link = state.links.get(linkId);
      if( startTextboxId == endTextboxId)
        return false;
      if( link.startId == startTextboxId && link.endId == endTextboxId)
        return false;
      if( link.startId == endTextboxId && link.endId == startTextboxId)
        return false;
    }
    return true;
}

export function getTextboxCenter( textbox) {
  const x = parseInt( textbox.x + 0.5 * textbox.width);
  const y = parseInt( textbox.y + 0.5 * textbox.height);
  return {x:x , y:y};
}

export function ldbStateToString( state) {
  //console.log('ldbStateToString(): state=' + state);

  var bigStr = '{ manipulationMode: '     + state.manipulationMode +
               ', manipulationTargetId: ' + state.manipulationTargetId +
               ', hoverMode: '            + state.hoverMode +
               ', hoverId: '              + state.hoverId +           
               ', textboxes: ';

  var textboxIds = state.textboxes.keySeq().toArray();
  for(var i in textboxIds) {
    var textboxId = textboxIds[i];
    bigStr = bigStr.concat( textboxId + ': {x=' + state.textboxes.get(textboxId).x + ', y=' + state.textboxes.get(textboxId).y + '} ');
  }

  bigStr = bigStr.concat(', links: ');
  var linkIds = state.links.keySeq().toArray();
  for(var j in linkIds) {
    var linkId = linkIds[j];
    bigStr = bigStr.concat( linkId + ': {startId=' + state.links.get(linkId).startId + ', endId=' + state.links.get(linkId).endId + '} ');
  }
  bigStr = bigStr.concat('}');

  return bigStr;
}