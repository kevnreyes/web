import React from 'react';
import UserCard from '../containers/UserCard';

export default function userCardable() {
  return (Component) => {
    class CardableComponent extends React.Component {
      state = {
        open: false,
        userID: null,
        position: null
      };

      handleOpen = (userID) => {
        const pos = this.container.getBoundingClientRect();
        this.setState({
          open: true,
          userID: typeof userID === 'object' ? userID._id : userID,
          position: {
            x: pos.left,
            y: pos.top
          }
        });
      };

      handleClose = () => {
        this.setState({ open: false });
      };

      refContainer = (container) => {
        this.container = container;
      };

      render() {
        const { open, position, userID } = this.state;
        return (
          <div ref={this.refContainer}>
            {open && (
              <UserCard
                userID={userID}
                position={position}
                onClose={this.handleClose}
              />
            )}
            <Component
              {...this.props}
              openUserCard={this.handleOpen}
              closeUserCard={this.handleClose}
            />
          </div>
        );
      }
    }

    return CardableComponent;
  };
}
