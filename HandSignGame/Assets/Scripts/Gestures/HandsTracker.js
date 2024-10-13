// @input Component.ObjectTracking3D leftHandTracking
// @input Component.ObjectTracking3D rightHandTracking
// @input bool showBones
// @input SceneObject boneIndicator {"showIf":"showBones"}

const JOINT_NAMES = ["wrist","thumb-0","thumb-1","thumb-2","thumb-3","index-0","index-1","index-2","index-3","mid-0","mid-1","mid-2","mid-3","ring-0","ring-1","ring-2","ring-3","pinky-0","pinky-1","pinky-2","pinky-3","wrist_to_thumb","wrist_to_index","wrist_to_mid","wrist_to_ring","wrist_to_pinky"];

const HAND = {
    LEFT: 0,
    RIGHT: 1
};

var left_joints = {};
var right_joints = {};

var bones = [];

var BONE_SCALE_MULT = 0.1;

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

function Bone(jointa, jointb) {
    if (!jointa.object || !jointb.object) {
        return;
    }
    
    this.startJoint = jointa;
    this.endJoint = jointb;
    this.direction = this.endJoint.position.sub(this.startJoint.position);

    this.object = null;

    if (script.showBones && script.boneIndicator) {
        this.object = script.getSceneObject().copyWholeHierarchy(script.boneIndicator);
        this.objectTransform = this.object.getTransform();
        this.orgRot = this.object.getTransform().getWorldRotation();
        this.object.enabled = false;
    }
}

Bone.prototype.update = function() {
    this.length = this.startJoint.position.distance(this.endJoint.position) * BONE_SCALE_MULT;
    this.direction = this.endJoint.position.sub(this.startJoint.position);

    if (this.objectTransform) {
        this.objectTransform.setLocalScale(new vec3(1, 1, 1 * this.length));
        this.objectTransform.setWorldPosition(this.startJoint.position);
        var ang = rotateTowards(this.startJoint.position, this.endJoint.position, vec3.forward());

        if (ang.x) {
            this.objectTransform.setWorldRotation(ang);
        }
    }
};

function initialize() {
    if (initialized) {
        return;
    }
    
    initializeJoints();
    initializeBones(left_joints);
    initializeBones(right_joints);

    initialized = true;
    
    script.createEvent("UpdateEvent").bind(onUpdate);
}

function initializeJoints() {
    for(var i = 0; i < JOINT_NAMES.length; i++) {
        left_joints[JOINT_NAMES[i]] = new Joint(HAND.LEFT, JOINT_NAMES[i]);
        right_joints[JOINT_NAMES[i]] = new Joint(HAND.RIGHT, JOINT_NAMES[i]);
    }
}

function initializeBones(joint_list) {
    for (var k in joint_list) {
        if (!joint_list[k].object) {
            return;
        }

        var connectedJName = null;
        if (joint_list[k].name == "wrist") {
            for (var j in joint_list) {
                if (joint_list[j].name.includes("wrist_to")) {
                    bones.push(new Bone(joint_list[k], joint_list[j]));
                }
            }
        } 
        else if (joint_list[k].name.includes("wrist_to")) {
            connectedJName = joint_list[k].name.replace("wrist_to_","") + "-0";
        } 
        else if (joint_list[k].name.includes("-") && !joint_list[k].name.includes("3")) {
            var jointNameSplit = joint_list[k].name.split("-");
            var idx = parseInt(jointNameSplit[1]) + 1;
            connectedJName = jointNameSplit[0] + "-" + idx.toString();
        }

        var connectedJ = getJoint(connectedJName);

        if (connectedJ) {
            bones.push(new Bone(joint_list[k], connectedJ));
        }
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

    for (var j = 0; j < bones.length; j++) {
        bones[j].update();
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

function getCenterPoint() {
    var vec3arr = [];

    for (var i = 0; i < JOINT_NAMES.length; i ++) {
        var leftJoint = getJoint(HAND.LEFT, JOINT_NAMES[i]);
        var rightJoint = getJoint(HAND.RIGHT, JOINT_NAMES[i]);

        if (leftJoint) {
            vec3arr.push(leftJoint.position);
        }

        if (rightJoint) {
            vec3arr.push(rightJoint.position);
        }
    }

    return getAverageVec3(vec3arr);
}

function bothHandsTracking() {
    return isLeftTracking() && isRightTracking();
}

function isLeftTracking() {
    return script.leftHandTracking.isTracking();
}

function isRightTracking() {
    return script.rightHandTracking.isTracking();
}

function getAverageVec3(vecs) {
    var result = new vec3(0,0,0);

    for (var i=0; i < vecs.length; i ++) {
        result = result.add(vecs[i]);
    }
    result = result.uniformScale(1 / vecs.length);
    return result;
}

function rotateTowards(org, target, direction) {
    var dir = org.sub(target);
    return quat.lookAt(dir, direction);
}

script.api.getJointDistance = getJointDistance;
script.api.getHand = getHand;
script.api.getCenterPoint = getCenterPoint;
script.api.bothHandsTracking = bothHandsTracking;

global.handTracking = function() {
    return script;
};