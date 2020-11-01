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
    if(window.location.hostname.includes("github"))
        this.load.image('lemming', 'phaser-follower/lemming.png');
    else
        this.load.image('lemming', 'lemming.png');
}

function createFollower() {
    var lemming = this.add.follower(parts[0].path, 50, 500, 'lemming');
    // Die Eigenschaft "currentPathIndex" gibt es auf dem Objekt an sich nicht,
    // aber in Javascript kann man diese beliebig hinzufügen.
    // Die Eigenschaft wird benötigt, damit wir uns merken können auf welchem
    // Pfad sich der Lemming gerade befindet.
    lemming.currentPathIndex = 0;
    lemming.startFollow({
        // Die Dauer ist nur für das erste Teilstück,
        // die Dauert für die anderen Stücke wird später gesetzt.
        duration: parts[0].duration,
        yoyo: false,
        repeat: 0,
        rotateToPath: true,
        verticalAdjust: true,
        onComplete: (function () {
            // Wenn der Pfad abgefahren wurde wird dieser Code ausgeführt.
            console.log(lemming);
            // Den Index um eins erhöhen, weil das Teilstück fertig ist.
            lemming.currentPathIndex++;
            const index = lemming.currentPathIndex;

            if(index >= parts.length)
                // Wenn der Index außerhalb des gültigen Bereichs liegt wird der Lemming zerstört.
                lemming.destroy();
            else {
                // Wenn es weitere Teilstücke gibt, dann wird das nächste gesetzt.
                lemming.setPath(parts[index].path);
                // Und die Dauer wird auch gesetzt.
                lemming.pathConfig.duration = parts[index].duration;
            }
        }).bind(this)
    });
}

function create() {
    // Zeichnet die Route
    var graphics = this.add.graphics();
    graphics.lineStyle(1, 0xffffff, 1);
    parts.forEach(part => part.path.draw(graphics, 128));

    // Erzeugt alle 1.5 Sekunden einen neuen Follower.
    setInterval(() => createFollower.bind(this)(), 1500);
}