let apiKey: string | null = null;

export function init(config: {apiKey: string}) {
	apiKey = config.apiKey;
}

export function publish(contents: string, parsedFrontMatter: any) {
	fetch('https://dev.to/api/articles', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'api-key': apiKey
		},
		body: JSON.stringify({
			article: {
				title: parsedFrontMatter.title,
				body_markdown: contents,
				pulished: true,
				description: 'Testing 123'
			}
		})
	}).then(res => res.json()).then(console.log)
}
