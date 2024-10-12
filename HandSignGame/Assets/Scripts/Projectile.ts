@component
export class Projectile extends BaseScriptComponent {
    @input
    travelDir: vec3;

    private body = this.getSceneObject().getComponent("Physics.BodyComponent");

    onAwake() {
        this.body.velocity = this.travelDir;
    }
}
