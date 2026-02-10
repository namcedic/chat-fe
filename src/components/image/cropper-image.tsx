import { Modal } from 'antd';
import React, { Component } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';

interface ICropperImageProps {
  src: string;
  close: () => void;
  open: boolean;
  ratio: number;
  title?: string;
  width?: string;
  onCrop: (canvas: HTMLCanvasElement) => void;
}

class CropperImage extends Component<ICropperImageProps> {
  private cropper: Cropper | undefined;

  constructor(props: ICropperImageProps) {
    super(props);
    this.state = {};
    this.cropImage = this.cropImage.bind(this);
  }

  cropImage() {
    if (!this.cropper || typeof this.cropper.getCroppedCanvas() === 'undefined') return;
    const canvas = this.cropper.getCroppedCanvas();
    this.props.onCrop(canvas);
  }

  render() {
    const { src, close, open, ratio, title, width } = this.props;
    return (
      <Modal
        title={title}
        open={open}
        mask={false}
        maskClosable={false}
        width={width ? width : '520px'}
        footer={null}
        onOk={close}
        onCancel={close}
      >
        <Cropper
          guides={false}
          aspectRatio={ratio}
          onInitialized={(instance) => {
            this.cropper = instance;
          }}
          src={src}
          style={{ height: '350px', width: '100%' }}
        />
        <div className="record-info">
          <div className="text-end">
            <button type="button" onClick={close} className="btn btn-danger">
              <DeleteOutlined /> Hủy bỏ
            </button>
            <button type="button" onClick={this.cropImage} className="btn btn-primary">
              <CopyOutlined /> Lưu
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default CropperImage;
