type NextPageWithLayout<P = {}, IP = P> = import('next').NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}
