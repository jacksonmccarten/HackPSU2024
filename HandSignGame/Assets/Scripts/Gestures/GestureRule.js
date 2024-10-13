// @input string jointStringA
// @input string jointStringB
// @input float minDistance
// @input float maxDistance

var jointA, jointB;

var getHand, getJointDistance, bothHandsTracking;

initialize();

function Joint(jointString) {
    var splitString = jointString.split(';', 2);
    
    this.hand = splitString[0];
    this.joint = splitString[1];
}

function initialize() {
    jointA = new Joint(script.jointStringA);
    jointB = new Joint(script.jointStringB);
    
    getHand = global.handTracking().api.getHand;
    getJointDistance = global.handTracking().api.getJointDistance;
    bothHandsTracking = global.handTracking().api.bothHandsTracking;
}


function isWithinRange() {
    if (!bothHandsTracking()) {
        return false;
    }

    var dist = getJointDistance(getHand(jointA.hand), jointA.joint, getHand(jointB.hand), jointB.joint);
    
    return dist >= script.minDistance && dist <= script.maxDistance;
}

script.api.isWithinRange = isWithinRange;