@component
export class Skeleton extends BaseScriptComponent {

    @input
    boneHolder: SceneObject;

    private body: BodyComponent;

    private defaultTransforms: Transform[];

    onAwake() {
        this.body = this.getSceneObject().getComponent("Physics.BodyComponent");
        this.body.onCollisionEnter.add(this.onCollision);

        for (var i = 0; i < this.boneHolder.getChildrenCount(); i++) {
            var newTransform = Object.create(this.boneHolder.children[i].getTransform());
            this.defaultTransforms.push(newTransform);
        }
    }

    onCollision(e: CollisionEnterEventArgs) {

    }

    break() {
        
    }

    revive() {
        for (var i = 0; i < this.boneHolder.getChildrenCount(); i++) {
            this.boneHolder.children[i].getComponent("Physics.BodyComponent")

            var newTransform = Object.create(this.boneHolder.children[i].getTransform());
            this.defaultTransforms.push(newTransform);
        }
    }
}
