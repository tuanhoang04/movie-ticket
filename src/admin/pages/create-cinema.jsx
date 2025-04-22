import { Helmet } from 'react-helmet-async';
import { CreateCinemaView } from '../sections/cinema/view';

// ----------------------------------------------------------------------
export default function CreateCinemaPage() {
    return (
        <>
            <Helmet>
                <title> {`Tạo rạp chiếu phim | Trang quản trị website bán vé xem phim NHTT`}</title>
            </Helmet>

            <CreateCinemaView />
        </>
    );
}