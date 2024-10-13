
var obj = script.getSceneObject();
var body = obj.getComponent("Physics.BodyComponent");

body.onCollisionEnter.add(function (e) {
    obj.destroy();
});

function fly(dir, speed) {
    this.body.velocity = dir.normalize().uniformScale(travelSpeed);
}

script.api.fly = fly;