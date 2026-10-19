import { Header as SiteHeader } from '@/components/veyra/site-shell'

export function Header(props: { user?: unknown }) {
  return <div className="v-site"><SiteHeader {...props} /></div>
}


