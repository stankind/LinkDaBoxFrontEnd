import { getLineBoxIntersection } from '../misc/StansUtils'
//import { stringifyIgnoreCyclic } from '../misc/StansUtils'

export function getWhereArrowTouchesTextbox( startTextbox, endTextbox)
{
  if( startTextbox == null)
    console.log('getWhereArrowTouchesTextbox(): startTextbox is null!');
  if( endTextbox == null)
    console.log('getWhereArrowTouchesTextbox(): endTextbox is null!');

  var startCenterX = startTextbox.x + startTextbox.width/2;
  var startCenterY = startTextbox.y + startTextbox.height/2;

  //console.log('getWhereArrowTouchesTextbox(): endTextbox.x=' + endTextbox.x
  //                 + '  endTextbox.width=' + endTextbox.width);

  var endCenterX   = endTextbox.x + endTextbox.width/2;
  var endCenterY   = endTextbox.y + endTextbox.height/2;               

  //console.log('getWhereArrowTouchesTextbox(): endTextbox = ' + stringifyIgnoreCyclic(endTextbox)
  //             + '\n\nstartCenterX=' + startCenterX + ' endCenterX=' + endCenterX);

  var halfEndWidth  = parseInt( endTextbox.width  / 2);
  var halfEndHeight = parseInt( endTextbox.height / 2);

  var endLLX = endCenterX - halfEndWidth;
  var endLLY = endCenterY + halfEndHeight;

  var endULX = endLLX;
  var endULY = endCenterY - halfEndHeight;

  var endURX = endCenterX + halfEndWidth;
  var endURY = endULY;

  var endLRX = endURX;
  var endLRY = endLLY;

  var line = { 'x1' : startCenterX, 'y1' : startCenterY, 'x2' : endCenterX, 'y2' : endCenterY };
  var box  = { 'cx': endCenterX, 'cy': endCenterY, 'llx': endLLX, 'lly': endLLY, 'ulx': endULX, 'uly': endULY, 'urx': endURX, 'ury': endURY, 'lrx': endLRX, 'lry': endLRY };

  return getLineBoxIntersection( line, box);
}