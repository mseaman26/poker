export { default } from "next-auth/middleware";

export const config = { matcher: ["/dashboard", "/user/:path*", '/game/:path*', '/createGame', '/account', '/myFriends', "/searchUsers", '/games'] };
