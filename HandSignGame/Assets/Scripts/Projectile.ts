@component
export class Projectile extends BaseScriptComponent {

    private shouldDestroy = false;

    private body = this.getSceneObject().getComponent("Physics.BodyComponent");

    onAwake() {
        this.body.onCollisionEnter.add(this.onCollision);
    }

    fly(travelDir: vec3, travelSpeed: number) {
        this.body.velocity = travelDir.normalize().uniformScale(travelSpeed);
    }

    onCollision(col: CollisionEnterEventArgs) {
        this.getSceneObject().getTransform().setWorldPosition(new vec3(9999, 9999, 9999));
    }
}
