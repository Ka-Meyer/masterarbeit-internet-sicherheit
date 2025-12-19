# masterarbeit-internet-sicherheit

# README – Anhang zur Masterarbeit  
**Thema:** Phishing von MFA-gesicherten Accounts und mögliche Gegenmaßnahmen
**Hochschule** Westfälische Hochschule Gelsenkirchen
**Studienfach** Master Internet-Sicherheit

## 1. Überblick  
Dieser Anhang enthält den Quellcode des selbstentwickelten Tools sowie die zugehörigen Phislets für Evilginx, die im Rahmen der Masterarbeit erstellt wurden. Ziel der Arbeit ist es, Schwachstellen bei Multi-Faktor-Authentifizierung (MFA) durch Phishing-Angriffe zu analysieren und darauf basierende Gegenmaßnahmen vorzuschlagen.

## 2. Inhalt  
- **Evilginx:** Phishlets von Evilginx. Das sind Konfigurationsdateien, die speziell für die Durchführung der demonstrierten Angriffe verwendet werden.
- **Puppeteer** Implementierung des Phishing-Tools zur Simulation von Angriffen auf MFA-gesicherte Accounts.
  
## 3. Disclaimer Unternehmen
Diese Arbeit wurde in Zusammenarbeit mit einem Unternehmen erstellt. Aufgrund des securityrelevanten Themas wird weder das Unternehmen erwähnt, noch werden Rückschlüsse zu dem Unternehmen gegeben. Aus diesem Grund sind im Quellcode und den Konfigurationsdateien alle Hinweise, wie die URLs, auf das Unternehmen entfernt. 

## 4. Nutzungshinweis  
Das bereitgestellte Material dient ausschließlich Forschungszwecken und soll nicht für illegale oder unethische Handlungen verwendet werden. Die Nutzung erfolgt auf eigene Verantwortung.

## 5. Anleitung zur Verwendung der Evilginx Phishlets  

### Voraussetzungen 
- Installation von Evilginx2 (https://github.com/kgretzky/evilginx2)

### Schritte zur Ausführung  
1. Repository klonen 
2. Kopieren der yaml-Dateien aus dem "Evilginx" Ordner in den "phishlets"-Ordner von Evilginx
3. Anpassung der URL in den yaml-Dateien, da alle URLs anonymisiert wurden
4. Starten von Evilginx2 mit self-signed Certs:  
   ```bash
   sudo ./evilgingx -developer
   ```  
5. Aktivieren des gewünschten Phislet als Beispiel:  
   ```bash
   phishlets enable entraID
   ```
6. Erstellen eines Lures (Phishing-URL) für das entraID Phishlet:
   ```bash
   lures create entraID
   ```
7. Anzeigen der ersten erstellten Phishing-URL:
   ```bash
   lures get-url 0
   ```
8. Phishing-Test mit der angezeigten URL durchführen
9. Auflisten der Phishing-Ergebnisse:
   ```bash
   sessions
   ```


## 6. Anleitung zur Verwendung des Puppeteer-Codes  

### Voraussetzungen 
- Installation von NodeJS (v18.20.8)
- Installation von Puppeteer (24.9.0)

### Schritte zur Ausführung  
1. Repository klonen
2. Zwei Bash-Konsolen starten
3. Mit der ersten Konsole in den Ordner "Puppeteer/webseite" wechseln, in den HTMl-Dateien die IP des Websockets hinterlegen und Frontend starten:
   ```bash
   node server.js
   ```  
4. Mit der zweiten Konsole in den Ordner "Puppeteer/websocket" wechseln und die URLs in den Dateien im Subordner "skripte" anpassen, da diese anonymisiert wurden
5. Aktivieren Sie das gewünschte Phislet:  
   ```bash
   node websocket.js
   ```  
6. Aufrufen der Phishing-Index-Seite um die Tests durchzuführen
