export {default} from 'next-auth/middleware'

export const config = {
    matcher: ['/dashboard/:path','/products/:path*','/api/:path*']
}