import { Skeleton } from "Scripts/Skeleton";
import { Spell } from "Scripts/Spells/Spell";

@component
export class HealSpell extends Spell {
    @input
    skeleton: Skeleton

    fire(centerPoint: vec3) {
        this.skeleton.reviveSkeleton();
    }
}