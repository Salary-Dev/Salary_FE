// eventEmitter.js
import { EventEmitter } from "events";

// 이벤트를 전역적으로 관리하고, 화면 간 상태 변경을
const DoneEventEmitter = new EventEmitter();

export default DoneEventEmitter;
