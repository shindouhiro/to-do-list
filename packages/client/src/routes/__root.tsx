import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { LanguageSwitcher } from '../components/LanguageSwitcher'

export const Route = createRootRoute({
  component: () => (
    <>
      <div id="global-language-switcher" className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>
      <Outlet />
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  ),
})
