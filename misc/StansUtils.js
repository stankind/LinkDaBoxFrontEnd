export function getFreeNumKeyAsString( map) {

    // given an Immutable.Map, identify the lowest unused key that
    // is a string representation of a non-negative integer

    for(var i=0; i<32000; i++) {
        var istr = i.toString();
        if( map.get(istr) == null) {
            //console.log('getFreeNumKeyAsString(): returning istr=' + istr);
            return istr;
        }
    }
    return NaN;
}

function getDistance(point1, point2) // point1.x ... point2.y
{
  var dx = point2.x - point1.x;
  var dy = point2.y - point1.y;
  return Math.sqrt( dx*dx + dy*dy);
}

function getDirectionCwFromEastRad( start, end) // remember, y is downward, so the angle really is clockwise!
{
  var angleRad = null;

  if (getDistance(start,end) > 0)
  {
     var dx = end.x - start.x;
     var dy = end.y - start.y;
     angleRad = Math.atan2(dy, dx);
  }

  return angleRad;
}

export function getDirectionCwFromEastDeg( x1,y1,x2,y2)
{
  var start = {'x': x1, 'y': y1 };
  var end   = {'x': x2, 'y': y2 };
  var directionRad = getDirectionCwFromEastRad( start, end);
  var directionDeg = parseInt( 180.0/Math.PI * directionRad );
  return directionDeg;
}

function directionRadiansIsBetween( direction, directionMin, directionMax)
{
  direction    = makePositive(direction);
  directionMin = makePositive(directionMin);
  directionMax = makePositive(directionMax);

  if(direction < directionMin)
  {
    direction += 2.0 * Math.PI;
  }

  if(directionMax < directionMin)
  {
    directionMax += 2.0 * Math.PI;
  }

  return (directionMin <= direction && direction <= directionMax);
}

function makePositive( directionRad)
{
  if (directionRad < 0) directionRad += 2.0 * Math.PI;
  return directionRad;
}

function rotateDirectionCwRad( dirCwFrmEastRad, rotationAngleDeg)
{
  var rotationAngleRad = rotationAngleDeg * Math.PI / 180.0;
  var newDirectionRad = dirCwFrmEastRad + rotationAngleRad;
  return makePositive( newDirectionRad);
}

export function getLineBoxIntersection(line, box) // line.x1 ... line.y2     box.cx, box.cy, box.llx ... box.lry
{
  var arrowTipLocation = null;

  if(line == null)
    console.log('getLineBoxIntersection(): line = null!');
  else if(line.x1 == null)
    console.log('getLineBoxIntersection(): line.x1 = null!');
  if( box == null)
    console.log('getLineBoxIntersection(): box = null!');
  else if( box.llx == null)
    console.log('getLineBoxIntersection(): box.llx = null!');

  var start = { 'x': line.x1, 'y': line.y1 };
  var end   = { 'x': line.x2, 'y': line.y2 };

  //console.log('getLineBoxIntersection(): start.x=' + start.x + '    start.y=' + start.y + '    end.x=' + end.x + '    end.y=' + end.y);

  var linkDir = getDirectionCwFromEastRad(end, start); // go backwards from end point

  if (linkDir != null)
  {
                //console.log('getLineBoxIntersection(): linkDir=' + linkDir + ' radians');

                 var corner0 = { 'x': box.llx, 'y': box.lly };
                 var corner1 = { 'x': box.ulx, 'y': box.uly };
                 var corner2 = { 'x': box.urx, 'y': box.ury };
                 var corner3 = { 'x': box.lrx, 'y': box.lry };
                 var center  = { 'x': box.cx, 'y': box.cy };

                  var dir0 = getDirectionCwFromEastRad(center, corner0);
                  var dir1 = getDirectionCwFromEastRad(center, corner1);
                  var dir2 = getDirectionCwFromEastRad(center, corner2);
                  var dir3 = getDirectionCwFromEastRad(center, corner3);

                  var xTip = 0;
                  var yTip = 0;
                  var dx,dy, dirCwFromNorth;
                  if( directionRadiansIsBetween(linkDir, dir0, dir1))
                  {
                      xTip = corner0.x;

                      dx = xTip - end.x;
                      dy = dx * Math.tan(linkDir);
                      yTip = end.y + dy;
                  }
                  else if (directionRadiansIsBetween(linkDir, dir1, dir2))
                  {
                      yTip = corner1.y;

                      dy = end.y - yTip;
                      dirCwFromNorth = rotateDirectionCwRad(linkDir, 90.0);
                      dx = dy * Math.tan(dirCwFromNorth);
                      xTip = end.x + dx;
                  }
                  else if (directionRadiansIsBetween(linkDir, dir2, dir3))
                  {
                      xTip = corner2.x;

                      dx = xTip - end.x;
                      dy = dx * Math.tan(linkDir);
                      yTip = end.y + dy;
                  }
                  else if (directionRadiansIsBetween(linkDir, dir3, dir0))
                  {
                      yTip = corner3.y;

                      dy = yTip - end.y;
                      dirCwFromNorth = rotateDirectionCwRad(linkDir, 90.0);
                      dx = -dy * Math.tan(dirCwFromNorth);
                      xTip = end.x + dx;
                  }

                  arrowTipLocation = { 'x': xTip, 'y': yTip};
  }
  else console.log( 'getLineBoxIntersection(): linkDir = null!');

  arrowTipLocation.x = parseInt( arrowTipLocation.x );
  arrowTipLocation.y = parseInt( arrowTipLocation.y );

  return arrowTipLocation;
}

export function stringifyIgnoreCyclic(obj) {
  var seen = [];
  return JSON.stringify(obj, function(key, val) {
   if (val != null && typeof val == 'object') {
        if (seen.indexOf(val) >= 0) {
            return;
        }
        seen.push(val);
    }
    return val;
});
}