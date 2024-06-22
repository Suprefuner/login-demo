interface FormRowProps {
  fieldName: string
  value: string
  handleChange: any
}

export default function FormRow({
  fieldName,
  value,
  handleChange
}: FormRowProps) {
  
  const onChange = (e:any) => {
    handleChange(e.target.value)
  }

  return (
    <div className="space-y-1">
      <label htmlFor={fieldName}>{fieldName}</label>
      <input 
        type={!fieldName.includes('password') ? 'text' : 'password'} 
        id={fieldName} 
        className="w-full p-2 border" 
        name={fieldName}
        value={value} 
        onChange={onChange}/>
    </div>
  )
}