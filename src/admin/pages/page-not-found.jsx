import { Helmet } from 'react-helmet-async';
import { NotFoundView } from '../sections/error';

// ----------------------------------------------------- -----------------
export default function ErrorPage() {
    return (
        <>
            <Helmet>
                <title> {`Không tìm thấy trang! | Trang lỗi của trang quản trị website bán vé xem phim NHTT`}</title>
            </Helmet>

            <NotFoundView />
        </>
    );
}