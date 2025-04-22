import { Helmet } from 'react-helmet-async';
import { OrderView } from '../sections/order/view';

export default function OrderPage() {
    return (
        <>
            <Helmet>
                <title> {`Quản lý đơn hàng | Trang quản trị website bán vé xem phim NHTT`}</title>
            </Helmet>

            <OrderView />
        </>
    );
}