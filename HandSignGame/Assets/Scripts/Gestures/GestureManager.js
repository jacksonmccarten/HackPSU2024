// @input Component.ScriptComponent spellManager
// @input string gestureName
 
// @ui {"widget":"separator"}
// @input string gestureDetectedTrigger
// @input string gestureLostTrigger

// @ui {"widget":"separator"}
// @input bool logMessage


var gestureRules = [];
var gestureMade = false;

var detectedTimer = 0;
var detectedGestureTriggered = false;

var lostTimer = 0;
var lostGestureTriggered = false;

var triggerTimerMax = 0.2;

var getCenterPoint;

initialize();

function initialize() {
    for (var i = 0; i < script.getSceneObject().getChildrenCount(); i++) {
        if (script.getSceneObject().getChild(i).getComponent("Component.ScriptComponent")) {
            gestureRules.push(script.getSceneObject().getChild(i).getComponent("Component.ScriptComponent"));
        }
    }

    getCenterPoint = global.handTracking().api.getCenterPoint;

    script.createEvent("UpdateEvent").bind(onUpdate);
}

function onUpdate() {   
    gestureMade = checkIfAllWithinRange();
    
    if (gestureMade) {
        lostTimer = 0;
        
        if (!detectedGestureTriggered) {
            if (detectedTimer < triggerTimerMax) {
                detectedTimer += getDeltaTime();
            } 
            else {
                triggerGesture(true);
                
                detectedTimer = 0;
                detectedGestureTriggered = true;
                lostGestureTriggered = false;
            }
        } 
    } 
    else {
        detectedTimer = 0;
        
        if (!lostGestureTriggered && detectedGestureTriggered) {
            if (lostTimer < triggerTimerMax) {
                lostTimer += getDeltaTime();
            } 
            else {
                triggerGesture(false);
                
                lostTimer = 0;
                lostGestureTriggered = true;
                detectedGestureTriggered = false;
            }
        }
    }
}

function triggerGesture(isStarting) {
    var triggerName = isStarting ? script.gestureDetectedTrigger : script.gestureLostTrigger;
    
    global.behaviorSystem.sendCustomTrigger(triggerName);

    if (isStarting) {
        script.spellManager.onGestureMade(script.gestureName);
    }

    if (script.logMessage) {
        print("Triggering Gesture " + script.getSceneObject() + " : " + triggerName);
    }
}

function checkIfAllWithinRange() {
    var isInRange = true;
    
    for (var i = 0; i < gestureRules.length; i++) {
        if (!gestureRules[i].api.isWithinRange()) {
            isInRange = false;
            break;
        }
    }
    
    return isInRange;
}