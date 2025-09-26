
interface InputProps {
    label: string;
    type: string;
    id: string;
    name: string;
    value: string;
    placeholder?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    button?: React.ReactNode;
    icon?: React.ReactNode;
}

export type { InputProps }