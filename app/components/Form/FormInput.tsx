import type { InputProps } from "~/interfaces/InputProps"

export const FormInput = (props: InputProps) => {
    return(
        <div>
            <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-2">
                {props.label}
            </label>
            <input
                type={props.type}
                id={props.id}
                name={props.name}
                value={props.value}
                onChange={props.onChange}
                placeholder={props.placeholder}
                className="w-full px-4 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-colors bg-gray-50 focus:bg-white"
                required={props.required}
            />
        </div>
    )
}
