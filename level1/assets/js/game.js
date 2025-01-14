game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 432,
    height: 224,
    scale: {
        mode: Phaser.Scale.FIT,
    },
    physics: {
        default: 'arcade',
        gravity: 0
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
});

function preload() {
    //background
    this.load.image('mountainBg', './assets/images/bg/parallax-mountain-bg.png');
    this.load.image('mountainFar', './assets/images/bg/parallax-mountain-montain-far.png');
    this.load.image('mountain', './assets/images/bg/parallax-mountain-mountains.png');
    this.load.image('bgTrees', './assets/images/bg/parallax-mountain-trees.png');
    this.load.image('fgTrees', './assets/images/bg/parallax-mountain-foreground-trees.png');

    //load map
    this.load.image('tiles', './assets/maps/tiles.png');
    this.load.tilemapTiledJSON('map', './assets/maps/level1.json');

    //load sign bg
    this.load.image('placa', './assets/images/ui/wood.png');
    this.load.spritesheet('zpopup', './assets/images/ui/zpopup.png', { frameWidth: 32, frameHeight: 32 });

    //load baloon
    this.load.image('baloon', './assets/images/items/baloon.png');

    //load zeppelin
    this.load.image('zeppelin', './assets/images/items/airBaloon.png');

    //load zeppelin platforms
    this.load.image('plataforma', './assets/images/ui/platform.png');

    //load bat
    this.load.spritesheet('bat', './assets/images/enemies/Bat.png', { frameWidth: 16, frameHeight: 16 });

    //load player HP
    this.load.spritesheet('playerhp', './assets/images/ui/playerHp.png', { frameWidth: 16, frameHeight: 16 });

    //load player animations ---> tamanho ideal de frame w:24 h:30
    this.load.spritesheet('playerIdle', './assets/images/player/playerIdle.png', { frameWidth: 26, frameHeight: 30 });
    this.load.spritesheet('playerRun', './assets/images/player/playerRun.png', { frameWidth: 26, frameHeight: 30 });

    //camera
    this.load.image('cam', './assets/images/ui/cameraFollow.png');

    //win - game over
    this.load.image('win', './assets/images/ui/win(1).png');

}
var lastAnim; // 0 = idle -- 1 = run right -- 2 = run left;
var player;
var a;
var jump = 1;
var cam;
var placa;
var texto = [];
var mountainBg;
var mountainFar;
var mountain;
var bgTrees;
var fgTrees;
var baloes1;
var baloes2;
var baloes3;
var ckpx = 298;
var ckpy = 176;
var zeppelin;
var hp = [];
var mortes = 0;
var bats = [];
var pltfrm;
var canMove = true;
var zpopup;
var winimg;
var dieimg;

