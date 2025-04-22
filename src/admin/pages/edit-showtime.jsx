import { Helmet } from 'react-helmet-async';
import { EditShowtimeView } from '../sections/showtime/view';
import { useParams } from 'react-router-dom';

// ----------------------------------------------------------------------
export default function EditShowtimePage() {
    const { id } = useParams();

    return (
        <>
            <Helmet>
                <title> {`Chỉnh sửa thông tin suất chiếu | Trang quản trị website bán vé xem phim NHTT`}</title>
            </Helmet>

            <EditShowtimeView showtimeId={id} />
        </>
    );
}