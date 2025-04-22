import { Helmet } from 'react-helmet-async';
import { EditMovieView } from '../sections/movie/view';
import { useParams } from 'react-router-dom';

// ----------------------------------------------------------------------
export default function EditMoviePage() {
    const { id } = useParams();

    return (
        <>
            <Helmet>
                <title> {`Chỉnh sửa thông tin phim | Trang quản trị website bán vé xem phim NHTT`}</title>
            </Helmet>

            <EditMovieView movieId={id} />
        </>
    );
}