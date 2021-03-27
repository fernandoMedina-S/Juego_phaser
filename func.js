var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var iter = 0
var bgSpeed = 0.01

var tam = 95
var score = 0;
var scoreText;

var game = new Phaser.Game(config);


function preload ()
{
    this.load.image("sky", "./Assets/Bosque/PNG/sky.png");
    this.load.image("cloud", "./Assets/Bosque/PNG/clouds.png");
    this.load.image("far-ground", "./Assets/Bosque/PNG/far-grounds.png")
    this.load.image("ground", "./Assets/Bosque/PNG/ground.png")
    this.load.image("plat_izq", "./Assets/Bosque/PNG/plataforma_izq.png")
    this.load.image("plat_cent", "./Assets/Bosque/PNG/plat_cent.png")
    this.load.spritesheet("jugador", "./Assets/Link.png", 
            {frameWidth: 24, frameHeight: 32}, 96)
    this.load.spritesheet("slime", "./Assets/Slime.png",
            {frameWidth: 32, frameHeight: 25}, 21) 
}

function create ()
{
    cielo = this.add.tileSprite(0, 0, game.config.width, game.config.height, "sky");
    cielo.setScale(2);
    nube = this.add.tileSprite(400, 0, 800, 550, "cloud");
    nube.setTileScale(1.2, 1.2)
    fground = this.add.image(400, 450, "far-ground")
    fground.setScale(2)
    
    platforms = this.physics.add.staticGroup();
    
    

    for(var i=0; i<10; i++){
        platforms.create(45+tam*i, 570, "ground").setScale(2).refreshBody();
    }

    jugador = this.physics.add.sprite(100, 500, "jugador", 12)
    jugador.setScale(2)
    slime = this.physics.add.sprite(300, 505, "slime", 0)
    slime.setScale(2)

    jugador.setBounce(0.2);
    jugador.setCollideWorldBounds(true);
    this.physics.add.collider(jugador, platforms); 

    slime.setBounce(0.2);
    slime.setCollideWorldBounds(true);
    this.physics.add.collider(slime, platforms);
    this.physics.add.collider(jugador, slime, hitBomb, null, this);
    
    

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('jugador', { start: 12, end: 23 }),
        frameRate: 20,
        repeat: -1
    });
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'jugador', frame: 12 } ],
        frameRate: 20
    });
    
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('jugador', { start: 12, end: 23 }),
        frameRate: 20,
        repeat: -1
    });

    this.anims.create({
        key: "slime_walk",
        frames: this.anims.generateFrameNumbers("slime", {start: 0, end: 7}),
        frameRate: 30 
    })
    this.anims.create({
        key: "slime_walk_r",
        frames: this.anims.generateFrameNumbers("slime", {start: 0, end: 7}),
        frameRate: 30 
    })

    platforms.create(400, 400, "plat_cent");
    platforms.create(28, 200, "plat_izq").flipX=true;

    cursors = this.input.keyboard.createCursorKeys();

    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    for(var i=0; i<10; i++){
        slime = this.physics.add.sprite(Phaser.Math.Between(0, 800), Phaser.Math.Between(0, 600), "slime", 0)
        slime.setScale(2)
        slime.setBounce(0.2);
        slime.setCollideWorldBounds(true);
        this.physics.add.collider(slime, platforms);
        this.physics.add.collider(jugador, slime, hitBomb, null, this);
    }

}


function update ()
{
    nube.tilePositionX = Math.fround(iter) * 200
    iter += bgSpeed

    slime.setVelocityX(-160)
    slime.anims.play("slime_walk", true)
    
    
    

    if (cursors.left.isDown)
    {
        jugador.setVelocityX(-160);

        jugador.anims.play('left', true);

        jugador.flipX=true;
        
    }
    else if (cursors.right.isDown)
    {
        jugador.setVelocityX(160);

        jugador.anims.play('right', true);
        jugador.flipX=false;
    }
    else
    {
        jugador.setVelocityX(0);

        jugador.anims.play('turn');
        jugador.flipX=false;
    }

    if (cursors.up.isDown && jugador.body.touching.down)
    {
        jugador.setVelocityY(-330);
    }
    
}

function hitBomb (player, slime)
{
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;

    this.add.text(300, 300, "GAME OVER", { fontSize: '40px', fill: '#ff0000' });
}