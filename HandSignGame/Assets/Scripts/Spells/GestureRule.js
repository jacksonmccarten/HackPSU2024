// @input string jointStringA
// @input string jointStringB
// @input float minDistance
// @input float maxDistance

var jointA = null;
var jointB = null;

var getHand = global.handTracking.api.getHand;
var getJointDistance = global.handTracking.api.getJointDistance;

initialize();

function Joint(jointString) {
    var splitString = jointString.split(';', 2);
    
    this.hand = splitString[0];
    this.joint = splitString[1];
}

function initialize() {
    jointA = Joint(script.jointStringA);
    jointB = Joint(script.jointStringB);
}


function isWithinThreshold() {
    var dist = getJointDistance(getHand(jointA.hand), jointA.joint, getHand(jointB.hand), jointB.joint);
    
    print(dist);    
    
    return dist >= script.minDistance && dist <= script.maxDistance;
}

script.api.isWithinThreshold = isWithinThreshold;