import { Helmet } from 'react-helmet-async';
import { EditUserView } from '../sections/user/view';
import { useParams } from 'react-router-dom';

// ----------------------------------------------------------------------
export default function EditUserPage() {
    const { id } = useParams();

    return (
        <>
            <Helmet>
                <title> {`Chỉnh sửa thông tin người dùng | Trang quản trị website bán vé xem phim NHTT`}</title>
            </Helmet>

            <EditUserView userId={id} />
        </>
    );
}