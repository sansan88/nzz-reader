# NZZ Reader

Eine Firefox-Erweiterung speziell für nzz.ch, die JavaScript-Kontrolle und das Entfernen von störenden Elementen ermöglicht.

## 🎯 Funktionen

### 1. JavaScript Toggle
- **Deaktiviert/Aktiviert JavaScript** für die gesamte nzz.ch Domain
- Blockiert externe JavaScript-Dateien und Inline-Scripts
- Einstellungen werden gespeichert und bleiben nach Neustart erhalten
- Automatisches Neuladen der Seite nach Änderung

### 2. Element-Entfernung
- **Entfernt "nzzinteraction" Klasse** von allen HTML-Elementen
- **Löscht Overlay-DIVs** mit den Klassen "disabled-overlay disabled-overlay--show" komplett aus dem DOM
- Zeigt Anzahl der bearbeiteten Elemente an

## 📁 Dateistruktur

```
nzz-extension/
├── manifest.json          # Extension-Konfiguration
├── popup.html            # Popup-Interface
├── popup.js              # Popup-Logik
├── content.js            # Content-Script für Seitenmanipulation
├── background.js         # Background-Script für JavaScript-Blockierung
├── icon.png              # Extension-Icon (16x16, 48x48, 128x128)
└── README.md            # Diese Datei
```

## 🚀 Installation

### Temporäre Installation (Entwicklung)

1. **Dateien vorbereiten**
   - Erstelle einen neuen Ordner `nzz-extension`
   - Speichere alle 6 Dateien im Ordner
   - Konvertiere `icon.svg` zu `icon.png` oder verwende ein eigenes Icon

2. **In Firefox installieren**
   - Öffne Firefox und navigiere zu `about:debugging`
   - Klicke auf "Dieses Firefox" im linken Menü
   - Klicke auf "Temporäres Add-on laden..."
   - Wähle die `manifest.json` Datei aus dem Ordner

3. **Extension nutzen**
   - Das Icon erscheint in der Firefox-Toolbar
   - Klicke auf das Icon um das Popup zu öffnen

### Permanente Installation

Für eine permanente Installation muss die Extension signiert werden:
- Verwende Firefox Developer Edition mit `xpinstall.signatures.required` auf `false`
- Oder lade die Extension im [Firefox Add-on Store](https://addons.mozilla.org/developers/) hoch

## 💻 Verwendung

### Auf nzz.ch:
1. **JavaScript deaktivieren**: Klicke auf "JavaScript: Aktiviert" → wird rot und zeigt "JavaScript: Deaktiviert"
2. **Elemente entfernen**: Klicke auf "Klassen & Overlay entfernen"
3. **Status**: Zeigt Anzahl der bearbeiteten Elemente oder Fehlermeldungen

### Auf anderen Seiten:
- Die Extension zeigt "Nicht verfügbar" an
- Buttons sind deaktiviert
- Meldung: "Diese Extension funktioniert nur auf nzz.ch"

## ⚙️ Technische Details

### JavaScript-Blockierung
- Verwendet `webRequest.onBeforeRequest` API zum Blockieren von JS-Dateien
- Injiziert Content Security Policy (CSP) Headers gegen Inline-Scripts
- Speichert blockierte Domains in `browser.storage.local`

### Element-Manipulation
- Content Script läuft nach DOM-Laden (`document_idle`)
- Verwendet `querySelectorAll()` für Element-Suche
- `.classList.remove()` für Klassenentfernung
- `.remove()` für komplette Element-Löschung

### Berechtigungen
- `activeTab` - Zugriff auf aktiven Tab
- `storage` - Speichern von Einstellungen
- `tabs` - Tab-Verwaltung
- `webRequest` & `webRequestBlocking` - JavaScript-Blockierung
- `*://*.nzz.ch/*` - Zugriff nur auf NZZ-Domain

## 🔧 Anpassungen

### Auto-Entfernung beim Seitenladen

Um Elemente automatisch beim Laden zu entfernen, bearbeite `content.js`:

```javascript
// Entferne die Kommentarzeichen (//) in Zeile 25-35
window.addEventListener('load', function() {
  // Remove nzzinteraction class
  const nzzElements = document.querySelectorAll(".nzzinteraction");
  nzzElements.forEach(el => {
    el.classList.remove("nzzinteraction");
  });
  
  // Remove overlay divs
  const overlayElements = document.querySelectorAll("div.disabled-overlay.disabled-overlay--show");
  overlayElements.forEach(el => {
    el.remove();
  });
});
```

### Weitere Klassen/Elemente hinzufügen

In `content.js`, erweitere die `removeClass` Funktion:

```javascript
// Beispiel: Weitere Klasse entfernen
const customElements = document.querySelectorAll(".andere-klasse");
customElements.forEach(el => {
  el.classList.remove("andere-klasse");
});
```

## 🐛 Fehlerbehebung

### Extension lädt nicht
- Prüfe ob alle Dateien im gleichen Ordner sind
- Stelle sicher dass `manifest.json` valides JSON ist
- Überprüfe die Browser-Konsole für Fehler

### JavaScript-Blockierung funktioniert nicht
- Seite muss nach Toggle neu geladen werden
- Prüfe ob die Domain korrekt gespeichert wurde
- Manche Scripts könnten von anderen Domains geladen werden

### Elemente werden nicht entfernt
- Stelle sicher dass du auf nzz.ch bist
- Manche Elemente werden dynamisch nachgeladen
- Versuche den Button mehrmals zu klicken

## 📄 Lizenz

Diese Extension ist für den persönlichen Gebrauch bestimmt.

## 🤝 Beitragen

Verbesserungsvorschläge und Bug-Reports sind willkommen!

## ⚠️ Haftungsausschluss

Diese Extension modifiziert Webseiten-Inhalte und kann die Funktionalität beeinträchtigen. Verwendung auf eigene Gefahr.