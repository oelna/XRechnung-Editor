//import { createApp, reactive } from 'https://unpkg.com/petite-vue@0.2.2/dist/petite-vue.es.js'
//import { vDraggable } from 'https://cdn.jsdelivr.net/npm/@neodrag/vue@2.2.0/+esm';

import { default as Alpine } from 'alpine';

window.Alpine = Alpine;

document.addEventListener('alpine:init', init);

function init () {
	console.log('init');

}

class Doc {
	$component = null;
	parser = null;
	viewer = null;
	content = null;
	dom = {};

	get activePage () {
		return 0;
	}

	constructor (options) {
		this.$component = this;
		this.viewer = document.querySelector('#viewer');

		console.log('Editor mounted!', options, this.$component);

		// todo: make first page
	}

	init () {
		// Alpine.store('global').editor = this;

		this.parser = new DOMParser();
		this.reader = new FileReader();
	}

	async dropHandler (event) {
		console.log("File(s) dropped", event);

		// Prevent default behavior (Prevent file from being opened)
		event.preventDefault();

		// Prepare an array of promises…
		const fileHandlesPromises = [...event.dataTransfer.items]
			// …by including only files (where file misleadingly means actual file _or_
			// directory)…
			.filter((item) => item.kind === 'file')
			// …and, depending on previous feature detection…
			.map((item) => item.getAsFile());

		console.log("Drop", fileHandlesPromises);
		// Loop over the array of promises.
		for await (const handle of fileHandlesPromises) {
			// This is where we can actually exclusively act on the files.
			const xml = await handle.text();
			// console.log(xml);
			this.parseXML(xml);
			// this.viewer.innerHTML = xml;
		}
	}

	dragOverHandler (event) {
		// console.log(event);
		event.preventDefault();
	}

	parseXML (xmlString) {
		const dom = this.parser.parseFromString(xmlString, 'application/xml');
		console.log(dom);
		this.content = xml2json(dom, '');
		this.dom = dom.querySelectorAll('*');
		// const json2 = JSON.stringify(dom.outerHTML);
		// console.log(this.content);
		// this.viewer.innerHTML = JSON.stringify(dom);

		console.log(dom.querySelectorAll('*'));
		this.dom.forEach(child => {
			// console.log(child);
        });
	}

	processNode (node, index) {
		// console.log(node, index);
		var keys = Object.values(node);
		console.log(node.textContent, node.attributes);
		for (const p in node) {
			console.log(p);
		}

		return node.tagName + ': ' + node.textContent;
	}

	renderLevel (obj, i) {
		let hasChildren = obj.children && obj.children.length;
		let text = !hasChildren ? obj.tagName+': '+obj.textContent : obj.tagName;
		let html = `<span :class="${hasChildren} ? 'has-children' : ''" x-html="${hasChildren} ? level.tagName : level.tagName+level.textContent"></span>`;

		if (obj.children) {
			html += `<ul>
			<template x-for='(level,i) in level.children'>
			<li x-html="renderLevel(level,i)"></li>
			</template>
			</ul>`;
		}

		return html;
	}
}

Alpine.data('doc', (options) => (new Doc(options)));


Alpine.start();
