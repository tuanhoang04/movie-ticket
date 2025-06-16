import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { LinearProgress, linearProgressClasses } from '@mui/material';
import { SimpleLayout } from '../../layouts/simple';
import { Suspense } from 'react';

const renderFallback = (
    <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
        <LinearProgress
            sx={{
                width: 1,
                maxWidth: 320,
                bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
                [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
            }}
        />
    </Box>
);

export function NotFoundView() {
    return (
        <SimpleLayout content={{ compact: true }}>
            <Suspense fallback={renderFallback}>
                <Container>
                    <Typography variant="h3" sx={{ mb: 2 }}>
                        Sorry, page not found!
                    </Typography>

                    <Typography sx={{ color: 'text.secondary' }}>
                        Sorry, we couldn't find the page you're looking for. Perhaps you've mistyped the URL? Be
                        sure to check your spelling.
                    </Typography>

                    <Box
                        component="img"
                        src="/assets/illustrations/illustration-404.svg"
                        sx={{
                            width: 320,
                            height: 'auto',
                            my: { xs: 5, sm: 10 },
                        }}
                    />

                    <Button component={Link} to="/admin" size="large" variant="contained" color="inherit">
                        Go to home
                    </Button>
                </Container>
            </Suspense>
        </SimpleLayout>
    );
}