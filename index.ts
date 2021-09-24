export async function publish(
	contents: string,
	frontMatter: {[prop: string]: any},
	{apiKey}: {apiKey: string},
	postr: any
) {
	console.log('Publishing post on DEV community...');

	const headers = new Headers();

	if (!apiKey) throw new ReferenceError('No API key was provided');

	headers.append('Content-Type', 'application/json');
	headers.append('api-key', apiKey ?? '');

	async function tryPublish() {
		let headers = new Headers();
		let res = await fetch('https://dev.to/api/articles', {
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
		}).then(res => {
			headers = res.headers;

			return res.json();
		});

		if (res.status === 400) {
			throw new Error('The server responded with 400 Bad Request. ' +
				'This is likely a problem with this adapter itself. Please report the bug as an issue');
		}

		if (res.status === 401 || res.status === 403) {
			console.log(res);
			throw new Error(`The server responded with ${res.status} ${
				res.status === 401 ? 'Unauthorized' : 'Forbidden'}. ` +
				'Check your API whether key provided is valid');
		}

		if (res.status === 422) {
			throw new Error('The server responded with 422 Unproccesable Entity. ' +
				'This is likely a problem with this adapter itself. Please report the bug as an issue');
		}

		if (res.status === 429) {
			console.log('Looks like we\'re being rate limited. Trying again.');

			await new Promise(resolve => setTimeout(resolve, +(headers.get('Retry-After') || 0)));
			res = tryPublish();
		}

		return res;
	}

	const res = await tryPublish();

	console.log('Succesfully published post' + frontMatter.title);

	postr.updateFrontMatter({published: true, modified: false});
	postr.mapID(res.id);
}

export async function update(
	contents: string,
	frontMatter: {[prop: string]: any},
	{apiKey}: {apiKey: string},
	postr: any,
	idMappings: {remote: number}
) {

	console.log('Updating post on DEV community...');

	if (!apiKey) throw new ReferenceError('No API key was provided');
	if (!idMappings) throw new ReferenceError('post has not been published yet')

	const headers = new Headers();

	headers.append('Content-Type', 'application/json');
	headers.append('api-key', apiKey ?? '');

	async function tryUpdate() {
		let headers = new Headers();
		let res = await fetch(`https://dev.to/api/articles/${idMappings.remote}`, {
			method: 'PUT',
			headers,
			body: JSON.stringify({
				article: {
					title: frontMatter?.title ?? '',
					body_markdown: contents,
					published: true,
					description: frontMatter?.description ?? ''
				}
			})
		}).then(res => {
			headers = res.headers;

			return res.json();
		});

		if (res.status === 400) {
			throw new Error('The server responded with 400 Bad Request. ' +
				'This is likely a problem with this adapter itself. Please report the bug as an issue');
		}

		if (res.status === 401 || res.status === 403) {
			throw new Error(`The server responded with ${res.status} ${
				res.status === 401 ? 'Unauthorized' : 'Forbidden'}. ` +
				'The api key provided is invalid');
		}

		if (res.status === 422) {
			throw new Error('The server responded with 422 Unproccesable Entity. ' +
				'This is likely a problem with this adapter itself. Please report the bug as an issue');
		}

		if (res.status === 429) {
			console.log('Looks like we\'re being rate limited. Trying again.');

			await new Promise(resolve => setTimeout(resolve, +(headers.get('Retry-After') || 0)));
			res = tryUpdate();
		}

		return res;
	}

	await tryUpdate();

	postr.updateFrontMatter({modified: false});
}
