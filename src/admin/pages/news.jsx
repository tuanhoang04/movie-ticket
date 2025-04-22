import { Helmet } from 'react-helmet-async';
import { NewsView } from '../sections/news/view';

export default function NewsPage() {

    return (
        <>
            <Helmet>
                <title> {`Quản lý bài viết | Trang quản trị website bán vé xem phim NHTT`}</title>
            </Helmet>

            <NewsView />
        </>
    );
}