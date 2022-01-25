import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { ResourcePicker } from '@shopify/app-bridge-react';
import SnackbarComponent, { snackbarAnimationTime } from './snackbar';
import { tl } from '../shared/translation';

const APPEND_IMAGES = gql`
  mutation productAppendImages($input: ProductAppendImagesInput!) {
    productAppendImages(input: $input) {
      newImages {
        altText
        src
      }
    }
  }
`;

const UPDATE_COLLECTIONS = gql`
  mutation collectionUpdate($input: CollectionInput!) {
    collectionUpdate(input: $input) {
      collection {
        image {
          altText
          src
        }
      }
    }
  }
`;

class UpdateResourcesComponent extends React.Component {
  constructor(props) {
    super(props);
    this.onClose = this.close.bind(this);
  }

  state = {
    isSnackbarOpen: false,
    snackbarMessage: '',
    hasError: false
  };

  getMutation() {
    switch (this.props.selectedExport) {
      case 'Product':
        return APPEND_IMAGES;
      case 'Collection':
        return UPDATE_COLLECTIONS;
    }
  }

  onResourceSelection(resources, handleSubmit) {
    switch (this.props.selectedExport) {
      case 'Product':
        this.updateProductsImages(resources, handleSubmit);
        break;
      case 'Collection':
        this.updateCollectionsImage(resources, handleSubmit);
        break;
    }

    this.close();
  }

  updateProductsImages(resources, handleSubmit) {
    this.setState({ hasError: false });
    const selectedFiles = this.props.selectedFiles;
    this.delaySnackbarIfAlreadyOpen(this.openStartSnackbar, selectedFiles);

    let promise = new Promise((resolve) => resolve());

    const selectedImages = [];
    for (const selectedFile of selectedFiles) {
      selectedImages.push({ altText: selectedFile.file.fileName, src: selectedFile.url });
    }
    for (const selection of resources.selection) {
      promise = promise
        .then(() => handleSubmit({ variables: { input: { id: selection.id, images: selectedImages } } }))
        .catch(() => this.delaySnackbarIfAlreadyOpen(this.openErrorSnackbar));
    }

    if (promise) {
      promise
        .then(() => this.delaySnackbarIfAlreadyOpen(this.openFinishedSnackbar, selectedFiles))
        .catch(() => this.delaySnackbarIfAlreadyOpen(this.openErrorSnackbar));
    }
  }

  updateCollectionsImage(resources, handleSubmit) {
    this.setState({ hasError: false });
    const selectedFiles = this.props.selectedFiles;
    this.delaySnackbarIfAlreadyOpen(this.openStartSnackbar, selectedFiles);

    let promise = new Promise((resolve) => resolve());

    const selectedFile = selectedFiles[0];
    const selectedImage = { altText: selectedFile.file.fileName, src: selectedFile.url };
    for (const selection of resources.selection) {
      promise = promise
        .then(() => handleSubmit({ variables: { input: { id: selection.id, image: selectedImage } } }))
        .catch(() => this.delaySnackbarIfAlreadyOpen(this.openErrorSnackbar));
    }

    if (promise) {
      promise
        .then(() => this.delaySnackbarIfAlreadyOpen(this.openFinishedSnackbar))
        .catch(() => this.delaySnackbarIfAlreadyOpen(this.openErrorSnackbar));
    }
  }

  delaySnackbarIfAlreadyOpen(callback, selectedFiles = []) {
    const me = this;
    if (this.state.isSnackbarOpen) {
      this.setState({ isSnackbarOpen: false });
      setTimeout(() => callback(me, selectedFiles), snackbarAnimationTime);
    } else {
      callback(me, selectedFiles);
    }
  }

  openStartSnackbar(me, selectedFiles) {
    const messageStart = selectedFiles.length > 1 ? tl('imagesUploading', [selectedFiles.length]) : tl('imageUploading');
    me.setState({ isSnackbarOpen: true, snackbarMessage: messageStart });
  }

  openFinishedSnackbar(me, selectedFiles) {
    const messageFinished = selectedFiles.length > 1 ? tl('imagesUploadFinished', [selectedFiles.length]) : tl('imageUploadFinished');
    me.setState({ isSnackbarOpen: true, snackbarMessage: messageFinished });
  };

  openErrorSnackbar(me) {
    const messageError = tl('uploadError');
    me.setState({ hasError: true, isSnackbarOpen: true, snackbarMessage: messageError });
  }

  close() {
    this.props.onClose();
  }

  render() {
    const renderResourcePicker = () => {
      if (this.props.isResourcePickerOpen) {
        return (
          <Mutation mutation={this.getMutation()}>
            {(handleSubmit, { error }) => {
              if (error) {
                return null;
              } else {
                return (
                  <ResourcePicker
                    resourceType={this.props.selectedExport}
                    showVariants={false}
                    open={this.props.isResourcePickerOpen}
                    onCancel={() => this.close()}
                    onSelection={resources => this.onResourceSelection(resources, handleSubmit)}
                  />
                );
              }
            }}
          </Mutation>
        );
      } else {
        return null;
      }
    };

    return (
      <div>
        <SnackbarComponent
          isOpen={this.state.isSnackbarOpen}
          message={this.state.snackbarMessage}
          color={this.state.hasError ? '#EE6D7C' : ''}
          onClose={() => this.setState({ isSnackbarOpen: false })}
        />
        {renderResourcePicker()}
      </div>
    );
  }
}

export default UpdateResourcesComponent;
