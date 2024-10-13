import { Spell } from "Scripts/Spells/Spell";
import { Projectile } from "Scripts/Projectile";

@component
export class FireballSpell extends Spell {
    @input
    fireball: ObjectPrefab;

    fire(centerPoint: vec3) {
        let fbInstance = this.fireball.instantiate(this.getSceneObject());
        fbInstance.getTransform().setWorldPosition(centerPoint);
        fbInstance.getComponent(Projectile.getTypeName()).fly(this.cam.getTransform().back, 250);
    }
}
