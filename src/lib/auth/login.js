let isLoggedIn = false;

export function toggleLoggedIn() { isLoggedIn = !isLoggedIn; }

export function getLoggedIn() { return isLoggedIn; }