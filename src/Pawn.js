GAME.Pawn = function () {
    this.model = undefined;
    this.material = undefined;
    this.controller = undefined;
    this.harms = [];
    this.loaded = false;
    this.init();
}

GAME.Pawn.prototype = {
    constructor: GAME.Pawn,

    init: function () {
        this.model = new THREE.BlendCharacter();
        this.model.load("assets/models/skinned/marine/marine_anims_core.json", this.onLoaded.bind(this));
    },

    onLoaded: function () {
        this.model.geometry.computeBoundingBox();

        this.model.rotation.y = Math.PI * -135 / 180;
        var diffuse = this.model.material.map;
        this.material = new THREE.MeshStandardMaterial({
            map: diffuse,
            envMap: GAME.Store['enviroment'].texture,
            roughnessMap: GAME.Store['roughness'],
            bumpMap: GAME.Store['roughness'],
            bumpScale: -0.05,
            color: 0xffffff,
            metalness: 1.0,
            roughness: 1.0,
            shading: THREE.SmoothShading
        });
        this.material.skinning = true;
        this.model.material = this.material;
        this.model.castShadow = true;

        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(50, 100, -100);
        spotLight.distance = 500;
        spotLight.angle = 1.;//Math.PI / 7;
        spotLight.penumbra = 0.8
        spotLight.castShadow = true;
        this.model.add(spotLight);

        GAME.scene.add(this.model);

        //// Set default weights
        this.model.applyWeight('idle', 1 / 3);
        this.model.applyWeight('walk', 1 / 3);
        this.model.applyWeight('run', 1 / 3);

        this.model.stopAll();
        this.model.unPauseAll();
        this.model.play('idle', 1.);

        this.controller = new THREE.CharacterController(this.model);
        this.loaded = true;
    },

    addHarm: function(harm){
        this.harms.push(harm);
    },

    removeHarm: function(harm){
        this.harms.splice(this.harms.indexOf(harm), 1);
    },

    testHarms: function () {
        var box = this.model.geometry.boundingBox.clone();
        box.applyMatrix4(this.model.matrix);
        for (var i = 0 ; i < this.harms.length; i++) {
            var sphere = new THREE.Sphere(this.harms[i].position, this.harms[i].scale.x * 20);
            if (box.intersectsSphere(sphere)) {
                console.log('dead');
                GAME.distanceRan.set(0);
            }
        }
    },

    update: function (delta) {
        if (!this.loaded)
            return;

        var scale = 1;
        var stepSize = delta * scale;
        // modify blend weights
        //this.model.update(stepSize);
        this.controller.update(delta);
        this.testHarms();
        GAME.distanceRan.increment(delta * this.controller.speed);
        //console.log('Harms -> ', this.harms.length);
    }
}