//@input string gestureDetectedTrigger
//@input string gestureLostTrigger
//@input bool logMessage

var gestureRules = [];
var gestureMade = false;

var detectedTimer = 0;
var detectedGestureTriggered = false;

var lostTimer = 0;
var lostGestureTriggered = false;

var triggerTimerMax = 0.2;

initialize();

function initialize() {
    
    for (var i = 0; i < script.scriptContainer.getChildrenCount(); i++) {
        if (script.scriptContainer.getChild(i).getComponent("Component.ScriptComponent")) {
            gestureRules.push(script.scriptContainer.getChild(i).getComponent("Component.ScriptComponent"));
        }
    }

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
    
    if (script.logMessage) {
        print("Triggering Gesture " + script.getSceneObject() + " : " + triggerName);
    }
}

function checkIfAllWithinRange() {
    var isInRange = true;    
    for (var i=0; i < distanceScripts.length; i++) {
        if (!distanceScripts[i].api.isWithinThreshold()) {
            isInRange = false;
            break;
        }
    }
    
    return isInRange;
}