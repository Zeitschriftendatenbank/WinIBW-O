# WinIBW-O

Konvertiert PICA-Datensätze in ein strukturriertes object in der Form

```
Object
|_Tag
  |_Tag occurrence
    |_Subfield Tag
      |_Subfield Tag occurrence
        |_Value
```

Zum Beispiel wird die Zeile

`039E $bf$aFortsetzung von$9942987667$8--Cbvz--Deutsche Zentralbücherei für Blinde zu Leipzig: DZB-Nachrichten`

zu

```javascript
{
   "039E":
   [
    {
        "b": ["f"],
        "a": ["Fortsetzung von"],
        "9": ["942987667"],
        "8": ["--Cbvz--Deutsche Zentralbücherei für Blinde zu Leipzig: DZB-Nachrichten"]
    }
   ]
}
```

## Installation
### lokal
Laden Sie die Zip-Datei herunter und entpacken Sie sie an einem Ort, an dem Sie ihre WinIBW-Scripte ablegen.

Öffnen Sie die in der WinIBW4 das Menü  `Script > Scriptdateien verwalten`und ergänzen Sie den Pfad unter dem Sie das Script enpackt haben.

Beispiel: Das Script liegt unter `H:\WinIBW4-Scripte\WinIBW-O\`, dann ergänzen Sie `file:///H:/WinIBW4-Scripte/WinIBW-O/`

Die Scripte müssen neu geladen werden.

### remote
TBD

## Handhabung
Nach der Installation steht Ihnen ein object `O` zu Verfügung. `O` hat folgende Funktionen:

### function create
`create` gibt ein object zurück, das einen Pica-Datensatz repräsentiert. Optional kann ein string parameter `ppn` übergeben werden, um einen bestimmten Datensatz auszuwählen statt den aktuellen.

```javascript
var current_rec = O.create(); // Erstellt ein object anhand des aktuellen Datensatzes.

var other_rec = O.create('12345'); // Erstellt das object anhand des Datensatzes mit der PPN 12345
```

### function parseField
Gibt ein object zurück, das eine Kategorie repräsentiert, die über den Parameter `field`übergeben wird.

```javascript
var field = '039E $bf$aFortsetzung von$9942987667$8--Cbvz--Deutsche Zentralbücherei für Blinde zu Leipzig: DZB-Nachrichten'

var field_object = O.parseField(field);
```
### function setDel
Definiere das Zeichen, welche die Unterfelder definiert. Default ist `\u0192`.

```javascript
O.setDel('$');
```