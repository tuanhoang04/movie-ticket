import Alert from '@mui/material/Alert';
import { Main, CompactContent } from './main';
import { LayoutSection } from '../core/layout-section';
import { HeaderSection } from '../core/header-section';
// ----------------------------------------------------------------------

export function SimpleLayout({ sx, children, header, content }) {
    const layoutQuery = 'md';

    return (
        <LayoutSection
            /** **************************************
             * Header
             *************************************** */
            headerSection={
                <HeaderSection
                    layoutQuery={layoutQuery}
                    slotProps={{ container: { maxWidth: false } }}
                    sx={header?.sx}
                    slots={{
                        topArea: (
                            <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
                                This is an info Alert.
                            </Alert>
                        ),
                    }}
                />
            }
            /** **************************************
             * Footer
             *************************************** */
            footerSection={null}
            /** **************************************
             * Style
             *************************************** */
            cssVars={{
                '--layout-simple-content-compact-width': '448px',
            }}
            sx={sx}
        >
            <Main>
                {content?.compact ? (
                    <CompactContent layoutQuery={layoutQuery}>{children}</CompactContent>
                ) : (
                    children
                )}
            </Main>
        </LayoutSection>
    );
}
