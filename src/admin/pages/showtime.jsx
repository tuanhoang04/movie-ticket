import { Helmet } from 'react-helmet-async';
import { ShowtimeView } from '../sections/showtime/view';

// ----------------------------------------------------------------------
export default function ShowtimePage() {
    return (
        <>
            <Helmet>
                <title> {`Quản lý suất chiếu phim | Trang quản trị website bán vé xem phim NHTT`}</title>
            </Helmet>

            <ShowtimeView />
        </>
    );
}