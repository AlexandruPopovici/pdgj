var roarTimer = 0;

GAME.Enviroment = function () {

    this.planeMaterial = undefined;
    this.planeGeometry = undefined;
    this.planeMesh = undefined;

    this.islands = {};
    this.currentIsland = undefined;
    this.acc = 0;

    this.dragon = undefined;
    this.init();
}

GAME.Enviroment.prototype = {

    constructor: GAME.Enviroment,

    init: function () {
        this.planeMaterial = new THREE.MeshStandardMaterial({
            map: GAME.Store['terrainTex'],
            envMap: GAME.Store['enviroment'].texture,
            roughnessMap: GAME.Store['roughness'],
            bumpMap: GAME.Store['roughness'],
            bumpScale: 1.,
            color: 0xffffff,
            metalness: 0.0,
            roughness: 1.0,
            shading: THREE.SmoothShading
        });

        this.planeGeometry = new THREE.PlaneBufferGeometry(2000, 2000);
        this.planeMesh = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
        this.planeMesh.position.y = 0;
        this.planeMesh.rotation.x = -Math.PI * 0.5;
        this.planeMesh.receiveShadow = true;
        this.planeMesh.castShadow = true;

        this.islands['C'] = this.planeMesh;
        this.islands['N'] = this.planeMesh.clone();
        this.islands['NE'] = this.planeMesh.clone();
        this.islands['NW'] = this.planeMesh.clone();
        this.islands['S'] = this.planeMesh.clone();
        this.islands['SE'] = this.planeMesh.clone();
        this.islands['SW'] = this.planeMesh.clone();
        this.islands['E'] = this.planeMesh.clone();
        this.islands['W'] = this.planeMesh.clone();
        

        this.islands['N'].position.set(this.islands['C'].position.x, this.islands['C'].position.y, this.islands['C'].position.z - 2000);
        this.islands['NE'].position.set(this.islands['C'].position.x - 2000, this.islands['C'].position.y, this.islands['C'].position.z - 2000);
        this.islands['NW'].position.set(this.islands['C'].position.x + 2000, this.islands['C'].position.y, this.islands['C'].position.z - 2000);
        this.islands['E'].position.set(this.islands['C'].position.x - 2000, this.islands['C'].position.y, this.islands['C'].position.z);
        this.islands['W'].position.set(this.islands['C'].position.x + 2000, this.islands['C'].position.y, this.islands['C'].position.z);
        this.islands['S'].position.set(this.islands['C'].position.x, this.islands['C'].position.y, this.islands['C'].position.z + 2000);
        this.islands['SE'].position.set(this.islands['C'].position.x - 2000, this.islands['C'].position.y, this.islands['C'].position.z + 2000);
        this.islands['SW'].position.set(this.islands['C'].position.x + 2000, this.islands['C'].position.y, this.islands['C'].position.z + 2000);

        GAME.scene.add(this.islands['C']);
        GAME.scene.add(this.islands['N']);
        GAME.scene.add(this.islands['NE']);
        GAME.scene.add(this.islands['NW']);
        GAME.scene.add(this.islands['S']);
        GAME.scene.add(this.islands['SE']);
        GAME.scene.add(this.islands['SW']);
        GAME.scene.add(this.islands['E']);
        GAME.scene.add(this.islands['W']);
        this.currentIsland = this.islands['C'];

        this.dragon = new THREE.Object3D();
        var dragonMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, map: GAME.Store['dragon'], alphaMap: GAME.Store['dragon'] });
        dragonMaterial.transparent = true;
        dragonMaterial.blending = THREE.SubtractiveBlending;
        var dragonMesh = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000, 32), dragonMaterial);
        dragonMesh.position.y = 5.;
        dragonMesh.rotation.x = -Math.PI * 0.5;
        this.dragon.add(dragonMesh);
        GAME.scene.add(this.dragon);

        GAME.scene.add(new THREE.AmbientLight(0x222222));

        
        
    },

    update: function (delta) {
        if (!GAME.pawn.loaded)
            return;

        this.acc += delta;
        if (this.acc >= 1.0) {
            GAME.Event.RainFire();
            this.acc = 0;
        }
        
        roarTimer += delta;
        if (roarTimer >= 30) {
            GAME.audio.playRoar();
            roarTimer = 0;
        }

        this.checkIsland();
        this.dragon.position.copy(GAME.pawn.model.position);
        var pawnForward = new THREE.Vector3();
        pawnForward.set(
            -GAME.pawn.model.matrix.elements[8],
            -GAME.pawn.model.matrix.elements[9],
            -GAME.pawn.model.matrix.elements[10]
        );
        pawnForward.negate();
        pawnForward.multiplyScalar(Math.max(1000 * GAME.pawn.controller.speed, 500));
        this.dragon.position.add(pawnForward);
        this.dragon.lookAt(GAME.pawn.model.position);
        this.dragon.rotateY(Math.PI);
    },

    checkIsland: function () {

        var pawnPos = GAME.pawn.model.position.clone();
        var topLeftVertex = new THREE.Vector3();
        var bottomLeftVertex = new THREE.Vector3();
        var topRightVertex = new THREE.Vector3();
        var bottomRightVertex = new THREE.Vector3();

        for (var coord in this.islands) {
            if (this.islands.hasOwnProperty(coord)) {
                topLeftVertex.set(this.islands[coord].position.x - 1000, this.islands[coord].position.y, this.islands[coord].position.z + 1000);
                bottomLeftVertex.set(this.islands[coord].position.x - 1000, this.islands[coord].position.y, this.islands[coord].position.z - 1000);
                topRightVertex.set(this.islands[coord].position.x + 1000, this.islands[coord].position.y, this.islands[coord].position.z + 1000);
                bottomRightVertex.set(this.islands[coord].position.x + 1000, this.islands[coord].position.y, this.islands[coord].position.z - 1000);

                var box = new THREE.Box3();
                box.setFromPoints([topLeftVertex, topRightVertex, bottomLeftVertex, bottomRightVertex]);
                if (box.containsPoint(pawnPos)) {
                    if (coord != 'C') {
                        console.log('Reordering');
                        this.islands['C'].position.copy(this.islands[coord].position);
                        this.islands['N'].position.set(this.islands['C'].position.x, this.islands['C'].position.y, this.islands['C'].position.z - 2000);
                        this.islands['NE'].position.set(this.islands['C'].position.x - 2000, this.islands['C'].position.y, this.islands['C'].position.z - 2000);
                        this.islands['NW'].position.set(this.islands['C'].position.x + 2000, this.islands['C'].position.y, this.islands['C'].position.z - 2000);
                        this.islands['E'].position.set(this.islands['C'].position.x - 2000, this.islands['C'].position.y, this.islands['C'].position.z);
                        this.islands['W'].position.set(this.islands['C'].position.x + 2000, this.islands['C'].position.y, this.islands['C'].position.z);
                        this.islands['S'].position.set(this.islands['C'].position.x, this.islands['C'].position.y, this.islands['C'].position.z + 2000);
                        this.islands['SE'].position.set(this.islands['C'].position.x - 2000, this.islands['C'].position.y, this.islands['C'].position.z + 2000);
                        this.islands['SW'].position.set(this.islands['C'].position.x + 2000, this.islands['C'].position.y, this.islands['C'].position.z + 2000);
                    }
                }
            }
        }
    },
}