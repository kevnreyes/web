import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { availableEmojiImagesSelector } from '../../selectors/configSelectors';
import { createEmoji, deleteEmoji } from '../../actions/EmojiActionCreators';
import Emoji from '../components/Emoji';

const mapStateToProps = createStructuredSelector({
  emoji: availableEmojiImagesSelector,
});

const mapDispatchToProps = {
  onCreateEmoji: createEmoji,
  onDeleteEmoji: deleteEmoji,
};

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(Emoji);
