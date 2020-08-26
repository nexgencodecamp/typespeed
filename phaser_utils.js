function createStatusBar(self) {
    var graphics = self.add.graphics();
    var line = new Phaser.Geom.Line(0, 560, 800, 560);
    graphics.lineStyle(1, 0x888000);
    graphics.strokeLineShape(line);

    _statusBar.numKeystrokes = 0
    _statusBar.numWords = 0
    _statusBar.numCorrectKeystrokes = 0
    _statusBar.wordsPerMin = 0
    _statusBar.wordsPerMinText = self.add.bitmapText(365, 570, 'azo-fire', "W/MIN:" + _statusBar.wordsPerMin, 20).setTint(0xFFFEEE)
    _statusBar.accuracy = 0
    _statusBar.accuracyText = self.add.bitmapText(510, 570, 'azo-fire', "ACC:" + _statusBar.accuracy + "%", 20).setTint(0xFFFEEE)
    _statusBar.numHits = 0
    _statusBar.numHitsText = self.add.bitmapText(630, 570, 'azo-fire', "NUM HITS:" + _statusBar.numHits, 20).setTint(0xFFFEEE)
}

function resetStatusBar() {
    _statusBar.numKeystrokes = 0
    _statusBar.numWords = 0
    _statusBar.numCorrectKeystrokes = 0
    _statusBar.wordsPerMin = 0
    _statusBar.accuracy = 0
    _statusBar.numHits = 0
}

function centerText(totalWidth, wd) {
    return (totalWidth / 2) - (wd.width / 2);
}

function typeWriteText(self, textObj, text, delay, cb) {
    const length = text.length
    let i = 0
    self.time.addEvent({
        callback: () => {
            textObj.text += text[i]
            ++i
            if (textObj.text.length === text.length) {
                cb();
            }
        },
        repeat: length - 1,
        delay: delay || 200
    })
}

/**
   this.createSpeechBubble(20, 20, 320, 160, '“Twin ceramic rotor drives on each wheel! And these look like!”');
   this.createSpeechBubble(370, 120, 400, 180, '“You always show up and start bossing me around, and don\'t you deny it!”');
   this.createSpeechBubble(70, 400, 250, 100, '“And now you\'re a boss, too... of this pile of rubble.”');

 * @param {*} x 
 * @param {*} y 
 * @param {*} width 
 * @param {*} height 
 * @param {*} quote 
 */
function createSpeechBubble(x, y, width, height, quote) {
    var bubbleWidth = width;
    var bubbleHeight = height;
    var bubblePadding = 10;
    var arrowHeight = bubbleHeight / 4;

    var bubble = this.add.graphics({ x: x, y: y });

    //  Bubble shadow
    bubble.fillStyle(0x222222, 0.5);
    bubble.fillRoundedRect(6, 6, bubbleWidth, bubbleHeight, 16);

    //  Bubble color
    bubble.fillStyle(0xffffff, 1);

    //  Bubble outline line style
    bubble.lineStyle(4, 0x565656, 1);

    //  Bubble shape and outline
    bubble.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
    bubble.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);

    //  Calculate arrow coordinates
    var point1X = Math.floor(bubbleWidth / 7);
    var point1Y = bubbleHeight;
    var point2X = Math.floor((bubbleWidth / 7) * 2);
    var point2Y = bubbleHeight;
    var point3X = Math.floor(bubbleWidth / 7);
    var point3Y = Math.floor(bubbleHeight + arrowHeight);

    //  Bubble arrow shadow
    bubble.lineStyle(4, 0x222222, 0.5);
    bubble.lineBetween(point2X - 1, point2Y + 6, point3X + 2, point3Y);

    //  Bubble arrow fill
    bubble.fillTriangle(point1X, point1Y, point2X, point2Y, point3X, point3Y);
    bubble.lineStyle(2, 0x565656, 1);
    bubble.lineBetween(point2X, point2Y, point3X, point3Y);
    bubble.lineBetween(point1X, point1Y, point3X, point3Y);

    var content = this.add.text(0, 0, quote, { fontFamily: 'Arial', fontSize: 20, color: '#000000', align: 'center', wordWrap: { width: bubbleWidth - (bubblePadding * 2) } });

    var b = content.getBounds();

    content.setPosition(bubble.x + (bubbleWidth / 2) - (b.width / 2), bubble.y + (bubbleHeight / 2) - (b.height / 2));
}