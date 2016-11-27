GAME.Event = function (type) {
    this.id = THREE.Math.generateUUID();
}

GAME.Event.prototype = {

    constructor: GAME.Event,
}

GAME.Event.RainFire = function () {
    var centerPosition = GAME.pawn.model.position.clone();
    var pawnForward = new THREE.Vector3();
    pawnForward.set(
        -GAME.pawn.model.matrix.elements[8],
        -GAME.pawn.model.matrix.elements[9],
        -GAME.pawn.model.matrix.elements[10]
    );
    pawnForward.multiplyScalar(500 * GAME.pawn.controller.speed);
    centerPosition.add(pawnForward);
    var minX = centerPosition.x - 250;
    var maxX = centerPosition.x + 250;
    var minZ = centerPosition.z - 250;
    var maxZ = centerPosition.z + 250;

    var hitOrigin = new THREE.Vector3();
    hitOrigin.copy(GAME.pawn.model.position);
    hitOrigin.y += 700;
    hitOrigin.x += Math.random() * 2000 - 1000;

    var material = new THREE.ShaderMaterial({
        uniforms: {
            tExplosion: {
                type: "t",
                value: GAME.Store['explosion']
            },
            time: { // float initialized to 0
                type: "f",
                value: 0.0
            }
        },

        vertexShader: vertexShaderFireball,
        fragmentShader: fragmentShaderFireball
    });
    material.castShadows = true;

    var hitPosition = new THREE.Vector3(Math.random() * (maxX - minX) + minX, centerPosition.y, Math.random() * (maxZ - minZ) + minZ);
    var fireGeometry = new THREE.IcosahedronGeometry(20, 4);
    var fireMesh = new THREE.Mesh(fireGeometry, material);
    fireMesh.position.copy(hitOrigin);
    var randomScale = Math.random() * 5 + 3;
    fireMesh.scale = new THREE.Vector3(1, 1, 1);
    fireMesh.scale.multiplyScalar(randomScale);

    var markerBase = new THREE.Mesh(new THREE.RingGeometry( 50, 60, 50, 32 ));
    markerBase.material.color = new THREE.Color(0xFF4500);
    markerBase.material.transparent = true;
    markerBase.material.opacity = 0.8;
    markerBase.material.castShadows = true;
    markerBase.rotation.x = -Math.PI * 0.5;

    var makerEnd = new THREE.Mesh(new THREE.ConeGeometry(25, 100, 32));
    makerEnd.position.set(hitPosition.x, hitPosition.y + 20, hitPosition.z);
    var dir = new THREE.Vector3();
    dir.copy(hitOrigin);
    dir.sub(hitPosition);
    dir.normalize();

    makerEnd.quaternion.setFromUnitVectors(dir, new THREE.Vector3(0, 1, 0));
    var xDir = new THREE.Vector3();
    xDir.crossVectors(makerEnd.up, dir);
    xDir.normalize();
    var q2 = new THREE.Quaternion();
    q2.setFromAxisAngle(xDir, Math.PI * 0.5);
    makerEnd.quaternion.multiply(q2);
    makerEnd.position.set(0, 0, 0);
    makerEnd.material = markerBase.material;

    var marker = new THREE.Object3D();
    marker.position.set(hitPosition.x, hitPosition.y + 20, hitPosition.z);
    marker.add(markerBase);
    marker.add(makerEnd);

    GAME.scene.add(fireMesh);
    GAME.scene.add(marker);
    GAME.pawn.addHarm(fireMesh);
    var start = Date.now();

    TweenLite.to(fireMesh.position, 3.5, {
        x: hitPosition.x, y: hitPosition.y, z: hitPosition.z, ease: Strong.easeInOut, onUpdate: function () {
            material.uniforms['time'].value = .0025 * (Date.now() - start);
        },
        onComplete: function () {
            GAME.scene.remove(marker);
            //GAME.scene.remove(makerEnd);
            TweenLite.to(fireMesh.scale, 1.0, {
                x: 0, y: 0, z: 0, onUpdate: function () {
                    material.uniforms['time'].value = .0025 * (Date.now() - start);
                },
                onComplete: function () {
                    GAME.scene.remove(fireMesh);
                    GAME.pawn.removeHarm(fireMesh);
                }
            });
        }
    });
}