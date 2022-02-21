import React from "react";
import { ChoiceList, Icon, Modal } from "@shopify/polaris";
import { CancelSmallMinor } from "@shopify/polaris-icons";
import { getAvailableLocale, tl, tlByte } from "../shared/translation";
import PixxioJsdk from "./components/pixxio-jsdk";
import UpdateResourcesComponent from "./components/update-resources";

const apiKey = "iM91iRu6kb86Y6IaWMsK9T9q7";

class MainPage extends React.Component {
  state = {
    appKey: apiKey,
    language: getAvailableLocale(),
    isSelectedFilesModalOpen: false,
    selectedFiles: [],
    isResourcePickerOpen: false,
    selectedExport: "Product",
  };

  onRemoveFile = (file) => {
    const newStateFiles = this.state.selectedFiles.filter(
      (f) => f.id !== file.id
    );
    this.setState({ selectedFiles: newStateFiles });
    if (newStateFiles.length < 1) {
      this.setState({ isSelectedFilesModalOpen: false });
    }
  };

  getExportChoiceList() {
    const exportChoices = [
      {
        value: "Product",
        label: tl("products"),
        helpText: "",
        disabled: false,
      },
      {
        value: "Collection",
        label: tl("collections"),
        helpText: "",
        disabled: false,
      },
    ];

    if (this.state?.selectedFiles) {
      const collectionChoice = exportChoices.find(
        (choice) => choice.value === "Collection"
      );
      const isSelectionMoreThanOne = this.state.selectedFiles.length > 1;
      collectionChoice.helpText = isSelectionMoreThanOne
        ? tl("collectionsSelectionInfo")
        : "";
      collectionChoice.disabled = isSelectionMoreThanOne;
    }

    return exportChoices;
  }

  render() {
    const exportChoices = this.getExportChoiceList();

    return (
      <div className="appContainer">
        <PixxioJsdk
          appKey={this.state.appKey}
          language={this.state.language}
          onSelection={(files) => {
            if (files?.length > 1) {
              this.setState({ selectedExport: "Product" });
            }
            this.setState({
              selectedFiles: files ? files.reverse() : [],
              isSelectedFilesModalOpen: true,
            });
          }}
        />

        <Modal
          open={this.state.isSelectedFilesModalOpen}
          title={tl("yourSelection")}
          onClose={() => this.setState({ isSelectedFilesModalOpen: false })}
          primaryAction={{
            content: tl("continue"),
            onAction: () =>
              this.setState({
                isSelectedFilesModalOpen: false,
                isResourcePickerOpen: true,
              }),
          }}
          secondaryActions={[
            {
              content: tl("cancel"),
              onAction: () =>
                this.setState({ isSelectedFilesModalOpen: false }),
            },
          ]}
        >
          <Modal.Section>
            <ChoiceList
              title={tl("export")}
              choices={exportChoices}
              selected={this.state.selectedExport}
              onChange={(value) => this.setState({ selectedExport: value[0] })}
            />
          </Modal.Section>
          <Modal.Section>
            <legend style={{ marginBottom: "4px" }}>Selected files</legend>
            {this.state.selectedFiles.map((file) => {
              return (
                <div
                  key={file.id}
                  className="flex flex-center border-bottom border-none-last-item"
                  style={{ padding: "6px 0" }}
                >
                  <img
                    src={file.thumbnail}
                    style={{
                      height: 90 + "px",
                      width: 160 + "px",
                      objectFit: "contain",
                    }}
                  />
                  <div
                    className="flex-1 flex flex-column"
                    style={{ overflow: "hidden", margin: "0 12px" }}
                  >
                    <span className="truncate">{file.file.fileName}</span>
                    <span
                      className="truncate"
                      style={{
                        opacity: ".7",
                        marginTop: 4 + "px",
                        fontSize: 12 + "px",
                      }}
                    >
                      {tlByte(file.file.fileSize)}
                    </span>
                  </div>
                  <div
                    className="icon-color hover-icon"
                    onClick={() => this.onRemoveFile(file)}
                  >
                    <Icon source={CancelSmallMinor} />
                  </div>
                </div>
              );
            })}
          </Modal.Section>
        </Modal>

        <UpdateResourcesComponent
          selectedFiles={this.state.selectedFiles}
          selectedExport={this.state.selectedExport}
          isResourcePickerOpen={this.state.isResourcePickerOpen}
          onClose={() => this.setState({ isResourcePickerOpen: false })}
        />
      </div>
    );
  }
}

export default MainPage;
