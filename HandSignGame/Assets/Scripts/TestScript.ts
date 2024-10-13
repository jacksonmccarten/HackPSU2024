import { SIK } from "SpectaclesInteractionKit/SIK"
import { Projectile } from "Scripts/Projectile"


@component
export class TestScript extends BaseScriptComponent {

    @input
    fireball: ObjectPrefab;

    private rightHand = SIK.HandInputData.getHand("right");
    
    onAwake() {
        this.rightHand.onPinchDown(() => {
            print("Something");

            print("Else");
        });
    }
}
