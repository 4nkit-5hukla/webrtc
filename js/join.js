const random_color = () => {
	let n = (Math.random() * 0xfffff * 1000000).toString(16);
	return '#' + n.slice(0, 6);
};
const toDataUrl = (url, callback) => {
	var xhr = new XMLHttpRequest();
	xhr.onload = () => {
		var reader = new FileReader();
		reader.onloadend = () => {
			callback(reader.result);
		}
		reader.readAsDataURL(xhr.response);
	};
	xhr.open('GET', url);
	xhr.responseType = 'blob';
	xhr.send();
};
const ucFirst = (string) => {
	return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};
const generateAvatar = () => {
	let option = {
		name: ucFirst(localStorage.getItem('display_name')),
		background: random_color(),
		color: '#ffffff',
		size: 128,
		uppercase: 'false',
		format: 'png'
	}
	let queryString = Object.keys(option).map((k) => {
		return encodeURIComponent(k) + '=' + encodeURIComponent(option[k])
	}).join('&')
	let avatarProvider = 'https://ui-avatars.com/api/';
	let avatarURL = `${avatarProvider}?${queryString}`;
	toDataUrl(avatarURL, (avatarData) => {
		localStorage.setItem("user_avatar", avatarData);
		let path = (location.pathname.indexOf('index.html') > -1) ? location.pathname.replace('index', 'room') : `${location.pathname}room.html`;
		location.href = `${location.origin}${path}`;
		return false;
	});
};
(($) => {
	$(document).ready(($) => {
		let name;
		if (typeof Storage !== "undefined") {
			if (localStorage.getItem('display_name')) {
				name = localStorage.getItem("display_name");
			} else {
				name = prompt('What is Your Name?');
				if (name === null) {
					window.location.reload();
					return false;
				} else {
					localStorage.setItem("display_name", name);
				}
			}
		}
		if (name.length) {
			generateAvatar();
		}
	});
})(jQuery);