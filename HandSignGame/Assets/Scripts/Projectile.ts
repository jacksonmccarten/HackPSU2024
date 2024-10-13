@component
export class Projectile extends BaseScriptComponent {
    @input
    travelSpeed: number;

    @input
    travelDir: vec3;

    private body = this.getSceneObject().getComponent("Physics.BodyComponent");

    onUpdate() {
        this.body.velocity = this.travelDir.normalize().uniformScale(this.travelSpeed);
    }
}
