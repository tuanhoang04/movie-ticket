import { Helmet } from 'react-helmet-async';
import { EditCinemaView } from '../sections/cinema/view';
import { useParams } from 'react-router-dom';

export default function EditCinemaPage() {
    const { id } = useParams();
    return (
        <>
            <Helmet>
                <title> {`Chỉnh sửa thông tin rạp chiếu phim | NHTT Admin Panel`}</title>
            </Helmet>

            <EditCinemaView cinemaId={id} />
        </>
    );
}