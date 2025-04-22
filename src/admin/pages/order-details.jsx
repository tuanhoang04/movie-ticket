import { Helmet } from 'react-helmet-async';
import { OrderDetailsView } from '../sections/order/view';
import { useParams } from 'react-router-dom';

export default function OrderDetailsPage() {
    const { id } = useParams();

    return (
        <>
            <Helmet>
                <title> {`Thông tin chi tiết đơn hàng | Trang quản trị website bán vé xem phim NHTT`}</title>
            </Helmet>

            <OrderDetailsView orderId={id} />
        </>
    );
}