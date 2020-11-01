var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

const path1 = new Phaser.Curves.Path(50, 500);
path1.splineTo([164, 446, 274, 542, 412, 457, 522, 541, 664, 464]);
const part1 = { path: path1, duration: 2000 }

const path2 = new Phaser.Curves.Path(664, 464);
path2.lineTo(700, 300);
const part2 = { path: path2, duration: 200 }

const path3 = new Phaser.Curves.Path(700, 300);
path3.lineTo(600, 350);
const part3 = { path: path3, duration: 1000 }

const path4 = new Phaser.Curves.Path(600, 350);
path4.ellipseTo(200, 100, 100, 250, false, 0);
const part4 = { path: path4, duration: 500 }

const parts = [part1, part2, part3, part4]

var game = new Phaser.Game(config);

function preload() {
    this.load.image('lemming', 'lemming.png');
}

function createFollower(part) {
    var lemming = this.add.follower(part.path, 50, 500, 'lemming');
    lemming.currentPathIndex = 0;
    lemming.startFollow({
        duration: part.duration,
        yoyo: false,
        repeat: 0,
        rotateToPath: true,
        verticalAdjust: true,
        onComplete: (function () {
            console.log(lemming);
            lemming.currentPathIndex++;
            const index = lemming.currentPathIndex;
            if(index >= parts.length)
                lemming.destroy();
            else {
                lemming.setPath(parts[index].path);
                lemming.pathConfig.duration = parts[index].duration;
            }
        }).bind(this)
    });
}

function create() {
    var graphics = this.add.graphics();

    graphics.lineStyle(1, 0xffffff, 1);

    parts.forEach(part => part.path.draw(graphics, 128));

    const follower = createFollower.bind(this);

    setInterval(() => follower(parts[0]), 1500);
}