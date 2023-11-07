function rowBlank(imageData: ImageData, width: number, y: number) {
	for (let x = 0; x < width; ++x) {
		if (imageData.data[y * width * 4 + x * 4 + 3] !== 0) return false
	}
	return true
}

function columnBlank(imageData: ImageData, width: number, x: number, top: number, bottom: number) {
	for (let y = top; y < bottom; ++y) {
		if (imageData.data[y * width * 4 + x * 4 + 3] !== 0) return false
	}
	return true
}

function trim(canvas: HTMLCanvasElement) {
	const ctx = canvas.getContext('2d')
	if (!ctx) throw new Error('Could not get canvas context')

	const width = canvas.width
	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
	let top = 0
	let bottom = imageData.height
	let left = 0
	let right = imageData.width

	while (top < bottom && rowBlank(imageData, width, top)) ++top
	while (bottom - 1 > top && rowBlank(imageData, width, bottom - 1)) --bottom
	while (left < right && columnBlank(imageData, width, left, top, bottom)) ++left
	while (right - 1 > left && columnBlank(imageData, width, right - 1, top, bottom)) --right

	const trimmed = ctx.getImageData(left, top, right - left, bottom - top)
	ctx.canvas.width = trimmed.width
	ctx.canvas.height = trimmed.height
	ctx.putImageData(trimmed, 0, 0)
}

export function trimImageData(imageData: ImageData) {
	const width = imageData.width
	let top = 0
	let bottom = imageData.height
	let left = 0
	let right = imageData.width

	while (top < bottom && rowBlank(imageData, width, top)) ++top
	while (bottom - 1 > top && rowBlank(imageData, width, bottom - 1)) --bottom
	while (left < right && columnBlank(imageData, width, left, top, bottom)) ++left
	while (right - 1 > left && columnBlank(imageData, width, right - 1, top, bottom)) --right

	// create new trimmed ImageData
	const trimmed = new ImageData(right - left, bottom - top)
	for (let y = top; y < bottom; ++y) {
		for (let x = left; x < right; ++x) {
			trimmed.data[(y - top) * trimmed.width * 4 + (x - left) * 4 + 0] =
				imageData.data[y * width * 4 + x * 4 + 0]
			trimmed.data[(y - top) * trimmed.width * 4 + (x - left) * 4 + 1] =
				imageData.data[y * width * 4 + x * 4 + 1]
			trimmed.data[(y - top) * trimmed.width * 4 + (x - left) * 4 + 2] =
				imageData.data[y * width * 4 + x * 4 + 2]
			trimmed.data[(y - top) * trimmed.width * 4 + (x - left) * 4 + 3] =
				imageData.data[y * width * 4 + x * 4 + 3]
		}
	}

	return trimmed

	// const trimmed = ctx.getImageData(left, top, right - left, bottom - top)
	// ctx.canvas.width = trimmed.width
	// ctx.canvas.height = trimmed.height
	// ctx.putImageData(trimmed, 0, 0)
}
