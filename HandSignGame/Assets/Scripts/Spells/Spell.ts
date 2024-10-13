@component
export abstract class Spell extends BaseScriptComponent {
    @input
    cam: SceneObject;

    @input
    gestures: string[];

    onAwake() {}

    abstract fire(centerPoint: vec3);

    matchGestures(gestures: string[]): boolean {
        if (gestures.length != this.gestures.length) {
            return false;
        }

        for (var i = 0; i < this.gestures.length; i++) {
            if (gestures[i] != this.gestures[i]) {
                return false;
            }
        }

        return true;
    }

    comboPossible(gestures: string[]): boolean {
        if (gestures.length > this.gestures.length) {
            return false;
        }

        let matches = 0;

        for (var i = 0; i < gestures.length; i++) {
            if (gestures[i] != this.gestures[i]) {
                break;
            }
            else {
                matches++;
            }
        }

        return matches == gestures.length;
    }
}
