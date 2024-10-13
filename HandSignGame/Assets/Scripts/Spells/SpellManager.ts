import { Spell } from "./Spell";

@component
export class SpellManager extends BaseScriptComponent {
    @input("Component.ScriptComponent")
    private handTracker: any;

    @input("Component.ScriptComponent[]")
    private spells: Spell[];

    private combo: string[] = [];

    private comboTimer: number;

    @input
    private comboTimeout: number = 3;

    onAwake() {
        this.combo = [];
    }

    onGestureMade(gestureName: string) {
        this.combo.push(gestureName);

        this.comboTimer = this.comboTimeout;

        this.checkForCombo();
    }

    checkForCombo() {
        var matchingSpell: Spell;

        let comboPossible = false;

        for (var i = 0; i < this.spells.length; i++) {
            if (this.spells[i].matchGestures(this.combo)) {
                matchingSpell = this.spells[i];
                break;
            }
            else if (this.spells[i].comboPossible(this.combo)) {
                comboPossible = true;
            }
        }

        if (matchingSpell) {
            matchingSpell.fire(this.handTracker.api.getCenterPoint());

            this.combo = [];
        }
        else if (!comboPossible) {
            this.combo = [];

            print("Combo Cleared!");
        }
    }
}