function create() {

    mountainBg = this.add.tileSprite(this.sys.canvas.width / 2, this.sys.canvas.height / 2, this.sys.canvas.width, this.sys.canvas.height, 'mountainBg');
    mountainBg.setScrollFactor(0);
    mountainFar = this.add.tileSprite(this.sys.canvas.width / 2, this.sys.canvas.height / 2, this.sys.canvas.width, this.sys.canvas.height, 'mountainFar');
    mountainFar.setScrollFactor(0);
    mountain = this.add.tileSprite(this.sys.canvas.width / 2, this.sys.canvas.height / 2, this.sys.canvas.width, this.sys.canvas.height, 'mountain');
    mountain.setScrollFactor(0);
    bgTrees = this.add.tileSprite(this.sys.canvas.width / 2, this.sys.canvas.height / 2, this.sys.canvas.width, this.sys.canvas.height, 'bgTrees');
    bgTrees.setScrollFactor(0);
    fgTrees = this.add.tileSprite(this.sys.canvas.width / 2, this.sys.canvas.height / 2, this.sys.canvas.width, this.sys.canvas.height, 'fgTrees');
    fgTrees.setScrollFactor(0);


    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("DirtBrick_Assets_V4", "tiles", 16, 16);

    //map layers
    const floor = map.createStaticLayer("Floor", tileset, 0, 0);
    const decorations = map.createStaticLayer("Camada de Tiles 2", tileset, 0, 0);
    const spikes = map.createStaticLayer("spikes", tileset, 0, 0);
    const spikeTop = map.createStaticLayer("SpikeTop", tileset, 0, 0);
    const win = map.createStaticLayer("Win", tileset, 0, 0);
    const wall = map.createStaticLayer("parede", tileset, 0, 0);
    const batLayer = map.createStaticLayer("bats", tileset, 0, 0);

    wall.setCollisionByProperty({ collides: true });
    floor.setCollisionByProperty({ collides: true });
    spikes.setCollisionByProperty({ collides: true });
    spikeTop.setCollisionByProperty({ collides: true });
    batLayer.setCollisionByProperty({ collides: true });
    win.setCollisionByProperty({ collides: true });

    //Player    
    player = this.physics.add.sprite(85, 176, 'playerIdle');
    player.body.setSize(16, 28, true);
    player.body.setOffset(5, 2);
    player.body.setGravity(0, 200);
    player.body.setDrag(500, 0);
    player.body.setMaxVelocity(200, 250);
    ckpx = 298;
    ckpy = 176;


    //baloes
    var balao;
    baloes1 = this.physics.add.group();
    balao = baloes1.create(456, 72, 'baloon');
    balao.setImmovable(true);
    balao.body.checkCollision.down = false;
    balao.body.checkCollision.left = false;
    balao.body.checkCollision.right = false;
    balao = baloes1.create(456, 136, 'baloon');
    balao.setImmovable(true);
    balao.body.checkCollision.down = false;
    balao.body.checkCollision.left = false;
    balao.body.checkCollision.right = false;
    balao = baloes1.create(456, 200, 'baloon');
    balao.setImmovable(true);
    balao.body.checkCollision.down = false;
    balao.body.checkCollision.left = false;
    balao.body.checkCollision.right = false;

    baloes1.setVelocityY(-50);

    baloes2 = this.physics.add.group();
    balao = baloes2.create(520, 72, 'baloon');
    //balao.setImmovable(true);
    balao.body.checkCollision.down = false;
    balao.body.checkCollision.left = false;
    balao.body.checkCollision.right = false;
    balao = baloes2.create(520, 136, 'baloon');
    //balao.setImmovable(true);
    balao.body.checkCollision.down = false;
    balao.body.checkCollision.left = false;
    balao.body.checkCollision.right = false;
    balao = baloes2.create(520, 200, 'baloon');
    //balao.setImmovable(true);
    balao.body.checkCollision.down = false;
    balao.body.checkCollision.left = false;
    balao.body.checkCollision.right = false;

    baloes2.setVelocityY(-75);

    baloes3 = this.physics.add.group();
    balao = baloes3.create(584, 72, 'baloon');
    balao.setImmovable(true);
    balao.body.checkCollision.down = false;
    balao.body.checkCollision.left = false;
    balao.body.checkCollision.right = false;
    balao = baloes3.create(584, 136, 'baloon');
    balao.setImmovable(true);
    balao.body.checkCollision.down = false;
    balao.body.checkCollision.left = false;
    balao.body.checkCollision.right = false;
    balao = baloes3.create(584, 200, 'baloon');
    balao.setImmovable(true);
    balao.body.checkCollision.down = false;
    balao.body.checkCollision.left = false;
    balao.body.checkCollision.right = false;

    baloes3.setVelocityY(-100);

    //Airship
    zeppelin = this.physics.add.sprite(1052, 24, 'zeppelin');
    zeppelin.flipX = true;
    zeppelin.setScale(0.5, 0.5)

    pltfrm = this.physics.add.group();
    var plat = this.physics.add.image(1024, 144, 'plataforma');
    pltfrm.add(plat);
    plat.body.checkCollision.down = false;
    plat.body.checkCollision.left = false;
    plat.body.checkCollision.right = false;
    plat.setImmovable(true);

    plat = this.physics.add.image(1088, 144, 'plataforma');
    pltfrm.add(plat);
    plat.body.checkCollision.down = false;
    plat.body.checkCollision.left = false;
    plat.body.checkCollision.right = false;
    plat.setImmovable(true);

    plat = this.physics.add.image(1088, 106, 'plataforma');
    pltfrm.add(plat);
    plat.body.checkCollision.down = false;
    plat.body.checkCollision.left = false;
    plat.body.checkCollision.right = false;
    plat.setImmovable(true);

    plat = this.physics.add.image(1024, 106, 'plataforma');
    pltfrm.add(plat);
    plat.body.checkCollision.down = false;
    plat.body.checkCollision.left = false;
    plat.body.checkCollision.right = false;
    plat.setImmovable(true);

    plat = this.physics.add.image(1056, 128, 'plataforma');
    plat.setScale(0.75, 1)
    pltfrm.add(plat);
    plat.body.checkCollision.down = false;
    plat.body.checkCollision.left = false;
    plat.body.checkCollision.right = false;
    plat.setImmovable(true);

    pltfrm.add(zeppelin);

    console.log(pltfrm.getChildren());

    //playerHp
    var hp1 = this.add.sprite(8, 8, 'playerhp');
    hp.push(hp1);
    hp1 = this.add.sprite(24, 8, 'playerhp');
    hp.push(hp1);
    hp1 = this.add.sprite(40, 8, 'playerhp');
    hp.push(hp1);

    //Placa

    zpopup = this.add.sprite(296, 144, 'zpopup');
    zpopup.setScale(0.5, 0.5);

    console.log(this.sys.canvas.width / 2);
    placa = this.add.image(296, this.sys.canvas.height / 2, 'placa');
    placa.setScale(0.85, 0.5);

    var txt = this.add.text(140, 6, "O elemento Hélio foi descoberto por Pierre - Jules -", { fontFamily: 'Arial', fontSize: 12, color: '#fff' });
    texto.push(txt);
    txt = this.add.text(140, 19, "César Janssen após observações do espectro de luz do", { fontFamily: 'Arial', fontSize: 12, color: '#fff' });
    texto.push(txt);
    txt = this.add.text(140, 32, "sol, o cientista percebeu a existência de um espectro", { fontFamily: 'Arial', fontSize: 12, color: '#fff' });
    texto.push(txt);
    txt = this.add.text(140, 45, "de luz que ainda não era conhecido na terra, chamando", { fontFamily: 'Arial', fontSize: 12, color: '#fff' });
    texto.push(txt);
    txt = this.add.text(140, 58, "então o novo elemento de Hélio, em referência a ", { fontFamily: 'Arial', fontSize: 12, color: '#fff' });
    texto.push(txt);
    txt = this.add.text(140, 71, "personificação divina do sol na mitologia grega, ocupa", { fontFamily: 'Arial', fontSize: 12, color: '#fff' });
    texto.push(txt);
    txt = this.add.text(140, 84, "a 2° posição na tabela periódica e é um gás nobre, ", { fontFamily: 'Arial', fontSize: 12, color: '#fff' });
    texto.push(txt);
    txt = this.add.text(140, 97, "possui uma densidade baixa em relação ao ar atmosférico,", { fontFamily: 'Arial', fontSize: 12, color: '#fff' });
    texto.push(txt);
    txt = this.add.text(140, 110, "sendo o segundo elemento mais abundante no universo,", { fontFamily: 'Arial', fontSize: 12, color: '#fff' });
    texto.push(txt);
    txt = this.add.text(140, 123, "logo após o Hidrogênio.", { fontFamily: 'Arial', fontSize: 12, color: '#fff' });
    texto.push(txt);

    placa.setVisible(false);
    for (var i of texto) {
        i.setVisible(false);
    }



    //bats
    var morcego = this.physics.add.sprite(1208, 136, 'bat');
    bats.push(morcego);
    morcego = this.physics.add.sprite(1272, 88, 'bat');
    bats.push(morcego);
    morcego = this.physics.add.sprite(1384, 136, 'bat');
    bats.push(morcego);
    morcego = this.physics.add.sprite(1448, 88, 'bat');
    bats.push(morcego);
    morcego = this.physics.add.sprite(1528, 88, 'bat');
    bats.push(morcego);
    morcego = this.physics.add.sprite(1640, 136, 'bat');
    bats.push(morcego);


    //game over e win -> devem ser as ultimas imagens adicionadas
    winimg = this.add.image(216, this.sys.canvas.height / 2, 'win');
    winimg.setVisible(false);


    //Colliders
    this.physics.add.collider(player, floor, function() {
        jump = 1;
    });
    this.physics.add.collider(player, wall);
    this.physics.add.collider(player, spikes, function() {
        die();
    });
    this.physics.add.collider(player, win, function() {
        won();
    });

    this.physics.add.collider(baloes1, spikeTop, function(baloes1) {
        baloes1.y = 216;
        baloes1.setVelocityY(-50);
    });
    this.physics.add.collider(baloes2, spikeTop, function(baloes2) {
        baloes2.y = 216;
        baloes2.setVelocityY(-75);
    });
    this.physics.add.collider(baloes3, spikeTop, function(baloes3) {
        baloes3.y = 216;
        baloes3.setVelocityY(-100);
    });

    this.physics.add.collider(player, baloes1, function() {
        jump = 1;
    });
    this.physics.add.collider(player, baloes2, function() {
        jump = 1;
    });
    this.physics.add.collider(player, baloes3, function() {
        jump = 1;
    });

    this.physics.add.collider(player, batLayer, function() {
        die();
    });

    this.physics.add.collider(player, pltfrm, function() {
        jump = 1;
    });

    this.physics.add.collider(player, win, function() {
        win();
    });

    //Animations
    //Player
    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('playerIdle'),
        frameRate: 15,
        repeat: -1
    });
    player.play('idle');
    lastAnim = 0;

    this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('playerRun'),
        frameRate: 15,
        repeat: -1
    });

    this.anims.create({
        key: 'death',
        frames: this.anims.generateFrameNumbers('playerhp'),
        framerate: 10,
        repeat: 0
    });

    this.anims.create({
        key: 'batfly',
        frames: this.anims.generateFrameNumbers('bat'),
        framerate: 15,
        repeat: -1
    });

    for (var i = 0; i < bats.length; i++) {
        bats[i].play('batfly');
    }

    this.anims.create({
        key: 'popup',
        frames: this.anims.generateFrameNumbers('zpopup'),
        framerate: 15,
        repeat: -1
    });
    zpopup.play('popup');
    zpopup.setVisible(false);

    //Entradas do teclado
    //movimentação do player
    var space = this.input.keyboard.addKey('SPACE');
    space.on('down', function(event) {
        if (jump == 1) {
            jump = 0;
            player.body.setVelocity(player.body.velocity.x, player.body.velocity.y - 100);
        }
    });

    //placa
    var keyz = this.input.keyboard.addKey('Z');
    keyz.on('down', function(event) {
        if (canMove) {
            if (player.x > 272 && player.x < 330) {
                var v = placa.visible
                if (v == true) {
                    placa.setVisible(false)
                    for (var i of texto) {
                        i.setVisible(false);
                    }
                } else {
                    placa.setVisible(true)
                    for (var i of texto) {
                        i.setVisible(true);
                    }
                }
            }
        }
    });

    a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    //camera
    cam = this.add.sprite(this.sys.canvas.width / 2, this.sys.canvas.height / 2, 'cam');
    this.cameras.main.startFollow(cam);
    cam.setVisible(false);
}

