// @input Component.ObjectTracking3D leftHandTracking
// @input Component.ObjectTracking3D rightHandTracking

const JOINT_NAMES = ["wrist","thumb-0","thumb-1","thumb-2","thumb-3","index-0","index-1","index-2","index-3","mid-0","mid-1","mid-2","mid-3","ring-0","ring-1","ring-2","ring-3","pinky-0","pinky-1","pinky-2","pinky-3","wrist_to_thumb","wrist_to_index","wrist_to_mid","wrist_to_ring","wrist_to_pinky"];

const HAND = {
    LEFT: 0,
    RIGHT: 1
};

var left_joints = {};
var right_joints = {};

var initialized = false;

initialize();

function Joint(hand, jointName) {
    this.name = jointName;
    this.hand = hand;
    
    switch (hand) {
        case HAND.LEFT:
            this.object = script.leftHandTracking.createAttachmentPoint(jointName);
            break;
        case HAND.RIGHT:
            this.object = script.rightHandTracking.createAttachmentPoint(jointName);
            break;
    }
    
    if (this.object) {
        this.objectTransform = this.object.getTransform();
        this.position = this.objectTransform.getWorldPosition();
        this.rotation = this.objectTransform.getWorldRotation();
    }
}

Joint.prototype.update = function() {    
    this.position = this.objectTransform.getWorldPosition();
    this.rotation = this.objectTransform.getWorldRotation();
};

function initialize() {
    if (initialized) {
        return;
    }

    print("Initializing hand tracker");
    
    initializeJoints();
    initialized = true;
    
    script.createEvent("UpdateEvent").bind(onUpdate);
}

function initializeJoints() {
    for(var i = 0; i < JOINT_NAMES.length; i++) {
        left_joints[JOINT_NAMES[i]] = new Joint(HAND.LEFT, JOINT_NAMES[i]);
        right_joints[JOINT_NAMES[i]] = new Joint(HAND.RIGHT, JOINT_NAMES[i]);
    }
}

function onUpdate() {
    if (isLeftTracking()) {
        for (var i in left_joints) {
            left_joints[i].update();
        }
    }
    
    if (isRightTracking()) {
        for (var i in right_joints) {
            right_joints[i].update();
        }
    }
}

function getHand(handString) {
    if (handString == "left") {
        return HAND.LEFT;
    }
    else if (handString == "right") {
        return HAND.RIGHT;
    }
    
    print("ERROR! Invalid hand detected! '" + handString + "'' not recognized!");
    return null;
}

function getJoint(hand, jointName) {
    switch (hand) {
        case HAND.LEFT:
            return left_joints[jointName];
            break;
        case HAND.RIGHT:
            return right_joints[jointName];
            break;
    }
}

function getJointDistance(hand1, jointName1, hand2, jointName2) {
    return getJoint(hand1, jointName1).position.distance(getJoint(hand2, jointName2).position);
}

function isLeftTracking() {
    return script.leftHandTracking.isTracking();
}

function isRightTracking() {
    return script.rightHandTracking.isTracking();
}

script.api.getJointDistance = getJointDistance;
script.api.getHand = getHand;

global.handTracking = function() {
    return script;
};