import mapProps from 'recompose/mapProps';
import componentFromProp from 'recompose/componentFromProp';
import Main from '../Main';
import UsersList from '../../containers/UsersList';
import BansList from '../../containers/BansList';
import Emoji from '../../containers/Emoji';

const pages = {
  main: Main,
  users: UsersList,
  bans: BansList,
  emoji: Emoji,
};

const enhance = mapProps(props => ({
  component: pages[props.page],
}));

const CurrentPage = enhance(componentFromProp('component'));

export default CurrentPage;
