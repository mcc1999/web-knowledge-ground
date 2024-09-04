import styles from "./index.module.scss";
import classnames from "classnames";

const KeyboardKey: React.FC<{
  keyNames: string[];
  className?: string;
  active?: boolean;
}> = ({ keyNames, className, active }) => {
  return (
    <div
      className={classnames(
        styles.container,
        className,
        active ? styles.active : ""
      )}
    >
      <div className={styles["text-container"]}>
        {keyNames.map((name) => (
          <i key={name}>{name}</i>
        ))}
      </div>
    </div>
  );
};

export default KeyboardKey;
