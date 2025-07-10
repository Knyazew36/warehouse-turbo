export enum ErrorEnums {
	ERROR_IMAGE_NOT_FOUND = 'error_image_not_found',
	ERROR_DATA_IMAGE_FATHER_MIME = 'error_data_image_father_mime',
	ERROR_DATA_IMAGE_MOTHER_MIME = 'error_data_image_mother_mime',
	ERROR_NOT_ENOUGH_TOKENS = 'error_not_enough_tokens'
}

export const errorMap: Record<keyof typeof ErrorEnums, string> = {
	ERROR_IMAGE_NOT_FOUND: 'Image not found',
	ERROR_DATA_IMAGE_FATHER_MIME: 'Father image mime type is not supported',
	ERROR_DATA_IMAGE_MOTHER_MIME: 'Mother image mime type is not supported',
	ERROR_NOT_ENOUGH_TOKENS: 'Not enough tokens'
}
