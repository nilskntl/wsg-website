/**
 * Dieses Skript wird in Google Sheets ausgeführt und überprüft, ob in den Zellen der Tabelle neue Links zu Dokumenten enthalten sind.
 * Falls ja, werden die Dokumente in den entsprechenden Ordner verschoben und der neue Link wird in die Zelle geschrieben.
 */

// Erstelle eine Map für die Jahre (Name des Sheets = Jahr) und die zugehörigen Ordner-IDs der Google Drive Folder
const sheets = [
    {
        year: '2021',
        ids: {
            ausschreibung: '1zGuHbCZg2uWTLolzD5dnMPoQtgb0gArn',
            meldeergebnis: '1SuJWskP9Ak8Hgp8QG7ZpSJOxdY0nAaSZ',
            protokoll: '1M6WMfo2bWM1xc5027wZIbmGOw_y6uoaF'
        }
    },
    {
        year: '2022',
        ids: {
            ausschreibung: '1NIwgJqWOMYZ_l0umN0kmOt4_71pZzf_n',
            meldeergebnis: '1Dw16ywnIkXbfmXSbQuWzcadQ-6y3I147',
            protokoll: '1au5KZ63w0PfZqv7VmEA8kz5rMNm5STko'
        }
    },
    {
        year: '2023',
        ids: {
            ausschreibung: '1mUlznIrMD-T2CtkV25eW4sxfK-rw90VC',
            meldeergebnis: '11rR3yLBh_IotvgosZ6aAWipMN6tqdsLX',
            protokoll: '10CVDK1qEzxRY2apXzaRCpiPcTD_Z-bQd'
        }
    },
    {
        year: '2024',
        ids: {
            ausschreibung: '10uzmHjBMAOIb7qwcDoQgAtazQuUuTLF9',
            meldeergebnis: '1uZ4Qh1WdjBEtRIMYTOhbkCelfBYguEm_',
            protokoll: '1OmVrBzpo0rdqBPC43ZdQ1HWfD292OOzN'
        }
    },
    {
        year: '2025',
        ids: {
            ausschreibung: '1QAa5VDChaZCOBzye_eu_A9JfRkQA3TWk',
            meldeergebnis: '1RsGqT0w404smkjwFdzz2A4kiE4LNFWWp',
            protokoll: '1CZxkr98vBILYL9NANW-zp3Foffrd1366'
        }
    },
]

function main() {
    /**
     * Hauptfunktion
     * Iteriere über alle Tabellenblätter und rufe die Funktion iterateOverCells auf
     */

    for (let sheet of sheets) {
        let tabellenblatt = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet.year);
        iterateOverCells(tabellenblatt, sheet.ids.ausschreibung, sheet.ids.meldeergebnis, sheet.ids.protokoll);
    }
}


function iterateOverCells(tabellenblatt, ausschreibungID, meldeergebnisID, protokollID) {
    /**
     * Iteriere über alle Zeilen in der Tabelle und überprüfe, ob die relevanten Zellen ein neues Dokument enthalten.
     * Falls ja, wird das Dokument in den Zielordner verschoben und der neue Link in die Zelle geschrieben.
     * @param {object} tabellenblatt - Das Tabellenblatt
     * @param {string} ausschreibungID - Die ID des Ordners für die Ausschreibungen
     * @param {string} meldeergebnisID - Die ID des Ordners für die Meldeergebnisse
     * @param {string} protokollID - Die ID des Ordners für die Protokolle
     */

        // Die letzte Zeile, die überprüft werden soll
    let lastCell = 100;

    // Iteriere über alle Zeilen in der Tabelle (bis Zeile [lastCell])
    for (let i = 2; i < lastCell; ++i) {
        // Setze die Zellen für die Kategorien fest
        let ausschreibungenCell = 'D' + i;
        let meldeergebnisseCell = 'F' + i;
        let protokolleCell = 'G' + i;

        // Überprüfe den Inhalt der Zellen
        let ausschreibungen = String(tabellenblatt.getRange(ausschreibungenCell).getValue());
        let meldeergebnisse = String(tabellenblatt.getRange(meldeergebnisseCell).getValue());
        let protokolle = String(tabellenblatt.getRange(protokolleCell).getValue());
drive
        // Überprüfe für jede Zelle, ob sie einen neuen Inhalt erhalten soll
        if (ausschreibungen !== '' && !ausschreibungen.includes('drive')) {
            writeLinkToCell(tabellenblatt, ausschreibungenCell, ausschreibungID);
        }
        if (meldeergebnisse !== '' && !meldeergebnisse.includes('drive')) {
            writeLinkToCell(tabellenblatt, meldeergebnisseCell, meldeergebnisID);
        }
        if (protokolle !== '' && !protokolle.includes('drive')) {
            writeLinkToCell(tabellenblatt, protokolleCell, protokollID);
        }

    }
}

function writeLinkToCell(tabellenblatt, cell, folderId) {
    /**
     * Überprüfe, ob die Zelle einen Link zu einem neuen Dokument enthält.
     * Das Dokument wird in den Zielordner verschoben und der neue Link wird in die Zelle geschrieben.
     * @param {object} tabellenblatt - Das Tabellenblatt
     * @param {string} cell - Die Zelle
     * @param {string} folderId - Die ID des Zielordners
     */

        // Extrahiere Drive Link
    let link = String(tabellenblatt.getRange(cell).getRichTextValue().getLinkUrl());

    // Überprüfe, ob es sich um einen drive Link handelt, falls nicht, beende die Funktion
    if (!link.includes('drive')) {
        return;
    }

    // Extrahiere File ID
    let id = link.substring(32, link.length - 1);

    // Verschiebe File und generiere neuen Link
    link = moveFileToFolder(id, folderId);

    // Schreibe neuen Link in Zelle
    let range = tabellenblatt.getRange(cell);
    range.setValue(link); // Setze den Link als Inhalt der Zelle
    range.setFontColor('#252626'); // Schriftfarbe
    range.setFontLine('none'); // Entferne Unterstreichung
}


function moveFileToFolder(id, zielordnerID) {
    /**
     * Verschiebe eine Datei in einen anderen Ordner und ändere die Freigabe auf öffentlich.
     * Die alte Datei wird gelöscht.
     * @param {string} id - Die ID der Datei
     * @param {string} zielordnerID - Die ID des Zielordners
     * @return {string} - Der Link zur Datei
     */

        // Hole das Datei-Objekt
    let file = DriveApp.getFileById(id);

    // Hole das Ordner-Objekt
    let destinationFolder = DriveApp.getFolderById(zielordnerID);

    // Verschiebe die Datei in den Zielordner
    let movedFile = destinationFolder.createFile(file.getBlob());

    // Ändere die Freigabe der Datei auf öffentlich
    movedFile.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.VIEW);

    // Erstelle den Link für die neue Datei
    let fileUrl = movedFile.getUrl();

    // Lösche die Datei aus dem ursprünglichen Ordner
    file.setTrashed(true);

    // Rückgabe des Links
    return fileUrl;
}