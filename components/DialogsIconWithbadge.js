import React from 'react';
import { connect } from 'react-redux';
import Badge from './Badge';

const DialogsIconWithBadge = props => (
  <Badge badgeCount={props.badge}>{props.children}</Badge>
);

const mapStateToProps = ({ badge }) => ({ badge });

export default connect(mapStateToProps)(DialogsIconWithBadge);
