# commandL10n
Identifies unused localization key/value pairs in a project
Recursively reads the directory and its sub-directories for the view files, comparing localization string variables from the view with the locale file key/value pairs


### example of returned array of unused localization string keys
```javascript
  {
  	"PO": "PO",
  	"Planning": "Planning",
  	"auto plan": "Auto Plan",
  	"On Hand": "On Hand"
  }
```

### Running from the command line
##### Install and link to run locally
```javascript
	> npm link
```

##### command line example
NOTE: If the --write (-w) flag is included, then the en.json you read will be overwritten having only the key/value pairs that are being used. Since this operation is destructive, it is good idea to create a back-up first
```bat
	> L10n --localefile path/to/your/locale/folder/en.json --viewfolder path/to/your/read/folder
```

##### Options:
```javascript
	-v, --viewfolder     [string] - folder you want to read recursively
	-l, --localefile     [string] - file name and path to locale file
	-w, --write          [boolean] - default value = false -  returns results overwriting code in xy.json file
```
