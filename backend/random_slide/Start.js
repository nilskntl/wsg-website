/**
 * Startseite
 */
// Velo API Reference: https://www.wix.com/velo/reference/api-overview/introduction

function startWithRandomSlide() {
    /**
     * Ändere die Slideshow auf ein zufälliges Bild
     */
    let rnd = Math.floor(Math.random() * 7);
    $w('#slideshow1').changeSlide(rnd)
        .then((newSlide) => {
            $w('#slideshow1').show()
        });
}

$w.onReady(function () {
    /**
     * Führe beim Laden der Seite die folgenden Funktionen aus
     */
    // Starte die Slideshow mit einem zufälligen Bild
    startWithRandomSlide();
});