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