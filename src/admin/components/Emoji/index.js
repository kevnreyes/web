import React from 'react';
import PropTypes from 'prop-types';
import List, { ListItem, ListItemText } from 'material-ui/List';

const shortcode = name =>
  `:${name}:`;
const url = filename =>
  `/assets/emoji/${filename}`;

const Emoji = ({ name, src }) => (
  <ListItem className="EmojiItem">
    <img className="EmojiItem-img" src={url(src)} alt={name} />
    <ListItemText primary={shortcode(name)} />
  </ListItem>
);

Emoji.propTypes = {
  name: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
};

const EmojiList = ({ emoji }) => (
  <List dense className="EmojiList">
    {Object.keys(emoji).slice(0, 20).map(name => (
      <Emoji
        name={name}
        src={emoji[name]}
      />
    ))}
  </List>
);

EmojiList.propTypes = {
  emoji: PropTypes.object.isRequired,
};

export default EmojiList;
