export const filterUndefined = <T>(value: T | undefined): value is T => {
	return !!value
}
