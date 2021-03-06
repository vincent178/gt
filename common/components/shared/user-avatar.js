import React, {
  Component,
  PropTypes
} from 'react';
import { Link } from 'react-router'

export default class UserAvatar extends Component {

  render() {
    var style = {
      width: this.props.size,
      height: this.props.size,
      borderRadius: this.props.radius || 0
    };

    return (
      <Link to={`/${this.props.username}`}>
        <img style={style} src={this.props.src} />
      </Link>);
  }
}

UserAvatar.propTypes = {
  size: PropTypes.number.isRequired,
  src: PropTypes.string.isRequired,
  radius: PropTypes.number,
  username: PropTypes.string.isRequired
};
