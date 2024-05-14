/**
 * Dieses Skript wird in Google Sheets ausgeführt und überprüft, ob in den Zellen der Tabelle neue Links zu Dokumenten enthalten sind.
 * Falls ja, werden die Dokumente in den entsprechenden Ordner verschoben und der neue Link wird in die Zelle geschrieben.
 */

const columns = {
    /**
     * Map für die Spalten der Kategorien (Name des Sheets = Spalte)
     */
    ausschreibung: 'D',
    meldeergebnis: 'F',
    protokoll: 'G'

}

const sheetsInfo = [
    /**
     * Map für die Jahre (Name des Sheets = Jahr) und die zugehörigen Ordner-IDs der Google Drive Folder
     */
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

function onEdit(e) {
    /**
     * Die Funktion wird getriggert, sobald etwas im Dokument bearbeitet wird
     * Es wird überprüft, ob es sich um eine Zelle handelt, in denen die Dokumente enthalten sind
     * Falls ja, so wird das Dokument in den entsprechenden Ordner verschoben und der neue Link in die Zelle geschrieben
     * @param {object} e - Das Event-Objekt
     */

    let year = e.range.getSheet().getName(); // Jahr des Tabellenblatts
    let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(year); // Hole das Tabellenblatt basierend auf dem Namen des Sheets
    let cell = e.range.getA1Notation(); // Zelle, die bearbeitet wurde
    let column = cell.charAt(0); // Spalte der Zelle

    // Überprüfe, ob die Zelle in einer der relevanten Spalten ist
    if (column === columns.ausschreibung || column === columns.meldeergebnis || column === columns.protokoll) {
        let folderId = getFolderId(year, column);
        writeLinkToCell(sheet, cell, folderId);
    }
}

function getFolderId(year, column) {
    /**
     * Hole die ID des Zielordners basierend auf dem Jahr und der Spalte
     * @param {string} year - Das Jahr
     * @param {string} column - Die Spalte
     */

    for (let sheetInfo of sheetsInfo) {
        if (sheetInfo.year === year) {
            if (column === columns.ausschreibung) return sheetInfo.ids.ausschreibung;
            if (column === columns.meldeergebnis) return sheetInfo.ids.meldeergebnis;
            if (column === columns.protokoll) return sheetInfo.ids.protokoll;
            throw new Error('Spalte nicht gefunden');
        }
    }
}

function iterateOverSheets() {
    /**
     * Hauptfunktion
     * Iteriere über alle Tabellenblätter und rufe die Funktion iterateOverCells auf
     */

    for (let sheetInfo of sheetsInfo) {
        let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetInfo.year);
        iterateOverColumns(sheet, sheetInfo);
    }
}


function iterateOverColumns(sheet, sheetInfo) {
    /**
     * Iteriere über alle Zeilen in der Tabelle und überprüfe, ob die relevanten Zellen ein neues Dokument enthalten.
     * Falls ja, wird das Dokument in den Zielordner verschoben und der neue Link in die Zelle geschrieben.
     * @param {object} tabellenblatt - Das Tabellenblatt
     * @param {string} sheetInfo - Die Informationen des Tabellenblatts
     */

        // Die letzte Zeile, die überprüft werden soll
    let lastCell = 100;

    // Iteriere über alle Zeilen in der Tabelle (bis Zeile [lastCell])
    for (let i = 2; i < lastCell; ++i) {
        // Schreibe den Link in die Zelle
        writeLinkToCell(sheet, 'D' + i, sheetInfo.ids.ausschreibung);
        writeLinkToCell(sheet, 'F' + i, sheetInfo.ids.meldeergebnis);
        writeLinkToCell(sheet, 'G' + i, sheetInfo.ids.protokoll);
    }
}

function writeLinkToCell(sheet, cell, folderId) {
    /**
     * Überprüfe, ob die Zelle einen Link zu einem neuen Dokument enthält.
     * Das Dokument wird in den Zielordner verschoben und der neue Link wird in die Zelle geschrieben.
     * @param {object} tabellenblatt - Das Tabellenblatt
     * @param {string} cell - Die Zelle
     * @param {string} folderId - Die ID des Zielordners
     */

    let cellValue = sheet.getRange(cell).getValue(); // Extrahiere Zelleninhalt
    // Wenn bereits ein Link in der Zelle ist, beende die Funktion
    if (cellValue.includes('drive')) {
        return;
    }

    // Extrahiere Drive Link
    let link = String(sheet.getRange(cell).getRichTextValue().getLinkUrl());

    // Überprüfe, ob es sich um einen drive Link handelt, falls nicht, beende die Funktion
    if (!link.includes('drive')) {
        return;
    }

    // Extrahiere File ID
    let id = link.substring(32, link.length - 1);

    // Verschiebe File und generiere neuen Link
    link = moveFileToFolder(id, folderId);

    // Schreibe neuen Link in Zelle
    let range = sheet.getRange(cell);
    range.setValue(link); // Setze den Link als Inhalt der Zelle
    range.setFontColor('#252626'); // Schriftfarbe
    range.setFontLine('none'); // Entferne Unterstreichung
}


function moveFileToFolder(id, folderId) {
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
    let destinationFolder = DriveApp.getFolderById(folderId);

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