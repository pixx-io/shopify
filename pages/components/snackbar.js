import React from 'react';
import { Icon } from '@shopify/polaris';
import { CancelSmallMinor } from '@shopify/polaris-icons';
import { tl } from '../shared/translation';

export const snackbarAnimationTime = 120;

class SnackbarComponent extends React.Component {
  constructor(props) {
    super(props);
    this.onClose = this.close.bind(this);
  }

  close() {
    this.props.onClose();
  }

  render() {
    const snackbarMarginBottom = 32;

    return (
      <div
        className='position-fixed flex flex-center background-color-grey border-radius-6 user-select-none blur'
        style={{
          zIndex: 200,
          bottom: 0,
          left: 50 + '%',
          maxWidth: 'calc(100% - 20px)',
          marginBottom: snackbarMarginBottom + 'px',
          padding: '13px 16px 13px 21px',
          color: 'white',
          backgroundColor: this.props.color ? this.props.color : 'rgb(30, 30, 30, 0.8)',
          transform: 'translate(-50%, ' + (this.props.isOpen ? 0 : 'calc(100% + ' + snackbarMarginBottom + 'px)') + ')',
          transition: 'transform ' + snackbarAnimationTime + 'ms ease'
        }}
      >
        <div className='flex-1 truncate'>{tl(this.props.message)}</div>
        <div
          className='icon-color-white hover-icon-white'
          style={{marginLeft: 6 + 'px'}}
          onClick={() => this.close()}
        >
          <Icon source={CancelSmallMinor} />
        </div>
      </div>
    );
  }
}

export default SnackbarComponent;
