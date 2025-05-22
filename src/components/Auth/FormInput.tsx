import styled from 'styled-components';

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: none;
  border-radius: 8px;
  background-color: #333;
  color: #fff;
  font-size: 1rem;
  outline: none;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #ccc;
`;

const ErrorText = styled.p`
  color: #ff4d4d;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

interface FormInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  placeholder = '',
}) => {
  return (
    <div>
      <Label>{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
};

export default FormInput;
export type { FormInputProps };