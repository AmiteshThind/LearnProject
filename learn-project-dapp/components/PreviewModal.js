import React from "react";
import ReactPlayer from "react-player";

function PreviewModal({ showModal, setShowModal, preview }) {
  return (
    <div>
      <label for="my-modal" class="btn modal-button">
        open modal
      </label>

      <input type="checkbox" id="my-modal" class="modal-toggle" />
      <div
        class="modal "
        visible={showModal}
        onCancel={() => setShowModal(!showModal)}
      >
        <div class="modal-box">
          <div>
            <ReactPlayer
              url={preview}
              playing={showModal}
              controls={true}
              width="100%"
              height="100%"
            />
          </div>
          <label for="my-modal" class="btn">
            Yay!
          </label>
        </div>
      </div>
    </div>
  );
}

export default PreviewModal;
