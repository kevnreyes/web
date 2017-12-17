import { connect } from 'react-redux';
import { usersSelector } from '../selectors/userSelectors';
import UserCard from '../components/UserCard';

const mapStateToProps = (state, props) => ({
  user: props.user || usersSelector(state)[props.userID]
});

const enhance = connect(mapStateToProps);

export default enhance(UserCard);
