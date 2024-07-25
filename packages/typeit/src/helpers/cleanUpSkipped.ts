import { QueueMapPair } from "../types";

// Ensure each skipped item goes through the cleanup process,
// so that methods like .flush() don't get messed up. There
// should only be a difference if the cursor moved.
const cleanUpSkipped = ({
  index,
  newIndex,
  queueItems,
  cleanUp,
}: {
  index: number;
  newIndex: number;
  queueItems: QueueMapPair[];
  cleanUp: (key: Symbol) => void;
}) => {
  for (let i = index + 1; i < newIndex + 1; i++) {
    cleanUp(queueItems[i][0]);
  }
};

export default cleanUpSkipped;
