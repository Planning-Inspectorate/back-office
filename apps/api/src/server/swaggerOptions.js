const swaggerOptions = {
	definition: {
		swagger: "2.0",
		info: { 
			title: "PINS Back-office project ",
			description: "PINS Back-office project API Information",
    		version: "2.0"
			},
		servers: ["http://localhost:3000/"],
		paths: {
			"/validation": {
				get: {
					summary: "List of appeals to be validated",
					parameters: {
						
					}
				}

		}
	},
		},
	//apis: [".routes/*.js"]
	apis: ["app.js"]
}

export {
	swaggerOptions
};
