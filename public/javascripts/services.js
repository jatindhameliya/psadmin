//CUSTOM SERVICES

app.service('HelperService', function () {
	this.queryString = function (key) {
		var url_string = window.location.href;
		var url = new URL(url_string);
		var value = url.searchParams.get(key);
		return value;
	};
	this.paginator = function (totalPages, page, maxLength) {
		if (maxLength < 5) throw "maxLength must be at least 5";
		function range(start, end) {
			return Array.from(Array(end - start + 1), (_, i) => i + start);
		}
		var sideWidth = maxLength < 9 ? 1 : 2;
		var leftWidth = (maxLength - sideWidth * 2 - 3) >> 1;
		var rightWidth = (maxLength - sideWidth * 2 - 2) >> 1;
		if (totalPages <= maxLength) {
			return range(1, totalPages);
		}
		if (page <= maxLength - sideWidth - 1 - rightWidth) {
			return range(1, maxLength - sideWidth - 1)
				.concat(0, range(totalPages - sideWidth + 1, totalPages));
		}
		if (page >= totalPages - sideWidth - 1 - rightWidth) {
			return range(1, sideWidth)
				.concat(0, range(totalPages - sideWidth - 1 - rightWidth - leftWidth, totalPages));
		}
		return range(1, sideWidth)
			.concat(0, range(page - leftWidth, page + rightWidth),
				0, range(totalPages - sideWidth + 1, totalPages));
	}
	this.getRandomColors = function (doc_Length) {
		let arrayList = [];
		const Colors = [
			'table-primary',
			'table-secondary',
			'table-success',
			'table-danger',
			'table-warning',
			'table-info',
			'table-light',
		];
		let selectedColors = [];
		function regenerate() {
			let rNumber = Math.floor((Math.random() * 7));
			let newColor = Colors[rNumber];
			if (selectedColors.length > 0) {
				let index = selectedColors.length - 1;
				let lastColor = selectedColors[index];
				if (lastColor == newColor && index != undefined) {
					regenerate();
				} else {
					return newColor;
				}
			} else {
				return newColor;
			}
		}
		for (let i = 0; i < doc_Length; i++) {
			let color = regenerate();
			selectedColors.push(color);
		}
		return selectedColors;
	}
});
