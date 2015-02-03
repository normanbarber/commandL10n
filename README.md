# commandL10n
Identifies unused localization key/value pairs in a project
Recursively reads the directory and its sub-directories for the view files, eventually comparing localization string variables in the view with the locale file key/value pairs

### example of returned array of unused localization string keys
```json
[ 'Current On Hand',
  'Export Schedule',
  'PO',
  'Planning',
  'Safety Stock',
  'auto plan',
  'deliveries',
  'demand',
  'planned',
  'reorderpoint',
  'schedule',
  'starting',
  'time bucket' ]
```

### Running from the command line
##### Install and link to run locally
```javascript
	> npm link
```

##### command line example
```bat
	> cleani10n --localefile path/to/your/locale/folder/en.json --viewfolder path/to/your/read/folder
```

##### Options:
```javascript
	-v, --viewfolder     [string] - folder you want to read recursively
	-l, --localefile     [string] - file name and path to locale file
```
