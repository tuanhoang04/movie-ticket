import { Helmet } from 'react-helmet-async';
import { MovieView } from '../sections/movie/view';

// ----------------------------------------------------------------------
export default function MoviePage() {
    return (
        <>
            <Helmet>
                <title> {`Quản lý phim | Trang quản trị website bán vé xem phim NHTT`}</title>
            </Helmet>

            <MovieView />
        </>
    );
}