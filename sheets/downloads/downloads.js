/**
 * Dieses Skript wird in Google Sheets ausgeführt und schreibt die neuesten zu Google Drive hinzugefügten Dokumente in die Tabelle.
 * In die Tabelle werden jeweils geschrieben: Name des Dokuments, Link zum Dokument
 */

const sheetName = 'Downloads';
const numberOfPDFs = 12;

function main() {
    /**
     * Hauptfunktion
     */

    // Rufe die neuesten PDFs ab und speichere sie im Feld
    let urls = getRecentPDFs();

    // Rufe das Tabellenblatt ab
    let tabellenblatt = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);

    // Schreibe die [numberOfPDFs] neuesten PDFs in die Tabelle
    for(let i = 0; i < numberOfPDFs; ++i) {
        // Name des Dokuments und Link zum Dokument in die Tabelle schreiben
        tabellenblatt.getRange('A' + (i + 3)).setValue(urls[i].name);
        tabellenblatt.getRange('B' + (i + 3)).setValue(urls[i].url);
    }
}

function getRecentPDFs() {
    /**
     * Funktion, um die neuesten PDFs aus Google Drive zu erhalten
     */

    // Zugriff auf Google Drive
    let drive = DriveApp;

    // Ein leeres Array für die neuesten PDFs erstellen
    let recentPDFs = [];

    // Root-Ordner abrufen
    let rootFolder = drive.getRootFolder();

    function searchFiles(folder) {
        /**
         * Rekursive Funktion, um Dateien in einem Ordner zu durchsuchen
         */
        let files = folder.getFiles();
        while (files.hasNext()) {
            let file = files.next();
            if (file.getMimeType() === 'application/pdf') {
                recentPDFs.push({
                    name: file.getName(),
                    url: file.getUrl(),
                    date: file.getLastUpdated()
                });
            }
        }

        let subFolders = folder.getFolders();
        while (subFolders.hasNext()) {
            searchFiles(subFolders.next());
        }
    }

    // Funktion aufrufen, um Dateien zu durchsuchen
    searchFiles(rootFolder);

    // Sortiere die Dateien nach dem Datum absteigend
    recentPDFs.sort(function(a, b) {
        return b.date - a.date;
    });

    // Die neuesten [numberOfPDFs] PDFs auswählen
    return recentPDFs.slice(0, numberOfPDFs);
}

