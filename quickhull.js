

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function xsort(p1, p2) {
    var dx = p1.x - p2.x;
    if (dx === 0) return p1.y - p2.y;
    return dx;
}

function cross(p1, p2, p) {
    return (p.y - p1.y) * (p2.x - p1.x) - (p2.y - p1.y) * (p.x - p1.x);
}

function findSide(p1, p2, p) {
    var sideval = cross(p1, p2, p);
    if (sideval > 0) return 1;
    else if (sideval < 0) return -1;
    return sideval;
}

function lineDist(p1, p2, p) {
    let v = {x: p2.x - p1.x, y: p2.y - p1.y};
    return Math.abs((p2.y - p1.y) * p.x - (p2.x - p1.x) * p.y + p2.x * p1.y - p2.y * p1.x) / Math.sqrt(v.x*v.x + v.y*v.y);
}

function quickHull(points) {
    if (points.length < 3) throw Error("Need at least 3 points for quickhull!");
    // sort points by x coordinates
    points.sort(xsort);
    // now we got points to use
    var p1 = points[0];
    var p2 = points[points.length-1];
    // create two collections of points, those on side -1, those on +1
    var posSide = [];
    var negSide = [];
    for (var i = 1; i < points.length-1; i++) {
        var val = findSide(p1, p2, points[i]);
        if (val > 0) posSide.push(points[i]);
        else if (val < 0) negSide.push(points[i]);
        // don't worry about 0 val points
    }
    // we gotta construct teh hull recursively, we know p1 and p2 on hull
    // we know that p1 : recurse(p1,p2, posSide) : p2 : (reverse (recurse(p1, p2, negSide))) is teh hull
    var topHull = recurseHull(posSide, p1, p2);
    var bottomHull = recurseHull(negSide, p2, p1);
    var hull = topHull.concat(bottomHull);
    return hull;
}

function recurseHull(points, p1, p2, side) {
    if (points.length == 0) return [p1];
    var maxDist = 0;
    var index = 0;
    for (var i = 0; i < points.length; i++) {
        var dist = lineDist(p1, p2, points[i]);
        if (dist > maxDist) {
            index = i;
            maxDist = dist;
        }
    }
    var midHullPoint = points[index];
    var lpoints = [];
    var rpoints = [];
    for (var i = 0; i < points.length; i++) {
        var lside = findSide(p1, midHullPoint, points[i]);
        if (lside === 1) lpoints.push(points[i]);
        var rside = findSide(midHullPoint, p2, points[i]);
        if (rside === 1) rpoints.push(points[i]);
    }
    var lhull = recurseHull(lpoints, p1, midHullPoint);
    var rhull = recurseHull(rpoints, midHullPoint, p2);
    var hull = lhull.concat(rhull);
    return hull;
}