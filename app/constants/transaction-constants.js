import { OPERATIONS_IDS } from 'echojs-lib';

export const OPERATION_ID_PREFIX = '1.11.';
export const ASSET_TYPE = 'ASSET';
export const TOKEN_TYPE = 'TOKEN';
// TEMP: remove after all types wiil be implemented by echodb
export const OPERATION_TYPES = [
	'TRANSFER',
	'ACCOUNT_CREATE',
	'ACCOUNT_UPDATE',
	'ACCOUNT_WHITELIST',
	'ACCOUNT_UPGRADE',
	'ACCOUNT_TRANSFER',
	'CONTRACT_CREATE',
	'CONTRACT_CALL',
];

export const OPTION_TYPES = {
	ACCOUNT: 'account',
	CONTRACT: 'contract',
	ASSET: 'asset',
	NUMBER: 'number',
	STRING: 'string',
};

export const TRANSFER_KEYS = {
	transfer: 'from',
	contract: 'registrar',
	48: 'registrar',
};

export const OPERATIONS = {
	transfer: {
		value: OPERATIONS_IDS.TRANSFER,
		name: 'operations.transfer.title',
		options: {
			from: {
				field: 'from',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.transfer.from',
			},
			subject: {
				field: 'to',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.transfer.subject',
			},
			amount: {
				field: 'amount.amount',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				field: 'amount.asset_id',
				type: OPTION_TYPES.ASSET,
			},
		},
	},
	limit_order_create: {
		value: OPERATIONS_IDS.LIMIT_ORDER_CREATE,
		name: 'operations.limit_order_create.title',
		options: {
			from: {
				field: 'seller',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.limit_order_create.from',
			},
			subject: null,
			amount: {
				field: 'amount_to_sell.amount',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				field: 'amount_to_sell.asset_id',
				type: OPTION_TYPES.ASSET,
			},
		},
	},
	limit_order_cancel: {
		value: OPERATIONS_IDS.LIMIT_ORDER_CANCEL,
		name: 'operations.limit_order_cancel.title',
		options: {
			from: {
				field: 'seller',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.limit_order_cancel.from',
			},
			subject: {
				field: 'order',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.limit_order_cancel.subject',
			},
			amount: null,
			asset: null,
		},
	},
	call_order_update: {
		value: OPERATIONS_IDS.CALL_ORDER_UPDATE,
		name: 'operations.call_order_update.title',
		options: {
			from: {
				field: 'funding_account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.call_order_update.from',
			},
			subject: null,
			amount: null,
			asset: null,
		},
	},
	fill_order: {
		value: OPERATIONS_IDS.FILL_ORDER,
		name: 'operations.fill_order.title',
		options: {
			from: {
				field: 'account_id',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.fill_order.from',
			},
			subject: {
				field: 'order_id',
				type: OPTION_TYPES.STRING,
				label: 'operations.fill_order.subject',
			},
			amount: {
				field: 'pays.amount',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				field: 'pays.asset_id',
				type: OPTION_TYPES.ASSET,
			},
		},
	},
	account_create: {
		value: OPERATIONS_IDS.ACCOUNT_CREATE,
		name: 'operations.account_create.title',
		options: {
			from: {
				field: 'registrar',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.account_create.from',
			},
			subject: {
				field: 'name',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.account_create.subject',
			},
			amount: null,
			asset: null,
		},
	},
	account_update: {
		value: OPERATIONS_IDS.ACCOUNT_UPDATE,
		name: 'operations.account_update.title',
		options: {
			from: {
				field: 'account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.account_update.from',
			},
			subject: null,
			amount: null,
			asset: null,
		},
	},
	account_whitelist: {
		value: OPERATIONS_IDS.ACCOUNT_WHITELIST,
		name: 'operations.account_whitelist.title',
		options: {
			from: {
				field: 'authorizing_account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.account_whitelist.from',
			},
			subject: {
				field: 'account_to_list',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.account_whitelist.subject',
			},
			amount: null,
			asset: null,
		},
	},
	account_upgrade: {
		value: OPERATIONS_IDS.ACCOUNT_UPGRADE,
		name: 'operations.account_upgrade.title',
		options: {
			from: {
				field: 'account_to_upgrade',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.account_upgrade.from',
			},
			subject: null,
			amount: null,
			asset: null,
		},
	},
	account_transfer: {
		value: OPERATIONS_IDS.ACCOUNT_TRANSFER,
		name: 'operations.account_transfer.title',
		options: {
			from: {
				field: 'account_id',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.account_transfer.from',
			},
			subject: {
				field: 'new_owner',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.account_transfer.subject',
			},
			amount: null,
			asset: null,
		},
	},
	asset_create: {
		value: OPERATIONS_IDS.ASSET_CREATE,
		name: 'operations.asset_create.title',
		options: {
			from: {
				field: 'issuer',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.asset_create.from',
			},
			subject: {
				field: 'symbol',
				type: OPTION_TYPES.STRING,
				label: 'operations.asset_create.subject',
			},
			amount: null,
			asset: null,
		},
	},
	asset_update: {
		value: OPERATIONS_IDS.ASSET_UPDATE,
		name: 'operations.asset_update.title',
		options: {
			from: {
				field: 'issuer',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.asset_update.from',
			},
			subject: {
				field: 'asset_to_update',
				type: OPTION_TYPES.ASSET,
				label: 'operations.asset_update.subject',
			},
			amount: null,
			asset: null,
		},
	},
	asset_update_bitasset: {
		value: OPERATIONS_IDS.ASSET_UPDATE_BITASSET,
		name: 'operations.asset_update_bitasset.title',
		options: {
			from: {
				field: 'issuer',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.asset_update_bitasset.from',
			},
			subject: {
				field: 'asset_to_update',
				type: OPTION_TYPES.ASSET,
				label: 'operations.asset_update_bitasset.subject',
			},
			amount: null,
			asset: null,
		},
	},
	asset_update_feed_producers: {
		value: OPERATIONS_IDS.ASSET_UPDATE_FEED_PRODUCERS,
		name: 'operations.asset_update_feed_producers.title',
		options: {
			from: {
				field: 'issuer',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.asset_update_feed_producers.from',
			},
			subject: {
				field: 'asset_to_update',
				type: OPTION_TYPES.ASSET,
				label: 'operations.asset_update_feed_producers.subject',
			},
			amount: null,
			asset: null,
		},
	},
	asset_issue: {
		value: OPERATIONS_IDS.ASSET_ISSUE,
		name: 'operations.asset_issue.title',
		options: {
			from: {
				field: 'issuer',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.asset_issue.from',
			},
			subject: {
				field: 'issue_to_account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.asset_issue.subject',
			},
			amount: {
				field: 'asset_to_issue.amount',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				field: 'asset_to_issue.asset_id',
				type: OPTION_TYPES.ASSET,
			},
		},
	},
	asset_reserve: {
		value: OPERATIONS_IDS.ASSET_RESERVE,
		name: 'operations.asset_reserve.title',
		options: {
			from: {
				field: 'payer',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.asset_reserve.from',
			},
			subject: null,
			amount: {
				field: 'amount_to_reserve.amount',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				field: 'amount_to_reserve.asset_id',
				type: OPTION_TYPES.ASSET,
			},
		},
	},
	asset_fund_fee_pool: {
		value: OPERATIONS_IDS.ASSET_FUND_FEE_POOL,
		name: 'operations.asset_fund_fee_pool.title',
		options: {
			from: {
				field: 'from_account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.asset_fund_fee_pool.from',
			},
			subject: null,
			amount: {
				field: 'amount',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				field: 'asset_id',
				type: OPTION_TYPES.ASSET,
			},
		},
	},
	asset_settle: {
		value: OPERATIONS_IDS.ASSET_SETTLE,
		name: 'operations.asset_settle.title',
		options: {
			from: {
				field: 'account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.asset_settle.from',
			},
			subject: null,
			amount: {
				field: 'amount.amount',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				field: 'amount.asset_id',
				type: OPTION_TYPES.ASSET,
			},
		},
	},
	asset_global_settle: {
		value: OPERATIONS_IDS.ASSET_GLOBAL_SETTLE,
		name: 'operations.asset_global_settle.title',
		options: {
			from: {
				field: 'issuer',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.asset_global_settle.from',
			},
			subject: null,
			amount: {
				field: 'settle_price',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				field: 'asset_to_settle',
				type: OPTION_TYPES.ASSET,
			},
		},
	},
	asset_publish_feed: {
		value: OPERATIONS_IDS.ASSET_PUBLISH_FEED,
		name: 'operations.asset_publish_feed.title',
		options: {
			from: {
				field: 'publisher',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.asset_publish_feed.from',
			},
			subject: {
				field: 'asset_id',
				type: OPTION_TYPES.ASSET,
				label: 'operations.asset_publish_feed.subject',
			},
			amount: {
				field: 'feed',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				field: 'asset_id',
				type: OPTION_TYPES.ASSET,
			},
		},
	},
	witness_create: {
		value: OPERATIONS_IDS.WITNESS_CREATE,
		name: 'operations.witness_create.title',
		options: {
			from: {
				field: 'witness_account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.witness_create.from',
			},
			subject: null,
			amount: null,
			asset: null,
		},
	},
	witness_update: {
		value: OPERATIONS_IDS.WITNESS_UPDATE,
		name: 'operations.witness_update.title',
		options: {
			from: {
				field: 'witness_account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.witness_update.from',
			},
			subject: {
				field: 'witness',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.witness_update.subject',
			},
			amount: null,
			asset: null,
		},
	},
	proposal_create: {
		value: OPERATIONS_IDS.PROPOSAL_CREATE,
		name: 'operations.proposal_create.title',
		options: {
			from: {
				field: 'fee_paying_account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.proposal_create.from',
			},
			subject: null,
			amount: null,
			asset: null,
		},
	},
	proposal_update: {
		value: OPERATIONS_IDS.PROPOSAL_UPDATE,
		name: 'operations.proposal_update.title',
		options: {
			from: {
				field: 'fee_paying_account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.proposal_update.from',
			},
			subject: null,
			amount: null,
			asset: null,
		},
	},
	proposal_delete: {
		value: OPERATIONS_IDS.PROPOSAL_DELETE,
		name: 'operations.proposal_delete.title',
		options: {
			from: {
				field: 'fee_paying_account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.proposal_delete.from',
			},
			subject: null,
			amount: null,
			asset: null,
		},
	},
	withdraw_permission_create: {
		value: OPERATIONS_IDS.WITHDRAW_PERMISSION_CREATE,
		name: 'operations.withdraw_permission_create.title',
		options: {
			from: {
				field: 'withdraw_from_account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.withdraw_permission_create.from',
			},
			subject: null,
			amount: null,
			asset: null,
		},
	},
	withdraw_permission_update: {
		value: OPERATIONS_IDS.WITHDRAW_PERMISSION_UPDATE,
		name: 'operations.withdraw_permission_update.title',
		options: {
			from: {
				field: 'withdraw_from_account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.withdraw_permission_update.from',
			},
			subject: null,
			amount: null,
			asset: null,
		},
	},
	withdraw_permission_claim: {
		value: OPERATIONS_IDS.WITHDRAW_PERMISSION_CLAIM,
		name: 'operations.withdraw_permission_claim.title',
		options: {
			from: {
				field: 'withdraw_from_account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.withdraw_permission_claim.from',
			},
			subject: {
				field: 'withdraw_to_account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.withdraw_permission_claim.subject',
			},
			amount: {
				field: 'amount_to_withdraw.amount',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				field: 'amount_to_withdraw.asset_id',
				type: OPTION_TYPES.ASSET,
			},
		},
	},
	withdraw_permission_delete: {
		value: OPERATIONS_IDS.WITHDRAW_PERMISSION_DELETE,
		name: 'operations.withdraw_permission_delete.title',
		options: {
			from: {
				field: 'withdraw_from_account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.withdraw_permission_delete.from',
			},
			subject: null,
			amount: null,
			asset: null,
		},
	},
	committee_member_create: {
		value: OPERATIONS_IDS.COMMITTEE_MEMBER_CREATE,
		name: 'operations.committee_member_create.title',
		options: {
			from: {
				field: 'committee_member_account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.committee_member_create.from',
			},
			subject: null,
			amount: null,
			asset: null,
		},
	},
	committee_member_update: {
		value: OPERATIONS_IDS.COMMITTEE_MEMBER_UPDATE,
		name: 'operations.committee_member_update.title',
		options: {
			from: {
				field: 'committee_member_account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.committee_member_update.from',
			},
			subject: null,
			amount: null,
			asset: null,
		},
	},
	committee_member_update_global_parameters: {
		value: OPERATIONS_IDS.COMMITTEE_MEMBER_UPDATE_GLOBAL_PARAMETERS,
		name: 'operations.committee_member_update_global_parameters.title',
		options: {
			from: null,
			subject: null,
			amount: null,
			asset: null,
		},
	},
	vesting_balance_create: {
		value: OPERATIONS_IDS.VESTING_BALANCE_CREATE,
		name: 'operations.vesting_balance_create.title',
		options: {
			from: {
				field: 'creator',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.vesting_balance_create.from',
			},
			subject: {
				field: 'owner',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.vesting_balance_create.subject',
			},
			amount: {
				field: 'amount.amount',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				field: 'amount.asset_id',
				type: OPTION_TYPES.ASSET,
			},
		},
	},
	vesting_balance_withdraw: {
		value: OPERATIONS_IDS.VESTING_BALANCE_WITHDRAW,
		name: 'operations.vesting_balance_withdraw.title',
		options: {
			from: {
				field: 'owner',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.vesting_balance_withdraw.from',
			},
			subject: null,
			amount: {
				field: 'amount.amount',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				field: 'amount.asset_id',
				type: OPTION_TYPES.ASSET,
			},
		},
	},
	worker_create: {
		value: OPERATIONS_IDS.WORKER_CREATE,
		name: 'operations.worker_create.title',
		options: {
			from: {
				field: 'owner',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.worker_create.from',
			},
			subject: {
				field: 'name',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.worker_create.subject',
			},
			amount: null,
			asset: null,
		},
	},
	custom: {
		value: OPERATIONS_IDS.CUSTOM,
		name: 'operations.custom.title',
		options: {
			from: {
				field: 'payer',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.custom.from',
			},
			subject: null,
			amount: null,
			asset: null,
		},
	},
	assert: {
		value: OPERATIONS_IDS.ASSERT,
		name: 'operations.assert.title',
		options: {
			from: {
				field: 'fee_paying_account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.assert.from',
			},
			subject: null,
			amount: null,
			asset: null,
		},
	},
	balance_claim: {
		value: OPERATIONS_IDS.BALANCE_CLAIM,
		name: 'operations.balance_claim.title',
		options: {
			from: null,
			subject: {
				field: 'deposit_to_account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.balance_claim.subject',
			},
			amount: null,
			asset: null,
		},
	},
	override_transfer: {
		value: OPERATIONS_IDS.OVERRIDE_TRANSFER,
		name: 'operations.override_transfer.title',
		options: {
			from: {
				field: 'from',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.override_transfer.from',
			},
			subject: {
				field: 'to',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.override_transfer.subject',
			},
			amount: {
				field: 'amount.amount',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				field: 'amount.asset_id',
				type: OPTION_TYPES.ASSET,
			},
		},
	},
	transfer_to_blind: {
		value: OPERATIONS_IDS.TRANSFER_TO_BLIND,
		name: 'operations.transfer_to_blind.title',
		options: {
			from: {
				field: 'from',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.transfer_to_blind.from',
			},
			subject: null,
			amount: {
				field: 'amount.amount',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				field: 'amount.asset_id',
				type: OPTION_TYPES.ASSET,
			},
		},
	},
	blind_transfer: {
		value: OPERATIONS_IDS.BLIND_TRANSFER,
		name: 'operations.blind_transfer.title',
		options: {
			from: null,
			subject: null,
			amount: null,
			asset: null,
		},
	},
	transfer_from_blind: {
		value: OPERATIONS_IDS.TRANSFER_FROM_BLIND,
		name: 'operations.transfer_from_blind.title',
		options: {
			from: null,
			subject: {
				field: 'to',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.transfer_from_blind.subject',
			},
			amount: {
				field: 'amount.amount',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				field: 'amount.asset_id',
				type: OPTION_TYPES.ASSET,
			},
		},
	},
	asset_settle_cancel: {
		value: OPERATIONS_IDS.ASSET_SETTLE_CANCEL,
		name: 'operations.asset_settle_cancel.title',
		options: {
			from: {
				field: 'account',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.asset_settle_cancel.from',
			},
			subject: null,
			amount: {
				field: 'amount.amount',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				field: 'amount.asset_id',
				type: OPTION_TYPES.ASSET,
			},
		},
	},
	asset_claim_fees: {
		value: OPERATIONS_IDS.ASSET_CLAIM_FEES,
		name: 'operations.asset_claim_fees.title',
		options: {
			from: {
				field: 'issuer',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.asset_claim_fees.from',
			},
			subject: null,
			amount: {
				field: 'amount_to_claim.amount',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				field: 'amount_to_claim.asset_id',
				type: OPTION_TYPES.ASSET,
			},
		},
	},
	// FBA_DISTRIBUTE = 44,
	// BID_COLLATERAL = 45,
	// EXECUTE_BID = 46,
	contract_create: {
		value: OPERATIONS_IDS.CREATE_CONTRACT,
		name: 'operations.contract_create.title',
		options: {
			from: {
				field: 'registrar',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.contract_create.from',
			},
			subject: null,
			amount: {
				field: 'value.amount',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				field: 'value.asset_id',
				type: OPTION_TYPES.ASSET,
			},
		},
	},
	contract_call: {
		value: OPERATIONS_IDS.CALL_CONTRACT,
		name: 'operations.contract_call.title',
		options: {
			from: {
				field: 'registrar',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.contract_call.from',
			},
			subject: {
				field: 'callee',
				type: OPTION_TYPES.CONTRACT,
				label: 'operations.contract_call.subject',
			},
			amount: {
				field: 'value.amount',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				field: 'value.asset_id',
				type: OPTION_TYPES.ASSET,
			},
		},
	},
	contract_transfer: {
		value: OPERATIONS_IDS.CONTRACT_TRANSFER,
		name: 'operations.contract_transfer.title',
		options: {
			from: {
				field: 'from',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.contract_transfer.from',
			},
			subject: {
				field: 'to',
				type: OPTION_TYPES.ACCOUNT,
				label: 'operations.contract_transfer.subject',
			},
			amount: {
				field: 'amount.amount',
				type: OPTION_TYPES.NUMBER,
			},
			asset: {
				field: 'amount.asset_id',
				type: OPTION_TYPES.ASSET,
			},
		},
	},
};
