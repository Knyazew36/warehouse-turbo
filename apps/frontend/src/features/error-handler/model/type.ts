export interface ErrorEventEmitter {
	message?: string
	action: 'modal' | 'logout' | 'navigation' | 'console' | 'pay-modal'
	href?: string
	isNavigateBackOnClick?: boolean
}
