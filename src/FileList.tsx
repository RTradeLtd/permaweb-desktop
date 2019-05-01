import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { List, Button } from "semantic-ui-react";
// @ts-ignore
import { toast } from "react-semantic-toasts";
import DeleteButton from "./DeleteButton";
import Store, { UIFile } from "./Store";

interface FileListProps {
  store: Store;
}

@inject("store")
@observer
class FileList extends Component<FileListProps> {
  linkRef?: HTMLInputElement;
  showFile = (key: string) => {
    console.log("selecting", key);
    console.log(this.props.store.files);
    this.props.store.selectFile(key);
    // not really needed anymore as the file raw data is collected on init
    // let file = this.props.store.getFileFromName(filename);
    // Content is now in file.stored.<whatever>
    // if (file) {
    //   this.props.store.getFileContent(file.hash, file.key);
    // }
  };
  copyLinkToClipboard = (file: UIFile) => {
    if (file && this.linkRef) {
      this.linkRef.value = `https://getepona.herokuapp.com?hash=${
        file.hash
      }&key=${file.key}`;
      this.linkRef.select();
      document.execCommand("copy");

      toast({
        title: "Success",
        description: "Copied link to clipboard"
      });
    }
  };
  render() {
    const linkStyle = {
      color: "inherit",
      border: "none",
      padding: "0",
      font: "inherit",
      cursor: "pointer",
      background: "none"
    };
    const { files } = this.props.store;
    if (!files) {
      return null;
    }

    if (Object.keys(files).length <= 0) {
      return (
        <div>
          <p>There are no files in your folder.</p>
        </div>
      );
    } else {
      return (
        <div>
          <input
            style={{ position: "absolute", left: "-9999px" }}
            ref={(c: HTMLInputElement) => {
              this.linkRef = c || undefined;
            }}
          />
          <List>
            {Object.keys(files).map(id => (
              <List.Item
                icon="file"
                key={id}
                content={
                  <div>
                    <button style={linkStyle} onClick={() => this.showFile(id)}>
                      {files[id][0].caption}
                    </button>
                    <div style={{ float: "right" }}>
                      <Button
                        size="mini"
                        onClick={() => {
                          this.copyLinkToClipboard(files[id][0]);
                        }}
                      >
                        Copy Link
                      </Button>
                      <DeleteButton id={id} />
                    </div>
                    <br />
                  </div>
                }
              />
            ))}
          </List>
        </div>
      );
    }
  }
}

export default FileList;
