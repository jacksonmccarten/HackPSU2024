import { Spell } from "Scripts/Spells/Spell";
import { Projectile } from "Scripts/Projectile";

@component
export class ProjectileSpell extends Spell {
    @input
    fireball: ObjectPrefab;

    @input
    projectileSpeed: number;

    fire(centerPoint: vec3) {
        let fbInstance = this.fireball.instantiate(this.getSceneObject());
        fbInstance.getTransform().setWorldPosition(centerPoint);
        fbInstance.getComponent(Projectile.getTypeName()).fly(this.cam.getTransform().back, this.projectileSpeed);
    }
}
