import { connect } from 'react-redux';
import { usersSelector } from '../selectors/userSelectors';
import UserCard from '../components/UserCard';

const enhance = connect(
  (state, props) => ({
    user: props.user || usersSelector(state)[props.userID]
  })
);

export default enhance(UserCard);
