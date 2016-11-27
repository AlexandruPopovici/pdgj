GAME.Assets = function () {
    
}

GAME.Store = {};

GAME.Assets.prototype = {

    constructor: GAME.Assets,

    load: function () {
        var genCubeUrls = function (prefix, postfix) {
            return [
                prefix + 'px' + postfix, prefix + 'nx' + postfix,
                prefix + 'py' + postfix, prefix + 'ny' + postfix,
                prefix + 'pz' + postfix, prefix + 'nz' + postfix
            ];
        };

        var hdrUrls = genCubeUrls("assets/extra/pisaHDR/", ".hdr");
        var self = this;
        new THREE.HDRCubeTextureLoader().load(THREE.UnsignedByteType, hdrUrls, function (hdrCubeMap) {

            var pmremGenerator = new THREE.PMREMGenerator(hdrCubeMap);
            pmremGenerator.update(GAME.renderer);

            var pmremCubeUVPacker = new THREE.PMREMCubeUVPacker(pmremGenerator.cubeLods);
            pmremCubeUVPacker.update(GAME.renderer);

            GAME.Store['enviroment'] = pmremCubeUVPacker.CubeUVRenderTarget;
            var textureLoader = new THREE.TextureLoader();
            textureLoader.load("assets/extra/Gold_Rgh_001.jpg", function (map) {
                map.wrapS = THREE.RepeatWrapping;
                map.wrapT = THREE.RepeatWrapping;
                map.anisotropy = 4;
                map.repeat.set(1, 1);
                GAME.Store['roughness'] = map;
                textureLoader.load("assets/extra/Ter_darkdirt01_d.jpg", function (map) {
                    map.wrapS = THREE.RepeatWrapping;
                    map.wrapT = THREE.RepeatWrapping;
                    map.anisotropy = 16;
                    map.repeat.set(2, 2);
                    GAME.Store['terrainTex'] = map;
                    textureLoader.load("assets/extra/explosion.png", function (map) {
                        GAME.Store['explosion'] = map;
                        textureLoader.load("assets/extra/Dragon_top.png", function (map) {
                            GAME.Store['dragon'] = map;
                            textureLoader.load("assets/extra/Dragon_top_alpha.png", function (map) {
                                GAME.Store['dragon_alpha'] = map;
                                if (self.assetsReady) {
                                    self.assetsReady();
                                }
                            });
                        });
                    });
                });
            });
            
        });
        
    }
}