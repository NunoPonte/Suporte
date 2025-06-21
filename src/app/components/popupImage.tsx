/* eslint-disable @next/next/no-img-element */
import styles from "./popupImage.module.css";

interface PopupImageProps {
  popupImage: string | null;
  setPopupImage: (image: string | null) => void;
}

export default function PopupImage({
  popupImage,
  setPopupImage,
}: PopupImageProps) {
  return popupImage ? (
    <div className={styles.popupOverlay} onClick={() => setPopupImage(null)}>
      <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
        <img src={popupImage} alt="Preview" className={styles.popupImage} />
        <button
          className={styles.closeButton}
          onClick={() => setPopupImage(null)}
        >
          &times;
        </button>
      </div>
    </div>
  ) : null;
}
