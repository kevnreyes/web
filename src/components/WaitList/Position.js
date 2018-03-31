import React from 'react';
import PropTypes from 'prop-types';
import MuiAvatar from 'material-ui-next/Avatar'; // eslint-disable-line

const Position = ({ position }) => (
  <MuiAvatar className="WaitlistRow-position">
    {position}
  </MuiAvatar>
);

Position.propTypes = {
  position: PropTypes.number.isRequired,
};

export default Position;
