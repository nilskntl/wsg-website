// Velo API Reference: https://www.wix.com/velo/reference/api-overview/introduction

function startWithRandomSlide() {
    /*
        * Ändere die Slideshow auf ein zufälliges Bild
     */
    let rnd = Math.floor(Math.random() * 6);
    $w('#slideshow1').hide() // Slideshow ausblenden
        .then(() => {
            return $w('#slideshow1').changeSlide(rnd); // Zufälliges Bild auswählen
        })
        .then(() => {
            $w('#slideshow1').show(); // Slideshow wieder anzeigen
        });
}

$w.onReady(function () {
    /*
        * Führe beim Laden der Seite die folgenden Funktionen aus
     */
    // Starte die Slideshow mit einem zufälligen Bild
    startWithRandomSlide();
});
