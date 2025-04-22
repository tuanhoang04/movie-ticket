import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { MenuButton } from '../components/menu-button';
import { ScrollToTop } from '../../components/ScrollToTop';
import { navData } from '../config-nav-dashboard';
import { NavDesktop, NavMobile } from './nav';
import { LayoutSection } from '../core/layout-section';
import { HeaderSection } from '../core/header-section';
import { Main } from './main';
import { layoutClasses } from '../classes';

function DashboardLayout({ sx, children, header }) {
  const theme = useTheme();
  const [navOpen, setNavOpen] = useState(false);
  const layoutQuery = 'lg';
  
  return (
    <LayoutSection
      headerSection={
        <HeaderSection
          layoutQuery={layoutQuery}
          slotProps={{
            container: {
              maxWidth: false,
              sx: { px: { [layoutQuery]: 5 } },
            },
          }}
          sx={header?.sx}
          slots={{
            topArea: null,
            leftArea: (
              <>
                <MenuButton
                  onClick={() => setNavOpen(true)}
                  sx={{
                    ml: -1,
                    [theme.breakpoints.up(layoutQuery)]: { display: 'none' },
                  }}
                />
                <NavMobile
                  data={navData}
                  open={navOpen}
                  onClose={() => setNavOpen(false)}
                />
              </>
            ),
            rightArea: null,
          }}
        />
      }
      sidebarSection={
        <NavDesktop data={navData} layoutQuery={layoutQuery} />
      }
      footerSection={null}
      cssVars={{
        '--layout-nav-vertical-width': '300px',
        '--layout-dashboard-content-pt': theme.spacing(1),
        '--layout-dashboard-content-pb': theme.spacing(8),
        '--layout-dashboard-content-px': theme.spacing(5),
      }}
      sx={{
        [`& .${layoutClasses.hasSidebar}`]: {
          [theme.breakpoints.up(layoutQuery)]: {
            pl: 'var(--layout-nav-vertical-width)',
          },
        },
        ...sx,
      }}
    >
      <ScrollToTop />
      <Main>{children}</Main>
    </LayoutSection>
  );
}

export { DashboardLayout };