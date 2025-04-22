import { Helmet } from 'react-helmet-async';
import { RoomView } from '../sections/room/view/room-view';

export default function RoomPage() {
    return (
        <>
            <Helmet>
                <title> {`Quản lý phòng chiếu phim | Trang quản trị website bán vé xem phim NHTT`}</title>
            </Helmet>

            <RoomView />
        </>
    );
}