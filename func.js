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

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image("sky", "./Assets/Bosque/PNG/sky.png");
    this.load.image("cloud", "./Assets/Bosque/PNG/clouds.png");
    this.load.image("far-ground", "./Assets/Bosque/PNG/far-grounds.png")
    this.load.image("ground", "./Assets/Bosque/PNG/ground.png")
    this.load.spritesheet("jugador", "./Assets/run.png", 
            {frameWidth: 75, frameHeight: 50})
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

    jugador = this.physics.add.sprite(150, 150, "jugador", 2)
    jugador.setScale(2)

    jugador.setBounce(0.2);
    jugador.setCollideWorldBounds(true);
    this.physics.add.collider(jugador, platforms); 

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('jugador', { start: 1, end: 0 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'jugador', frame: 2 } ],
        frameRate: 20
    });
    
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('jugador', { start: 3, end: 4 }),
        frameRate: 10,
        repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();

}

function update ()
{
    nube.tilePositionX = Math.fround(iter) * 200
    iter += bgSpeed

    if (cursors.left.isDown)
    {
        jugador.setVelocityX(-160);

        jugador.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        jugador.setVelocityX(160);

        jugador.anims.play('right', true);
    }
    else
    {
        jugador.setVelocityX(0);

        jugador.anims.play('turn');
    }

    if (cursors.up.isDown && jugador.body.touching.down)
    {
        jugador.setVelocityY(-330);
    }
    
}