#!/usr/bin/env node
const fs = require('fs')

switch(process.platform){
	case 'win32':
		nextLineRegex = '\r\n'
		break
	case 'win64':
	case 'darwin':
	case 'linux':
		nextLineRegex = '\n'
		break
}

if(process.argv.length < 5){
	throw 'Please pass all the arguments'
} else {
	const sourceFile = process.argv[2]
	const destinationFile = process.argv[3]
	const variableName = process.argv[4]
	const isHtmlRequired = process.argv[5] || false
	
	let fileContent = fs.readFileSync(sourceFile, 'utf8');
	
	if(!isHtmlRequired){
		fileContent = fileContent
			.replace(/<html>|<\/html>|<body>|<\/body>/ig, '')
			.replace(/<head>(.|\n|\r|\t)*<\/head>/ig, '')
	}

	const multiLines = fileContent.split(nextLineRegex)
	const modifiedContent = multiLines
		.filter(line => line !== '' && line.replace(/\t/ig, '') !== '')
		.map((line, index) => {
			if(index === 0){
				return `var ${variableName} = "${line}";${nextLineRegex}`
			} else {
				return `${variableName} += "${line}";${nextLineRegex}`
			}
		})
		.join('')
	
	fs.writeFileSync(destinationFile, modifiedContent)
}
