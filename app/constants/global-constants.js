export const DB_NAME = 'keyval-store';
export const STORE = 'keyval';
export const ENCRYPTED_DB_NAME = 'db';
export const ALGORITHM = 'aes-256-cbc';
export const SCRYPT_ALGORITHM_PARAMS = {
	N: 2 ** 14,
	r: 8,
	p: 1,
	l: 32,
	SALT_BYTES_LENGTH: 256,
};
export const ALGORITHM_IV_BYTES_LENGTH = 16;

export const NETWORKS = {
	devnet: {
		remote: {
			name: 'Remote node',
			url: 'wss://devnet.echo-dev.io/ws',
		},
		local: {
			name: 'Local node',
			url: 'ws://127.0.0.1:8090', // there must be a local node
		},
	},
};

export const EXPLORER_URL = {
	devnet: 'https://656-echo-explorer.pixelplex-test.by',
};

export const QR_SERVER_URL = 'https://649-bridge-landing.pixelplexlabs.com/receive/';

export const ECHO_ASSET_ID = '1.3.0';
export const ECHO_ASSET_PRECISION = 5;
export const ECHO_ASSET_SYMBOL = 'ECHO';
export const GLOBAL_ID_1 = '2.1.0';
export const ECHO_PROXY_TO_SELF_ACCOUNT = '1.2.5';
export const CONTRACT_ID_PREFIX = '1.14';
export const EETH_ASSET_SYMBOL = 'EETH';

export const DISCONNECT_STATUS = 'disconnect';
export const CONNECT_STATUS = 'connect';
export const ACTIVE_KEY = 'active';

export const REMOTE_NODE = 'remote';
export const LOCAL_NODE = 'local';

export const RANDOM_SIZE = 2048;
export const ECHORANDKEY_SIZE = 47;

export const NAME_MIN_LENGTH = 1;
export const NAME_MAX_LENGTH = 63;

export const CONNECTION_TIMEOUT = 5000;
export const MAX_RETRIES = 999999999;
export const PING_TIMEOUT = 7000;
export const PING_INTERVAL = 7000;

export const BROADCAST_LIMIT = 20 * 1000;
export const EXPIRATION_INFELICITY = 5 * 60;

export const EN_LOCALE = 'en';
export const RU_LOCALE = 'ru';

export const LOCK_TIMEOUT = 3 * 60 * 1000; // 3 min
export const TIME_LOADING = 1000; // 1s
export const TIME_SHOW_ERROR_ASSET = 10000; // 10s

export const LOCK_TIMER_EVENTS = [
	// 'mousemove',
	'keydown',
	'wheel',
	'DOMMouseScroll',
	'mouseWheel',
	'mousedown',
	'touchstart',
	'touchmove',
	'MSPointerDown',
	'MSPointerMove',
];

export const KEY_CODE_ENTER = 13;
export const KEY_CODE_SPACE = 32;
export const KEY_CODE_TAB = 9;
export const KEY_CODE_ARROW_UP = 38;
export const KEY_CODE_ARROW_DOWN = 40;

export const DEFAULT_MEMO_KEY = 'ECHO1111111111111111111111111111111114T1Anm';
export const TEMPLATE_ECHO_KEY = 'DET5Ho3JQJf8WUnLBtxZhrfL8bJc4uCVda6Ku5SUeAbcNAB';

export const APP_WINDOW_WIDTH = 1024;
export const APP_WINDOW_HEIGHT = 728;
export const APP_WINDOW_MIN_WIDTH = 1024;
export const APP_WINDOW_MIN_HEIGHT = 728;
export const TIMEOUT_BEFORE_APP_PROCESS_EXITS_MS = 12000;
