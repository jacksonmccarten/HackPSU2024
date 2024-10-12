import { SIK } from "SpectaclesInteractionKit/SIK"

@component
export class TestScript extends BaseScriptComponent {

    @input
    fireball: ObjectPrefab;

    private rightHand = SIK.HandInputData.getHand("right");
    
    onAwake() {
        this.rightHand.onPinchDown(() => {
            print(this.rightHand.indexTip.position.toString());
        });
    }
}
