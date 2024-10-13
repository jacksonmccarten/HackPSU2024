import { SIK } from "SpectaclesInteractionKit/SIK"
import { Projectile } from "Scripts/Projectile"


@component
export class TestScript extends BaseScriptComponent {

    @input
    fireball: ObjectPrefab;

    @input
    skeleton: ObjectPrefab;

    private rightHand = SIK.HandInputData.getHand("right");

    onAwake() {
        this.rightHand.onPinchDown(() => {
            print("Something");

            let fbInstance = this.fireball.instantiate(this.getSceneObject());
            fbInstance.getTransform().setWorldPosition(this.rightHand.indexTip.position);
            fbInstance.getComponent(Projectile.getTypeName()).travelDir = this.rightHand.wrist.forward;
        });
    }
}
