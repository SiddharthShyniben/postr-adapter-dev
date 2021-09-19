export async function publish(
	contents: string,
	frontMatter: {[prop: string]: any},
	{apiKey}: {apiKey: string}
) {
	const headers =  new Headers();

	if (!apiKey) throw new ReferenceError('No API key was provided');

	headers.append('Content-Type', 'application/json');
	headers.append('api-key', apiKey ?? '');

	const res = await fetch('https://dev.to/api/articles', {
		method: 'POST',
		headers,
		body: JSON.stringify({
			article: {
				title: frontMatter?.title ?? '',
				body_markdown: contents,
				published: true,
				description: frontMatter?.description ?? ''
			}
		})
	}).then(res => res.json());

	console.log(res)
}

export async function update(
	contents: string, frontMatter: {[prop: string]: any}, {apiKey}: {apiKey: string}
) {
	const headers =  new Headers();

	if (!apiKey) throw new ReferenceError('No API key was provided');

	headers.append('Content-Type', 'application/json');
	headers.append('api-key', apiKey ?? '');

	const res = await fetch('https://dev.to/api/articles', {
		method: 'POST',
		headers,
		body: JSON.stringify({
			article: {
				title: frontMatter?.title ?? '',
				body_markdown: contents,
				published: true,
				description: frontMatter?.description ?? ''
			}
		})
	}).then(res => res.json());

	return res;
}