function update() {

    hp[2].x = cam.x - 160;
    hp[1].x = cam.x - 176;
    hp[0].x = cam.x - 192;

    mountainFar.tilePositionX = this.cameras.main.scrollX * .5;
    mountain.tilePositionX = this.cameras.main.scrollX * .6;
    bgTrees.tilePositionX = this.cameras.main.scrollX * .7;
    fgTrees.tilePositionX = this.cameras.main.scrollX * .8;

    if (player.x > 1032 && player.x < 1750) {
        if (player.x < 1720) {
            console.log('na reset')
            pltfrm.setVelocityX(30);
        } else {
            console.log('resetando');
            pltfrm.setVelocityX(0);
            resetAirship();
        }
    }

    if (player.body.velocity.x == 0) {
        if (lastAnim != 0) {
            lastAnim = 0;
            player.play('idle');
        }
    }

    if (d.isDown && canMove) {

        player.setVelocityX(80);
        if (lastAnim != 1) {
            lastAnim = 1;
            player.play('run');

        }
        if (player.flipX == true) {
            player.flipX = false;
        }

    } else if (a.isDown && canMove) {

        player.setVelocityX(-80);
        if (lastAnim != 2) {
            lastAnim = 2;
            player.play('run');
            player.flipX = true;
        }
    }
    if (player.x > 216 && player.x < 1830) {
        cam.x = player.x;
    }

    //checkpoints
    if (player.x > 296 && player.x < 320) {
        ckpx = player.x;
        ckpy = 176;
    } else if (player.x > 1000 && player.x < 1020) {
        ckpx = player.x;
        ckpy = 128;

    }
    var v = placa.visible;
    if ((player.x < 272 || player.x > 330) && v == true) {
        placa.setVisible(false);
        for (var i of texto) {
            i.setVisible(false);
        }
    }
    if ((player.x > 272 && player.x < 330)) {
        zpopup.setVisible(true);
    } else {
        zpopup.setVisible(false);
    }


}

function die() {
    console.log("Tile X: " + parseInt(player.x / 16) + "\nTile Y: " + parseInt(player.y / 16));
    player.x = ckpx;
    player.y = ckpy;
    console.log('MORREU');
    if (mortes == 0) {
        hp[0].play('death');
    } else if (mortes == 1) {
        hp[1].play('death');
    } else if (mortes == 2) {
        hp[2].play('death');
        location.reload();
    }

    mortes++;
    player.setVelocityY(0);

    var b2 = baloes2.getChildren();

    b2[0].setY(72);
    b2[1].setY(136);
    b2[2].setY(200);
    baloes2.setVelocityY(-75);

    resetAirship();

    console.log(b2);
}

function resetAirship() {
    pltfrm.setVelocityX(0);
    zeppelin.setVisible(true)

    var v = pltfrm.getChildren();
    v[0].setX(1024);
    v[1].setX(1088);
    v[2].setX(1088);
    v[3].setX(1024);
    v[4].setX(1056);
    v[5].setX(1052);
}

function won() {
    canMove = false;
    console.log('ganhou');
} //colocar simblo nos baloes