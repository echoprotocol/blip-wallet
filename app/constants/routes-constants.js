export const AUTHORIZATION = '/authorization';
export const ACCOUNT_CREATED = '/account-created';
export const ACCOUNT_IMPORTED = '/account-imported';
export const CREATE_PASSWORD = '/create-password';
export const RESTORE_PASSWORD = '/restore-password';
export const SELECT_LANGUAGE = '/select-language';
export const WALLET = '/wallet';
export const UNLOCK = 'unlock';
export const PAGE404 = '/page404';
export const INDEX_ROUTE = '/';

export const PUBLIC_ROUTES = [
	ACCOUNT_CREATED, AUTHORIZATION,
	ACCOUNT_IMPORTED, CREATE_PASSWORD,
	RESTORE_PASSWORD, SELECT_LANGUAGE, PAGE404,
	WALLET,
];


export const LOCKED_ROUTES = [
	ACCOUNT_CREATED, AUTHORIZATION,	ACCOUNT_IMPORTED, WALLET,
];


export const SIDE_MENU_ROUTES = [WALLET];
