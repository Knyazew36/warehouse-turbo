const ErrorText = ({ message }: { message: string }) => {
  return <p className='mt-1 text-xs text-red-500'>{message}</p>
}

export default ErrorText
