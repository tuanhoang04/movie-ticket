import { Helmet } from 'react-helmet-async';
import { UserView } from '../sections/user/view';

// ----------------------------------------------------------------------
export default function UserPage() {
    return (
        <>
            <Helmet>
                <title> {`Quản lý người dùng | Trang quản trị website bán vé xem phim NHTT`}</title>
            </Helmet>

            <UserView />
        </>
    );
}