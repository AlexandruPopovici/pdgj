var GAME = { rev: '1' };
var clock = new THREE.Clock();
var ccsText;
THREE.BlendCharacter.prototype.setSpeed = function (speed) {

};

GAME.Context = function (container) {

    this.container = container;
    this.stats = undefined;
    this.cameraControls = undefined;

    this.enviroment = undefined;
    this.pawn = undefined;

    ccsText = document.createElement('div');
    ccsText.style.position = 'absolute';
    ccsText.style.width = 100;
    ccsText.style.height = 100;
    ccsText.innerHTML = "hi there!";
    ccsText.style.top = 10 + 'px';
    ccsText.style.color = "white";
    ccsText.style['font-size'] = "200%";
    ccsText.style.left = container.clientWidth * 0.5 + 'px';
    document.body.appendChild(ccsText);
}

GAME.camera = undefined;
GAME.scene = undefined;
GAME.renderer = undefined;
GAME.pawn = undefined;
GAME.enviroment = undefined;
GAME.distanceRan = {
    _value: 0,

    set: function (value) {
        this._value = value;
        ccsText.innerHTML = Math.round(value).toString() + 'm';
    },
    get: function () {
        return _value;
    },
    increment: function (delta) {
        this._value += delta;
        ccsText.innerHTML = Math.round(this._value).toString() + 'm';
    }
};

GAME.Context.prototype = {

    constructor: GAME.Context,

    init: function () {
        GAME.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 4000);
        GAME.camera.position.set(0.0, 40, 40 * 3.5);

        GAME.scene = new THREE.Scene();

        GAME.renderer = new THREE.WebGLRenderer({ antialias: false });
        GAME.renderer.setClearColor(new THREE.Color(0xffffff));
        GAME.renderer.toneMapping = THREE.LinearToneMapping;
        GAME.renderer.setPixelRatio(window.devicePixelRatio);
        GAME.renderer.setSize(window.innerWidth, window.innerHeight);
        GAME.renderer.shadowMap.enabled = true;
        GAME.renderer.shadowMapSoft = true;

        GAME.renderer.shadowCameraNear = 3;
        GAME.renderer.shadowCameraFar = GAME.camera.far;
        GAME.renderer.shadowCameraFov = 50;

        GAME.renderer.shadowMapBias = 0.0039;
        GAME.renderer.shadowMapDarkness = 0.5;
        GAME.renderer.shadowMapWidth = 1024;
        GAME.renderer.shadowMapHeight = 1024;
        this.container.appendChild(GAME.renderer.domElement);

        //renderer.toneMapping = THREE.ReinhardToneMapping;
        GAME.renderer.gammaInput = true;
        GAME.renderer.gammaOutput = true;

        this.stats = new Stats();
        this.container.appendChild(this.stats.dom);

        //this.cameraControls = new THREE.OrbitControls(GAME.camera, GAME.renderer.domElement);
        //this.cameraControls.target.set(0, 20, 0);
        //this.cameraControls.update();

        window.addEventListener('resize', this.onWindowResize, false);
    },

    onWindowResize: function() {
        var width = window.innerWidth;
        var height = window.innerHeight;

        GAME.camera.aspect = width / height;
        GAME.camera.updateProjectionMatrix();

        GAME.renderer.setSize(width, height);
    },

    create: function(){
        GAME.enviroment = new GAME.Enviroment();
        GAME.pawn = new GAME.Pawn();
    },

    animate: function() {
        requestAnimationFrame(this.animate.bind(this));
	    this.stats.begin();
	    this.update();
        this.render();
        this.stats.end();
    },

    update: function () {
        var delta = clock.getDelta();
        if (GAME.pawn && GAME.pawn.loaded) {
            GAME.pawn.update(delta);
            var targetPos = GAME.pawn.model.position;
            var offsetPos = new THREE.Vector3();
            offsetPos.subVectors(targetPos, new THREE.Vector3(100, -1000, -1000));
            GAME.camera.lookAt(targetPos);
            GAME.camera.position.copy(offsetPos);
        }

        if (GAME.enviroment) {
            GAME.enviroment.update(delta);
        }
    },

    render: function() {
        GAME.renderer.toneMappingExposure = Math.pow(0.8, 4.0);
        GAME.renderer.render(GAME.scene, GAME.camera);
    }
}