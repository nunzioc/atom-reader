export async function sha256(str) {
	const buf = await crypto.subtle.digest(
		"SHA-256",
		new TextEncoder().encode(str),
	);
	return Array.prototype.map
		.call(new Uint8Array(buf), (x) => ("00" + x.toString(16)).slice(-2))
		.join("");
}

/**
 * Key for the auth cookie.
 */
const CFP_COOKIE_KEY = "CFP-Auth-Key";

export async function getCookieKeyValue(password) {
	const hash = await sha256(password);
	return `${CFP_COOKIE_KEY}=${hash}`;
}
