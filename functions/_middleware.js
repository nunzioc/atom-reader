import { getCookieKeyValue } from "./utils";
import { getTemplate } from "./template";

/**
 * Paths that don't require authentication.
 * The /cfp_login path must be included.
 */
export const CFP_ALLOWED_PATHS = ["/cfp_login"];

export async function onRequest(context) {
	const { request, next, env } = context;
	const { pathname, searchParams } = new URL(request.url);
	const { error } = Object.fromEntries(searchParams);
	const cookie = request.headers.get("cookie") || "";
	const cookieKeyValue = await getCookieKeyValue(env.CFP_PASSWORD);

	if (
		cookie.includes(cookieKeyValue) ||
		CFP_ALLOWED_PATHS.includes(pathname) ||
		!env.CFP_PASSWORD
	) {
		// Correct hash in cookie, allowed path, or no password set.
		// Continue to next middleware.
		return await next();
	} else {
		const loginPage = new URL("/login.html", request.url);
		return Response.redirect(loginPage, 301);
		// No cookie or incorrect hash in cookie. Redirect to login.
		return new Response(getTemplate({ withError: error === "1" }), {
			headers: {
				"content-type": "text/html",
			},
		});
	}
}
