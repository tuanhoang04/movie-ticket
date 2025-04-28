import DashboardTwoToneIcon from '@mui/icons-material/DashboardTwoTone';
import MovieTwoToneIcon from '@mui/icons-material/MovieTwoTone';
import TheatersTwoToneIcon from '@mui/icons-material/TheatersTwoTone';
import EditCalendarTwoToneIcon from '@mui/icons-material/EditCalendarTwoTone';
import EventSeatTwoToneIcon from '@mui/icons-material/EventSeatTwoTone';
import BookOnlineTwoToneIcon from '@mui/icons-material/BookOnlineTwoTone';
import PersonTwoToneIcon from '@mui/icons-material/PersonTwoTone';
import ExitToAppTwoToneIcon from '@mui/icons-material/ExitToAppTwoTone';

const DashboardIcon = DashboardTwoToneIcon;
const MovieIcon = MovieTwoToneIcon;
const ShowtimeIcon = EditCalendarTwoToneIcon;
const RoomIcon = EventSeatTwoToneIcon;
const OrderIcon = BookOnlineTwoToneIcon;
const UserIcon = PersonTwoToneIcon;
const ExitIcon = ExitToAppTwoToneIcon;
const CinemaIcon = TheatersTwoToneIcon;

export const navData = [
  { title: 'Dashboard', path: '/admin', icon: <DashboardIcon /> },
  { title: 'Movies Management', path: '/admin/movie', icon: <MovieIcon /> },
  { title: 'Cinemas Management', path: '/admin/cinema', icon: <CinemaIcon /> },
  { title: 'Showtimes Management', path: '/admin/showtime', icon: <ShowtimeIcon /> },
  { title: 'Rooms Management', path: '/admin/room', icon: <RoomIcon /> },
  { title: 'Orders Management', path: '/admin/order', icon: <OrderIcon /> },
  { title: 'Users Management', path: '/admin/user', icon: <UserIcon /> },
  { title: 'Return to Homepage', path: '/auth', icon: <ExitIcon /> },
];