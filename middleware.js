//without a defined matcher, this one line applies next-auth to the entire project
export { default } from 'next-auth/middleware'

//using auth to protect specific pages
export const config = {matcher: ['/poop']}