/** Returns the first validation message from a string or string array. */
export function firstValidationError(error) {
    return Array.isArray(error) ? (error[0] ?? '') : (error ?? '')
}
