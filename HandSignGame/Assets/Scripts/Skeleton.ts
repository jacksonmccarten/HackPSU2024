@component
export class Skeleton extends BaseScriptComponent {
    private defaultTransform: mat4;

    onAwake() {
        this.defaultTransform = mat4.fromRotation(this.getTransform().getLocalRotation()).mult(mat4.fromTranslation(this.getTransform().getLocalPosition())).mult(mat4.fromScale(this.getTransform().getLocalScale()));
    }

    reviveSkeleton() {
        this.getSceneObject().getTransform().setLocalTransform(this.defaultTransform);
    }
}
